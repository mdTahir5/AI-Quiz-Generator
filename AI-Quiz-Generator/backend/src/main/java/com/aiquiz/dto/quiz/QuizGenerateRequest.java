package com.aiquiz.dto.quiz;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuizGenerateRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Number of questions is required")
    @Min(value = 5, message = "Minimum 5 questions")
    @Max(value = 25, message = "Maximum 25 questions")
    private Integer numberOfQuestions;

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // Easy, Medium, Hard

    public QuizGenerateRequest() {}

    public QuizGenerateRequest(String subject, Integer numberOfQuestions, String difficulty) {
        this.subject = subject;
        this.numberOfQuestions = numberOfQuestions;
        this.difficulty = difficulty;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
