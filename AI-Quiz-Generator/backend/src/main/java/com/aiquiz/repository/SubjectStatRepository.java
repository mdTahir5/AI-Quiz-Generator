package com.aiquiz.repository;

import com.aiquiz.entity.SubjectStat;
import com.aiquiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectStatRepository extends JpaRepository<SubjectStat, Long> {
    List<SubjectStat> findByUser(User user);
    Optional<SubjectStat> findByUserAndSubject(User user, String subject);
}
