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

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    @JsonProperty("id")
    private UUID id;

    private String title;

    @JsonProperty("min_age")
    private Integer minAge;

    @JsonProperty("max_age")
    private Integer maxAge;

    @JsonProperty("teacher_id")
    private UUID teacherId;
}
