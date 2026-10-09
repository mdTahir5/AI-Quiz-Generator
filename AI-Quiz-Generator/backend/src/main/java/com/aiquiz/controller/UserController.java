package com.aiquiz.controller;

import com.aiquiz.dto.common.ApiResponse;
import com.aiquiz.dto.profile.UserProfileDto;
import com.aiquiz.entity.User;
import com.aiquiz.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserProfileDto profile = userService.getUserProfile(user.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved successfully", profile));
    }

    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.deleteAccount(user.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("Account deleted successfully", null));
    }
}
