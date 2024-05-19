package ru.codecrafters.LanguageCoursesAPI.dto;

import com.fasterxml.jackson.annotation.JacksonInject;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddCourseToClassroomDTO {
    @JsonProperty("course_id")
    private UUID courseId;

    @JsonProperty("classroom_id")
    private UUID classroomId;
}
