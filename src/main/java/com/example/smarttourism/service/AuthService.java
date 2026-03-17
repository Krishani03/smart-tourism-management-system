package com.example.smarttourism.service;

import com.example.smarttourism.dto.AuthDTO;
import com.example.smarttourism.dto.AuthResponseDTO;
import com.example.smarttourism.dto.RegisterDTO;
import com.example.smarttourism.entity.Role;
import com.example.smarttourism.entity.User;
import com.example.smarttourism.repository.UserRepository;
import com.example.smarttourism.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authDTO.getUsername(), authDTO.getPassword())
        );

        var user = userRepository.findByUsername(authDTO.getUsername()).orElseThrow();
        var token = jwtUtil.generateToken(user.getUsername());
        return AuthResponseDTO.builder().token(token).build();
    }

    public String register(RegisterDTO registerDTO) {
        var user = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole().toUpperCase()))
                .build();
        userRepository.save(user);
        return "User Registered Successfully";
    }
}