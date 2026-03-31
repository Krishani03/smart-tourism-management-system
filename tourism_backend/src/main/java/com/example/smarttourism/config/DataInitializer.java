package com.example.smarttourism.config;

import com.example.smarttourism.entity.*;
import com.example.smarttourism.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (categoryRepository.count() == 0) {
            saveCategory("Adventure & Trekking");
            saveCategory("Coastal & Beach");
            saveCategory("Cultural & Heritage");
            saveCategory("Wildlife Safari");
            System.out.println("✅ Categories Seeded!");
        }

        if (locationRepository.count() == 0) {
            saveLocation("Ella", "Uva");
            saveLocation("Mirissa", "Southern");
            saveLocation("Kandy", "Central");
            saveLocation("Sigiriya", "Central");
            saveLocation("Colombo", "Western");
            System.out.println("✅ Locations Seeded!");
        }

        if (userRepository.count() == 0) {

            User admin = User.builder()
                    .username("admin@tourism.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();


            User guide = User.builder()
                    .username("guide_saman")
                    .password(passwordEncoder.encode("guide123"))
                    .role(Role.GUIDE)
                    .build();

            userRepository.saveAll(List.of(admin, guide));
            System.out.println("✅ Default Users (Admin & Guide) Seeded!");
        }
    }

    private void saveCategory(String name) {
        Category cat = new Category();
        cat.setName(name);
        categoryRepository.save(cat);
    }

    private void saveLocation(String city, String province) {
        Location loc = new Location();
        loc.setCityName(city);
        loc.setProvince(province);
        locationRepository.save(loc);
    }
}