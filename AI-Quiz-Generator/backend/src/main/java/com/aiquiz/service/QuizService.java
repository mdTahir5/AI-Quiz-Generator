package com.aiquiz.service;

import com.aiquiz.dto.quiz.*;
import com.aiquiz.entity.QuizAttempt;
import com.aiquiz.entity.QuizQuestion;
import com.aiquiz.entity.SubjectStat;
import com.aiquiz.entity.User;
import com.aiquiz.exception.ResourceNotFoundException;
import com.aiquiz.repository.QuizAttemptRepository;
import com.aiquiz.repository.QuizQuestionRepository;
import com.aiquiz.repository.SubjectStatRepository;
import com.aiquiz.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {

    private final OpenRouterService openRouterService;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final SubjectStatRepository subjectStatRepository;

    public QuizService(OpenRouterService openRouterService,
                       UserRepository userRepository,
                       QuizAttemptRepository quizAttemptRepository,
                       QuizQuestionRepository quizQuestionRepository,
                       SubjectStatRepository subjectStatRepository) {
        this.openRouterService = openRouterService;
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.subjectStatRepository = subjectStatRepository;
    }

    public List<QuizQuestionDto> generateQuiz(QuizGenerateRequest request) {
        return openRouterService.generateQuestions(
                request.getSubject(),
                request.getNumberOfQuestions(),
                request.getDifficulty()
        );
    }

    @Transactional
    public QuizResultResponse submitQuiz(String userEmail, QuizSubmissionRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        int correctCount = 0;
        int incorrectCount = 0;
        int unattemptedCount = 0;
        int totalScore = 0;
        int totalQuestions = request.getAnswers().size();

        List<QuizResultResponse.QuestionDetail> details = new ArrayList<>();
        List<QuizQuestion> questionEntities = new ArrayList<>();

        for (QuestionAnswerSubmission sub : request.getAnswers()) {
            String selected = sub.getSelectedAnswer() != null ? sub.getSelectedAnswer().trim().toUpperCase() : "";
            String correct = sub.getCorrectAnswer() != null ? sub.getCorrectAnswer().trim().toUpperCase() : "";

            boolean isAttempted = !selected.isEmpty();
            boolean isCorrect = isAttempted && selected.equalsIgnoreCase(correct);

            int scoreDelta = 0;
            if (isCorrect) {
                correctCount++;
                scoreDelta = 4;
            } else if (isAttempted) {
                incorrectCount++;
                scoreDelta = -1;
            } else {
                unattemptedCount++;
                scoreDelta = 0;
            }
            totalScore += scoreDelta;

            QuizResultResponse.QuestionDetail detail = new QuizResultResponse.QuestionDetail(
                    sub.getQuestionText(),
                    sub.getOptionA(),
                    sub.getOptionB(),
                    sub.getOptionC(),
                    sub.getOptionD(),
                    correct,
                    isAttempted ? selected : null,
                    isCorrect,
                    sub.getExplanation(),
                    scoreDelta
            );
            details.add(detail);
        }

        // Calculate rating change (Codeforces style)
        int attemptedCount = correctCount + incorrectCount;
        double accuracy = attemptedCount > 0 ? ((double) correctCount / attemptedCount) * 100.0 : 0.0;
        int previousRating = user.getRating();
        int ratingDelta = calculateRatingDelta(accuracy, request.getDifficulty(), attemptedCount, totalQuestions);
        int newRating = Math.max(800, previousRating + ratingDelta);

        // Save QuizAttempt
        QuizAttempt attempt = new QuizAttempt(
                user,
                request.getSubject(),
                request.getDifficulty(),
                totalQuestions,
                correctCount,
                incorrectCount,
                unattemptedCount,
                totalScore,
                newRating
        );
        attempt = quizAttemptRepository.save(attempt);

        // Save QuizQuestions
        for (QuizResultResponse.QuestionDetail d : details) {
            QuizQuestion qq = new QuizQuestion(
                    attempt,
                    d.getQuestionText(),
                    d.getOptionA(),
                    d.getOptionB(),
                    d.getOptionC(),
                    d.getOptionD(),
                    d.getCorrectAnswer(),
                    d.getSelectedAnswer(),
                    d.getIsCorrect(),
                    d.getExplanation()
            );
            questionEntities.add(qq);
        }
        quizQuestionRepository.saveAll(questionEntities);

        // Update User statistics
        user.setTotalQuestionsSolved(user.getTotalQuestionsSolved() + attemptedCount);
        user.setCorrectAnswers(user.getCorrectAnswers() + correctCount);
        user.setIncorrectAnswers(user.getIncorrectAnswers() + incorrectCount);
        user.setTotalScore(user.getTotalScore() + totalScore);
        user.setRating(newRating);
        userRepository.save(user);

        // Update SubjectStat
        SubjectStat subjectStat = subjectStatRepository.findByUserAndSubject(user, request.getSubject())
                .orElse(new SubjectStat(user, request.getSubject()));
        subjectStat.setTotalAttempted(subjectStat.getTotalAttempted() + attemptedCount);
        subjectStat.setCorrectCount(subjectStat.getCorrectCount() + correctCount);
        subjectStat.setIncorrectCount(subjectStat.getIncorrectCount() + incorrectCount);
        subjectStat.setTotalScore(subjectStat.getTotalScore() + totalScore);
        subjectStat.setUpdatedAt(LocalDateTime.now());
        subjectStatRepository.save(subjectStat);

        // Prepare response
        QuizResultResponse response = new QuizResultResponse();
        response.setAttemptId(attempt.getId());
        response.setSubject(request.getSubject());
        response.setDifficulty(request.getDifficulty());
        response.setTotalQuestions(totalQuestions);
        response.setCorrectCount(correctCount);
        response.setIncorrectCount(incorrectCount);
        response.setUnattemptedCount(unattemptedCount);
        response.setScore(totalScore);
        response.setMaxPossibleScore(totalQuestions * 4);
        response.setAccuracyPercentage(Math.round(accuracy * 10.0) / 10.0);
        response.setPreviousRating(previousRating);
        response.setNewRating(newRating);
        response.setRatingDelta(ratingDelta);
        response.setQuestionDetails(details);

        return response;
    }

    private int calculateRatingDelta(double accuracy, String difficulty, int attempted, int totalQuestions) {
        if (attempted == 0) return 0;
        int baseDelta;
        if (accuracy >= 90.0) baseDelta = 60;
        else if (accuracy >= 75.0) baseDelta = 40;
        else if (accuracy >= 55.0) baseDelta = 20;
        else if (accuracy >= 40.0) baseDelta = 5;
        else if (accuracy >= 25.0) baseDelta = -15;
        else baseDelta = -30;

        // Difficulty multiplier
        if ("Hard".equalsIgnoreCase(difficulty)) baseDelta += 15;
        else if ("Medium".equalsIgnoreCase(difficulty)) baseDelta += 5;

        // Scale by completion ratio
        double ratio = (double) attempted / totalQuestions;
        return (int) Math.round(baseDelta * ratio);
    }
}
