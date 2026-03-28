package com.example.smarttourism.repository;

import com.example.smarttourism.entity.SearchHistory;
import com.example.smarttourism.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    Optional<SearchHistory> findFirstByUserOrderBySearchDateDesc(User user);
}