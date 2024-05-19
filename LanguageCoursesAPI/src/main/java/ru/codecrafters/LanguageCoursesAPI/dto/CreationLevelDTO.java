package ru.codecrafters.LanguageCoursesAPI.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.codecrafters.LanguageCoursesAPI.models.Lesson;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreationLevelDTO {

    @JsonProperty("level_type")
    private Integer levelType;

    private String task;

    @JsonProperty("correct_answer")
    private List<String> answer;

    private Integer points;

    private IdDTO lesson;
}
