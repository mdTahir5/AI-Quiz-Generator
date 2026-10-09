package com.aiquiz.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false)
    private String schoolOrInstitute;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Integer totalQuestionsSolved = 0;

    @Column(nullable = false)
    private Integer correctAnswers = 0;

    @Column(nullable = false)
    private Integer incorrectAnswers = 0;

    @Column(nullable = false)
    private Integer totalScore = 0;

    @Column(nullable = false)
    private Integer rating = 1200; // Codeforces-style starting rating (Pupil/Newbie)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<QuizAttempt> quizAttempts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SubjectStat> subjectStats = new ArrayList<>();

    public User() {}

    public User(String name, String email, String phoneNumber, Integer age, String address, String schoolOrInstitute, String password) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.address = address;
        this.schoolOrInstitute = schoolOrInstitute;
        this.password = password;
        this.totalQuestionsSolved = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.totalScore = 0;
        this.rating = 1200;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<QuizAttempt> getQuizAttempts() { return quizAttempts; }
    public void setQuizAttempts(List<QuizAttempt> quizAttempts) { this.quizAttempts = quizAttempts; }

    public List<SubjectStat> getSubjectStats() { return subjectStats; }
    public void setSubjectStats(List<SubjectStat> subjectStats) { this.subjectStats = subjectStats; }
}
