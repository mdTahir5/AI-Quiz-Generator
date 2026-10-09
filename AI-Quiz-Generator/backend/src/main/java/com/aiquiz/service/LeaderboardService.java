package com.aiquiz.service;

import com.aiquiz.dto.leaderboard.LeaderboardUserDto;
import com.aiquiz.entity.User;
import com.aiquiz.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<LeaderboardUserDto> getTopUsers() {
        List<User> topUsers = userRepository.findTopUsers();
        List<LeaderboardUserDto> dtos = new ArrayList<>();

        int limit = Math.min(10, topUsers.size());
        for (int i = 0; i < limit; i++) {
            User u = topUsers.get(i);
            LeaderboardUserDto dto = new LeaderboardUserDto(
                    i + 1,
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getSchoolOrInstitute(),
                    u.getRating(),
                    u.getTotalScore(),
                    u.getTotalQuestionsSolved(),
                    u.getCorrectAnswers(),
                    u.getIncorrectAnswers()
            );
            dtos.add(dto);
        }

        return dtos;
    }
}
