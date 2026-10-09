package com.aiquiz.dto.auth;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Integer rating;
    private Integer totalScore;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, Integer rating, Integer totalScore) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.rating = rating;
        this.totalScore = totalScore;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }
}
