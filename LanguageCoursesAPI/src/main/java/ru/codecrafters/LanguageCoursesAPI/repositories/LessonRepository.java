package ru.codecrafters.LanguageCoursesAPI.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.codecrafters.LanguageCoursesAPI.models.Lesson;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findAllByCourseId(UUID courseId);
}
