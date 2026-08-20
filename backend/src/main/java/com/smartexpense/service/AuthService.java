package com.smartexpense.service;

import com.smartexpense.dto.auth.AuthResponse;
import com.smartexpense.dto.auth.LoginRequest;
import com.smartexpense.dto.auth.RegisterRequest;
import com.smartexpense.dto.auth.UserDto;
import com.smartexpense.entity.User;
import com.smartexpense.exception.DuplicateResourceException;
import com.smartexpense.repository.UserRepository;
import com.smartexpense.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("User with email '" + normalizedEmail + "' already exists");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(normalizedEmail);
        String jwtToken = jwtService.generateToken(userDetails);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .user(userDto)
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new DuplicateResourceException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(normalizedEmail);
        String jwtToken = jwtService.generateToken(userDetails);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .user(userDto)
                .message("User logged in successfully")
                .build();
    }
}
