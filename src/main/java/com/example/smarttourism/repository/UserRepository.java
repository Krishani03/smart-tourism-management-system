package com.example.smarttourism.repository;



import com.example.smarttourism.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Spring will automatically generate: SELECT * FROM user WHERE username = ?
    Optional<User> findByUsername(String username);
}
