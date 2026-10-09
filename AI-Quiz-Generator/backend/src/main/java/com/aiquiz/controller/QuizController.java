package com.aiquiz.controller;

import com.aiquiz.dto.common.ApiResponse;
import com.aiquiz.dto.quiz.QuizGenerateRequest;
import com.aiquiz.dto.quiz.QuizQuestionDto;
import com.aiquiz.dto.quiz.QuizResultResponse;
import com.aiquiz.dto.quiz.QuizSubmissionRequest;
import com.aiquiz.entity.User;
import com.aiquiz.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<QuizQuestionDto>>> generateQuiz(@Valid @RequestBody QuizGenerateRequest request) {
        List<QuizQuestionDto> questions = quizService.generateQuiz(request);
        return ResponseEntity.ok(ApiResponse.ok("Quiz questions generated successfully", questions));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizResultResponse>> submitQuiz(
            Authentication authentication,
            @Valid @RequestBody QuizSubmissionRequest request) {
        User user = (User) authentication.getPrincipal();
        QuizResultResponse result = quizService.submitQuiz(user.getEmail(), request);
        return ResponseEntity.ok(ApiResponse.ok("Quiz submitted and evaluated successfully", result));
    }
}
