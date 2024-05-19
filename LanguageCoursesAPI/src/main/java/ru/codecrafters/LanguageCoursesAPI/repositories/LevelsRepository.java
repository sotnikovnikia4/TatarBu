package ru.codecrafters.LanguageCoursesAPI.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.codecrafters.LanguageCoursesAPI.models.Level;

import java.util.UUID;

@Repository
public interface LevelsRepository extends JpaRepository<Level, UUID> {
}
