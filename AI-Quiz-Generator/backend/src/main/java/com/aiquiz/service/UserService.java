package com.aiquiz.service;

import com.aiquiz.dto.profile.ScoreHistoryDto;
import com.aiquiz.dto.profile.SubjectStatDto;
import com.aiquiz.dto.profile.UserProfileDto;
import com.aiquiz.dto.leaderboard.LeaderboardUserDto;
import com.aiquiz.entity.QuizAttempt;
import com.aiquiz.entity.SubjectStat;
import com.aiquiz.entity.User;
import com.aiquiz.exception.ResourceNotFoundException;
import com.aiquiz.repository.QuizAttemptRepository;
import com.aiquiz.repository.SubjectStatRepository;
import com.aiquiz.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final SubjectStatRepository subjectStatRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
    private static final DateTimeFormatter JOIN_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy");

    public UserService(UserRepository userRepository,
                       QuizAttemptRepository quizAttemptRepository,
                       SubjectStatRepository subjectStatRepository) {
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.subjectStatRepository = subjectStatRepository;
    }

    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAge(user.getAge());
        dto.setAddress(user.getAddress());
        dto.setSchoolOrInstitute(user.getSchoolOrInstitute());
        dto.setTotalQuestionsSolved(user.getTotalQuestionsSolved());
        dto.setCorrectAnswers(user.getCorrectAnswers());
        dto.setIncorrectAnswers(user.getIncorrectAnswers());
        dto.setTotalScore(user.getTotalScore());
        dto.setRating(user.getRating());
        dto.setRankTier(LeaderboardUserDto.determineTier(user.getRating()));

        int totalAnswered = user.getCorrectAnswers() + user.getIncorrectAnswers();
        double accuracy = totalAnswered > 0 ? ((double) user.getCorrectAnswers() / totalAnswered) * 100.0 : 0.0;
        dto.setOverallAccuracy(Math.round(accuracy * 10.0) / 10.0);
        dto.setJoinedDate(user.getCreatedAt().format(JOIN_FORMATTER));

        // Subject stats
        List<SubjectStat> subjectStats = subjectStatRepository.findByUser(user);
        List<SubjectStatDto> subjectStatDtos = new ArrayList<>();
        for (SubjectStat ss : subjectStats) {
            subjectStatDtos.add(new SubjectStatDto(
                    ss.getSubject(),
                    ss.getTotalAttempted(),
                    ss.getCorrectCount(),
                    ss.getIncorrectCount(),
                    ss.getTotalScore()
            ));
        }
        dto.setSubjectStats(subjectStatDtos);

        // Score / Rating history
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserOrderByCompletedAtAsc(user);
        List<ScoreHistoryDto> historyDtos = new ArrayList<>();
        for (QuizAttempt qa : attempts) {
            historyDtos.add(new ScoreHistoryDto(
                    qa.getId(),
                    qa.getSubject(),
                    qa.getDifficulty(),
                    qa.getScore(),
                    qa.getRatingSnapshot(),
                    qa.getCompletedAt().format(DATE_FORMATTER)
            ));
        }
        dto.setScoreHistory(historyDtos);

        return dto;
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        userRepository.delete(user);
    }
}
