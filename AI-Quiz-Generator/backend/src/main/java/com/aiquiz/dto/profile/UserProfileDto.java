package com.aiquiz.dto.profile;

import java.util.List;

public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Integer age;
    private String address;
    private String schoolOrInstitute;
    private Integer totalQuestionsSolved;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer totalScore;
    private Integer rating;
    private String rankTier; // Grandmaster, Master, Expert, Specialist, Pupil, Newbie
    private Double overallAccuracy;
    private String joinedDate;
    private List<SubjectStatDto> subjectStats;
    private List<ScoreHistoryDto> scoreHistory;

    public UserProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getSchoolOrInstitute() { return schoolOrInstitute; }
    public void setSchoolOrInstitute(String schoolOrInstitute) { this.schoolOrInstitute = schoolOrInstitute; }

    public Integer getTotalQuestionsSolved() { return totalQuestionsSolved; }
    public void setTotalQuestionsSolved(Integer totalQuestionsSolved) { this.totalQuestionsSolved = totalQuestionsSolved; }

    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }

    public Integer getIncorrectAnswers() { return incorrectAnswers; }
    public void setIncorrectAnswers(Integer incorrectAnswers) { this.incorrectAnswers = incorrectAnswers; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getRankTier() { return rankTier; }
    public void setRankTier(String rankTier) { this.rankTier = rankTier; }

    public Double getOverallAccuracy() { return overallAccuracy; }
    public void setOverallAccuracy(Double overallAccuracy) { this.overallAccuracy = overallAccuracy; }

    public String getJoinedDate() { return joinedDate; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }

    public List<SubjectStatDto> getSubjectStats() { return subjectStats; }
    public void setSubjectStats(List<SubjectStatDto> subjectStats) { this.subjectStats = subjectStats; }

    public List<ScoreHistoryDto> getScoreHistory() { return scoreHistory; }
    public void setScoreHistory(List<ScoreHistoryDto> scoreHistory) { this.scoreHistory = scoreHistory; }
}
