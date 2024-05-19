package ru.codecrafters.LanguageCoursesAPI.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.codecrafters.LanguageCoursesAPI.api.AuthorizationAPI;
import ru.codecrafters.LanguageCoursesAPI.dto.IdDTO;
import ru.codecrafters.LanguageCoursesAPI.exceptions.CourseException;
import ru.codecrafters.LanguageCoursesAPI.models.Course;
import ru.codecrafters.LanguageCoursesAPI.repositories.CoursesRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CoursesService {
    private final CoursesRepository coursesRepository;
    private final AuthorizationAPI api;

    public Course create(Course courseToCreate) {
        coursesRepository.save(courseToCreate);

        return courseToCreate;
    }

    @Transactional
    public void setTeacher(Course course, UUID teacherId){
        course.setTeacherId(teacherId);
    }

    public List<Course> getCoursesByTeacher(UUID teacherId) {
        return coursesRepository.findAllByTeacherId(teacherId);
    }

    public void update(Course updatedCourse) {
        Optional<Course> courseToBeUpdated = coursesRepository.findById(updatedCourse.getId());
        if(courseToBeUpdated.isEmpty()){
            throw new CourseException("Такого курса не существует");
        }

        courseToBeUpdated.get().setTitle(updatedCourse.getTitle());
        courseToBeUpdated.get().setMinAge(updatedCourse.getMinAge());
        courseToBeUpdated.get().setMaxAge(updatedCourse.getMaxAge());
    }

    public void delete(UUID courseId) {
        coursesRepository.deleteById(courseId);
    }

    public List<Course> getCoursesByStudentId(UUID studentId, String token) {

        List<Course> result = new ArrayList<>(coursesRepository.findAllByTeacherId(null));

        List<UUID> classroomIds = api.getClassroomIdsByStudentId(studentId, token);

        result.addAll(coursesRepository.findAllByClassroomIds(classroomIds));

        return result;
    }

    public Course getCourseById(UUID id) {
        return coursesRepository.findById(id).orElseThrow(() -> new CourseException("Такого курса нет"));
    }

    public void attachCourseToClassroom(UUID courseId, UUID classroomId) {
        Optional<Course> course = coursesRepository.findById(courseId);

        if(course.isEmpty()){
            throw new CourseException("Такого курса не существует");
        }
    }
}
