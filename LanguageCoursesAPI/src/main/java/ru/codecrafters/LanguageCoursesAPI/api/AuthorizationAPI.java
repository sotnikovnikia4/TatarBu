package ru.codecrafters.LanguageCoursesAPI.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.util.Json;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ru.codecrafters.LanguageCoursesAPI.exceptions.APIException;

import java.util.*;

@Component
@RequiredArgsConstructor
public class AuthorizationAPI {
    private final RestTemplate restTemplate;
    private final String url = "http://localhost:8081/classrooms/student/{studentId}/get-classrooms";
    private final ObjectMapper objectMapper;

    public List<UUID> getClassroomIdsByStudentId(UUID studentId, String token) {
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, requestEntity, String.class, Map.of("studentId", studentId.toString()));

            JsonNode tree = objectMapper.readTree(response.getBody());

            List<UUID> result = new ArrayList<>();

            for(int i = 0; i < tree.size(); i++){
                JsonNode node = tree.get(i);
                result.add(UUID.fromString(node.get("id").toString()));
            }

            return result;
        } catch (JsonProcessingException e) {
            throw new APIException("Произошла ошибка обработки ответа от " + url);
        }

    }
}
