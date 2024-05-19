package ru.codecrafters.LanguageCoursesAPI.controllers;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.codecrafters.LanguageCoursesAPI.dto.*;
import ru.codecrafters.LanguageCoursesAPI.models.Course;
import ru.codecrafters.LanguageCoursesAPI.models.Lesson;
import ru.codecrafters.LanguageCoursesAPI.services.CoursesService;
import ru.codecrafters.LanguageCoursesAPI.services.LessonsService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/lessons")
@RequiredArgsConstructor
@ResponseStatus(HttpStatus.OK)
public class LessonsController {
    private final ModelMapper modelMapper;
    private final LessonsService lessonsService;

    @PostMapping("/create")
    public LessonDTO create(@RequestBody CreationLessonDTO creationLessonDTO){
        Lesson lesson = modelMapper.map(creationLessonDTO, Lesson.class);
        lesson.setId(null);

        lesson = lessonsService.create(lesson);

        return getdto(lesson);
    }

    @GetMapping("/course/{courseId}")
    public List<LessonDTO> getLessonByCourse(@PathVariable UUID courseId){
        List<Lesson> lessons = lessonsService.getLessonsByCourseId(courseId);

        return lessons.stream().map(this::getdto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LessonDTO getLessonById(@PathVariable UUID id){
        Lesson lesson = lessonsService.getLessonById(id);

        return getdto(lesson);
    }

    public LessonDTO getdto(Lesson lesson){
        LessonDTO lessonDTO = new LessonDTO();

        lessonDTO.setId(lesson.getId());
        lessonDTO.setCourse(new IdDTO(lesson.getCourse().getId()));
        lessonDTO.setDescription(lesson.getDescription());
        lessonDTO.setLevels(lesson.getLevels().stream().map(c->modelMapper.map(c, LevelDTO.class)).collect(Collectors.toList()));

        return lessonDTO;
    }
}
