package com.aiquiz.repository;

import com.aiquiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Codeforces-style leaderboard: order by rating descending, then totalScore descending
    @Query("SELECT u FROM User u ORDER BY u.rating DESC, u.totalScore DESC")
    List<User> findTopUsers();
}
