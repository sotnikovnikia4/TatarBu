package ru.codecrafters.LanguageCoursesAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreationLessonDTO {
    private IdDTO course;
    private String description;
}
