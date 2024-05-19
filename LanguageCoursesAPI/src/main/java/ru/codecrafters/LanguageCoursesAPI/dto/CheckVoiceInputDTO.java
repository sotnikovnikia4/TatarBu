package ru.codecrafters.LanguageCoursesAPI.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckVoiceInputDTO {

    private String voice;
    @JsonProperty("input_text")
    private String inputText;
}
