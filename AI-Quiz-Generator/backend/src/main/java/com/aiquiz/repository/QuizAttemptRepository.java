package com.aiquiz.repository;

import com.aiquiz.entity.QuizAttempt;
import com.aiquiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByCompletedAtAsc(User user);
    List<QuizAttempt> findByUserOrderByCompletedAtDesc(User user);

    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.user.id = :userId ORDER BY qa.completedAt ASC")
    List<QuizAttempt> findAttemptsForScoreHistory(@Param("userId") Long userId);
}
