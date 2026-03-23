package com.example.smarttourism.service;

import com.example.smarttourism.dto.AuthDTO;
import com.example.smarttourism.dto.AuthResponseDTO;
import com.example.smarttourism.dto.RegisterDTO;

public interface AuthService {
    AuthResponseDTO authenticate(AuthDTO authDTO);
    String register(RegisterDTO registerDTO);
}