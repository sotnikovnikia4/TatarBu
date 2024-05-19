package ru.codecrafters.LanguageCoursesAPI.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ru.codecrafters.LanguageCoursesAPI.dto.CheckVoiceInputDTO;
import ru.codecrafters.LanguageCoursesAPI.dto.CorrectnessAnswerDTO;
import ru.codecrafters.LanguageCoursesAPI.exceptions.CourseException;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TatarByMLAPI {
    private final RestTemplate restTemplate;
    private final String url = "http://localhost:8086/voice/CheckVoice";

    public CorrectnessAnswerDTO getCorrectnessAnswer(List<String> answer, String task) {
        try{
            CheckVoiceInputDTO checkVoiceInputDTO = new CheckVoiceInputDTO(answer.get(0), task);

            return restTemplate.postForObject(url, checkVoiceInputDTO, CorrectnessAnswerDTO.class);
        }
        catch(RuntimeException e){
            throw new CourseException(e);
        }
    }
}
