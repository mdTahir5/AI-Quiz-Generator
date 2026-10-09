package com.aiquiz.dto.leaderboard;

public class LeaderboardUserDto {
    private Integer rank;
    private Long id;
    private String name;
    private String email;
    private String schoolOrInstitute;
    private Integer rating;
    private Integer totalScore;
    private Integer totalQuestionsSolved;
    private Double accuracy;
    private String rankTier; // Grandmaster (>=2400), Master (>=2100), Candidate Master (>=1900), Expert (>=1600), Specialist (>=1400), Pupil (>=1200), Newbie (<1200)

    public LeaderboardUserDto() {}

    public LeaderboardUserDto(Integer rank, Long id, String name, String email, String schoolOrInstitute,
                              Integer rating, Integer totalScore, Integer totalQuestionsSolved, 
                              Integer correctAnswers, Integer incorrectAnswers) {
        this.rank = rank;
        this.id = id;
        this.name = name;
        this.email = email;
        this.schoolOrInstitute = schoolOrInstitute;
        this.rating = rating;
        this.totalScore = totalScore;
        this.totalQuestionsSolved = totalQuestionsSolved;
        int total = correctAnswers + incorrectAnswers;
        this.accuracy = total > 0 ? Math.round(((double) correctAnswers / total * 100.0) * 10.0) / 10.0 : 0.0;
        this.rankTier = determineTier(rating);
    }

    public static String determineTier(int rating) {
        if (rating >= 2400) return "Grandmaster";
        if (rating >= 2100) return "Master";
        if (rating >= 1900) return "Candidate Master";
        if (rating >= 1600) return "Expert";
        if (rating >= 1400) return "Specialist";
        if (rating >= 1200) return "Pupil";
        return "Newbie";
    }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSchoolOrInstitute() { return schoolOrInstitute; }
    public void setSchoolOrInstitute(String schoolOrInstitute) { this.schoolOrInstitute = schoolOrInstitute; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public Integer getTotalQuestionsSolved() { return totalQuestionsSolved; }
    public void setTotalQuestionsSolved(Integer totalQuestionsSolved) { this.totalQuestionsSolved = totalQuestionsSolved; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public String getRankTier() { return rankTier; }
    public void setRankTier(String rankTier) { this.rankTier = rankTier; }
}
