package com.aiquiz.dto.profile;

public class SubjectStatDto {
    private String subject;
    private Integer totalAttempted;
    private Integer correctCount;
    private Integer incorrectCount;
    private Integer totalScore;
    private Double accuracy;

    public SubjectStatDto() {}

    public SubjectStatDto(String subject, Integer totalAttempted, Integer correctCount, Integer incorrectCount, Integer totalScore) {
        this.subject = subject;
        this.totalAttempted = totalAttempted;
        this.correctCount = correctCount;
        this.incorrectCount = incorrectCount;
        this.totalScore = totalScore;
        this.accuracy = totalAttempted > 0 ? Math.round(((double) correctCount / totalAttempted * 100.0) * 10.0) / 10.0 : 0.0;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getTotalAttempted() { return totalAttempted; }
    public void setTotalAttempted(Integer totalAttempted) { this.totalAttempted = totalAttempted; }

    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }

    public Integer getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(Integer incorrectCount) { this.incorrectCount = incorrectCount; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
}
