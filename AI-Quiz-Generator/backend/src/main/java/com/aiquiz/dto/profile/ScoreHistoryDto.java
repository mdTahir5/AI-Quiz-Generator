package com.aiquiz.dto.profile;

public class ScoreHistoryDto {
    private Long attemptId;
    private String subject;
    private String difficulty;
    private Integer score;
    private Integer ratingSnapshot;
    private String formattedDate;

    public ScoreHistoryDto() {}

    public ScoreHistoryDto(Long attemptId, String subject, String difficulty, Integer score, Integer ratingSnapshot, String formattedDate) {
        this.attemptId = attemptId;
        this.subject = subject;
        this.difficulty = difficulty;
        this.score = score;
        this.ratingSnapshot = ratingSnapshot;
        this.formattedDate = formattedDate;
    }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getRatingSnapshot() { return ratingSnapshot; }
    public void setRatingSnapshot(Integer ratingSnapshot) { this.ratingSnapshot = ratingSnapshot; }

    public String getFormattedDate() { return formattedDate; }
    public void setFormattedDate(String formattedDate) { this.formattedDate = formattedDate; }
}
