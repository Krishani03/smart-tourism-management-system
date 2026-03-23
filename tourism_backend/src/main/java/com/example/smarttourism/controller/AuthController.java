package com.example.smarttourism.controller;

import com.example.smarttourism.dto.AuthDTO;
import com.example.smarttourism.dto.AuthResponseDTO;
import com.example.smarttourism.dto.RegisterDTO;
import com.example.smarttourism.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(authService.register(registerDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticate(@RequestBody AuthDTO authDTO) {

        return ResponseEntity.ok(authService.authenticate(authDTO));
    }
}
