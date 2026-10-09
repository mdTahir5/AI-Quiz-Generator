package com.aiquiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_subject_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "subject"})
})
public class SubjectStat {

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
    private Integer totalAttempted = 0;

    @Column(nullable = false)
    private Integer correctCount = 0;

    @Column(nullable = false)
    private Integer incorrectCount = 0;

    @Column(nullable = false)
    private Integer totalScore = 0;

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public SubjectStat() {}

    public SubjectStat(User user, String subject) {
        this.user = user;
        this.subject = subject;
        this.totalAttempted = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalScore = 0;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
