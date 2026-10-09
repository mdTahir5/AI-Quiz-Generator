package com.aiquiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer correctCount;

    @Column(nullable = false)
    private Integer incorrectCount;

    @Column(nullable = false)
    private Integer unattemptedCount;

    @Column(nullable = false)
    private Integer score; // +4 for correct, -1 for incorrect

    @Column(nullable = false)
    private Integer ratingSnapshot; // user's rating after this attempt

    @Column(nullable = false)
    private LocalDateTime completedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestion> questions = new ArrayList<>();

    public QuizAttempt() {}

    public QuizAttempt(User user, String subject, String difficulty, Integer totalQuestions, 
                       Integer correctCount, Integer incorrectCount, Integer unattemptedCount, 
                       Integer score, Integer ratingSnapshot) {
        this.user = user;
        this.subject = subject;
        this.difficulty = difficulty;
        this.totalQuestions = totalQuestions;
        this.correctCount = correctCount;
        this.incorrectCount = incorrectCount;
        this.unattemptedCount = unattemptedCount;
        this.score = score;
        this.ratingSnapshot = ratingSnapshot;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Integer getRatingSnapshot() { return ratingSnapshot; }
    public void setRatingSnapshot(Integer ratingSnapshot) { this.ratingSnapshot = ratingSnapshot; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public List<QuizQuestion> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestion> questions) { this.questions = questions; }
}
