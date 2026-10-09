package com.aiquiz.service;

import com.aiquiz.config.JwtUtils;
import com.aiquiz.dto.auth.AuthResponse;
import com.aiquiz.dto.auth.LoginRequest;
import com.aiquiz.dto.auth.RegisterRequest;
import com.aiquiz.entity.User;
import com.aiquiz.exception.BadRequestException;
import com.aiquiz.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName().trim(),
                email,
                request.getPhoneNumber().trim(),
                request.getAge(),
                request.getAddress().trim(),
                request.getSchoolOrInstitute().trim(),
                encodedPassword
        );

        user = userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRating(), user.getTotalScore());
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRating(), user.getTotalScore());
    }
}
