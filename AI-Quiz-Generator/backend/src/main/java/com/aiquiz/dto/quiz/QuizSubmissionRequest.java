package com.aiquiz.dto.quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class QuizSubmissionRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotEmpty(message = "Answers list cannot be empty")
    private List<QuestionAnswerSubmission> answers;

    private Integer timeSpentSeconds;

    public QuizSubmissionRequest() {}

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public List<QuestionAnswerSubmission> getAnswers() { return answers; }
    public void setAnswers(List<QuestionAnswerSubmission> answers) { this.answers = answers; }

    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
