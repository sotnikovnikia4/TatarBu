package ru.codecrafters.LanguageCoursesAPI.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class LevelDTO {
    private UUID id;

    @JsonProperty("level_type")
    private Integer levelType;

    private String task;

    @JsonProperty("correct_answer")
    private List<String> answer;

    private Integer points;

    private IdDTO lesson;
}
