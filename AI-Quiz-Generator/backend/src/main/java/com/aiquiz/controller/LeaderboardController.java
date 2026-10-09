package com.aiquiz.controller;

import com.aiquiz.dto.common.ApiResponse;
import com.aiquiz.dto.leaderboard.LeaderboardUserDto;
import com.aiquiz.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<LeaderboardUserDto>>> getTopUsers() {
        List<LeaderboardUserDto> topUsers = leaderboardService.getTopUsers();
        return ResponseEntity.ok(ApiResponse.ok("Top leaderboard users retrieved", topUsers));
    }
}
