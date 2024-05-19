package ru.codecrafters.LanguageCoursesAPI.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.codecrafters.LanguageCoursesAPI.models.Course;

import java.util.List;
import java.util.UUID;

@Repository
public interface CoursesRepository extends JpaRepository<Course, UUID> {
    List<Course> findAllByTeacherId(UUID teacherId);

    @Query(nativeQuery = true, value = "select * from courses as c inner join course_classrooms as cc on uuid_eq(cc.id, c.id) where cc.classroom_id in ?1")
    List<Course> findAllByClassroomIds(List<UUID> list);

}
