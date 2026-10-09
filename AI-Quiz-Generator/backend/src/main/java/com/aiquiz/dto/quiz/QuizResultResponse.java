package com.aiquiz.dto.quiz;

import java.util.List;

public class QuizResultResponse {
    private Long attemptId;
    private String subject;
    private String difficulty;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer incorrectCount;
    private Integer unattemptedCount;
    private Integer score; // +4 for correct, -1 for incorrect
    private Integer maxPossibleScore;
    private Double accuracyPercentage;
    private Integer previousRating;
    private Integer newRating;
    private Integer ratingDelta;
    private List<QuestionDetail> questionDetails;

    public static class QuestionDetail {
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private String selectedAnswer;
        private Boolean isCorrect;
        private String explanation;
        private Integer scoreDelta; // +4, -1, or 0

        public QuestionDetail() {}

        public QuestionDetail(String questionText, String optionA, String optionB, String optionC, String optionD,
                              String correctAnswer, String selectedAnswer, Boolean isCorrect, String explanation, Integer scoreDelta) {
            this.questionText = questionText;
            this.optionA = optionA;
            this.optionB = optionB;
            this.optionC = optionC;
            this.optionD = optionD;
            this.correctAnswer = correctAnswer;
            this.selectedAnswer = selectedAnswer;
            this.isCorrect = isCorrect;
            this.explanation = explanation;
            this.scoreDelta = scoreDelta;
        }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public String getOptionA() { return optionA; }
        public void setOptionA(String optionA) { this.optionA = optionA; }

        public String getOptionB() { return optionB; }
        public void setOptionB(String optionB) { this.optionB = optionB; }

        public String getOptionC() { return optionC; }
        public void setOptionC(String optionC) { this.optionC = optionC; }

        public String getOptionD() { return optionD; }
        public void setOptionD(String optionD) { this.optionD = optionD; }

        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

        public String getSelectedAnswer() { return selectedAnswer; }
        public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }

        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }

        public Integer getScoreDelta() { return scoreDelta; }
        public void setScoreDelta(Integer scoreDelta) { this.scoreDelta = scoreDelta; }
    }

    public QuizResultResponse() {}

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }

    public Integer getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(Integer incorrectCount) { this.incorrectCount = incorrectCount; }

    public Integer getUnattemptedCount() { return unattemptedCount; }
    public void setUnattemptedCount(Integer unattemptedCount) { this.unattemptedCount = unattemptedCount; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getMaxPossibleScore() { return maxPossibleScore; }
    public void setMaxPossibleScore(Integer maxPossibleScore) { this.maxPossibleScore = maxPossibleScore; }

    public Double getAccuracyPercentage() { return accuracyPercentage; }
    public void setAccuracyPercentage(Double accuracyPercentage) { this.accuracyPercentage = accuracyPercentage; }

    public Integer getPreviousRating() { return previousRating; }
    public void setPreviousRating(Integer previousRating) { this.previousRating = previousRating; }

    public Integer getNewRating() { return newRating; }
    public void setNewRating(Integer newRating) { this.newRating = newRating; }

    public Integer getRatingDelta() { return ratingDelta; }
    public void setRatingDelta(Integer ratingDelta) { this.ratingDelta = ratingDelta; }

    public List<QuestionDetail> getQuestionDetails() { return questionDetails; }
    public void setQuestionDetails(List<QuestionDetail> questionDetails) { this.questionDetails = questionDetails; }
}
