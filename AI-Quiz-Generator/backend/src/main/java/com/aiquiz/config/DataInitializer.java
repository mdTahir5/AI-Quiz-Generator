package com.aiquiz.config;

import com.aiquiz.entity.QuizAttempt;
import com.aiquiz.entity.SubjectStat;
import com.aiquiz.entity.User;
import com.aiquiz.repository.QuizAttemptRepository;
import com.aiquiz.repository.SubjectStatRepository;
import com.aiquiz.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final SubjectStatRepository subjectStatRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           QuizAttemptRepository quizAttemptRepository,
                           SubjectStatRepository subjectStatRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.subjectStatRepository = subjectStatRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() >= 5) {
            return;
        }

        String defaultPass = passwordEncoder.encode("Password@123");

        // Seed realistic competitive coders
        createCompetitor("Touristic Alpha", "tourist@codeforces.org", "+1-555-0101", 24, "San Francisco, CA", "MIT CSAIL", defaultPass, 2450, 480, 120, 115, 5);
        createCompetitor("Alexei Morozov", "alexei@spbu.ru", "+7-911-0202", 22, "St. Petersburg, Russia", "ITMO University", defaultPass, 2210, 360, 95, 88, 7);
        createCompetitor("Priya Sharma", "priya.s@iitd.ac.in", "+91-9876543210", 21, "New Delhi, India", "IIT Delhi", defaultPass, 1980, 290, 78, 72, 6);
        createCompetitor("Eren Yeager", "eren@surveycorps.io", "+1-555-0199", 20, "Austin, TX", "UT Austin", defaultPass, 1720, 210, 60, 52, 8);
        createCompetitor("Sophia Chen", "sophia.c@stanford.edu", "+1-650-555-0143", 21, "Palo Alto, CA", "Stanford University", defaultPass, 1540, 160, 45, 38, 7);
        createCompetitor("Marcus Vance", "marcus.v@cam.ac.uk", "+44-20-7946-0912", 23, "Cambridge, UK", "University of Cambridge", defaultPass, 1420, 125, 38, 30, 8);
        createCompetitor("Aarav Patel", "aarav@iitb.ac.in", "+91-9822012345", 20, "Mumbai, India", "IIT Bombay", defaultPass, 1310, 95, 30, 24, 6);
        createCompetitor("Kenji Takahashi", "kenji@u-tokyo.ac.jp", "+81-3-555-0188", 22, "Tokyo, Japan", "University of Tokyo", defaultPass, 1230, 70, 22, 17, 5);
    }

    private void createCompetitor(String name, String email, String phone, int age, String address, 
                                  String school, String pass, int rating, int score, int totalQ, int correct, int incorrect) {
        if (userRepository.existsByEmail(email)) return;

        User u = new User(name, email, phone, age, address, school, pass);
        u.setRating(rating);
        u.setTotalScore(score);
        u.setTotalQuestionsSolved(totalQ);
        u.setCorrectAnswers(correct);
        u.setIncorrectAnswers(incorrect);
        u = userRepository.save(u);

        // Add sample subject stats
        SubjectStat dsaStat = new SubjectStat(u, "DSA");
        dsaStat.setTotalAttempted(totalQ / 2);
        dsaStat.setCorrectCount(correct / 2);
        dsaStat.setIncorrectCount(incorrect / 2);
        dsaStat.setTotalScore(score / 2);
        subjectStatRepository.save(dsaStat);

        SubjectStat osStat = new SubjectStat(u, "OS");
        osStat.setTotalAttempted(totalQ - totalQ / 2);
        osStat.setCorrectCount(correct - correct / 2);
        osStat.setIncorrectCount(incorrect - incorrect / 2);
        osStat.setTotalScore(score - score / 2);
        subjectStatRepository.save(osStat);

        // Add 2 initial attempts for chart history
        QuizAttempt qa1 = new QuizAttempt(u, "DSA", "Medium", 10, correct / 2, incorrect / 2, 0, score / 2, rating - 40);
        qa1.setCompletedAt(LocalDateTime.now().minusDays(3));
        quizAttemptRepository.save(qa1);

        QuizAttempt qa2 = new QuizAttempt(u, "OS", "Hard", 10, correct - correct / 2, incorrect - incorrect / 2, 0, score - score / 2, rating);
        qa2.setCompletedAt(LocalDateTime.now().minusDays(1));
        quizAttemptRepository.save(qa2);
    }
}
