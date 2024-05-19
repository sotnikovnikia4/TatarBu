package ru.codecrafters.LanguageCoursesAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private UUID id;

    private IdDTO course;

    private String description;

    private List<LevelDTO> levels;
}
