package ru.codecrafters.LanguageCoursesAPI.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.codecrafters.LanguageCoursesAPI.api.TatarByMLAPI;
import ru.codecrafters.LanguageCoursesAPI.dto.CheckAnswerDTO;
import ru.codecrafters.LanguageCoursesAPI.dto.CorrectnessAnswerDTO;
import ru.codecrafters.LanguageCoursesAPI.exceptions.CourseException;
import ru.codecrafters.LanguageCoursesAPI.models.Level;
import ru.codecrafters.LanguageCoursesAPI.repositories.LevelsRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class LevelsService {
    private final LevelsRepository levelsRepository;
    private final TatarByMLAPI api;

    public Level getById(UUID id) {
        Optional<Level> level = levelsRepository.findById(id);

        if(level.isEmpty()){
            throw new CourseException("Нет такого уровня");
        }

        return level.get();
    }

    public void save(Level level) {
        levelsRepository.save(level);
    }

    public CorrectnessAnswerDTO checkAnswer(CheckAnswerDTO checkAnswerDTO) {
        Level level = getById(checkAnswerDTO.getLevel().getId());
        CorrectnessAnswerDTO correctnessAnswerDTO = new CorrectnessAnswerDTO();
        correctnessAnswerDTO.setErrors(new ArrayList<>());

        if(level.getLevelType() <= 2){
            List<String> correctAnswer = level.getCorrectAnswerAsList();
            if(correctAnswer.size() != checkAnswerDTO.getAnswer().size()){
                correctnessAnswerDTO.setAnswerCorrectness(0);
            }
            else{
                for(int i = 0; i < correctAnswer.size(); i++){
                    if(!Objects.equals(correctAnswer.get(i), checkAnswerDTO.getAnswer().get(i))){
                        correctnessAnswerDTO.getErrors().add(correctAnswer.get(i));
                    }
                }
                correctnessAnswerDTO.setAnswerCorrectness(100 - (double) correctnessAnswerDTO.getErrors().size() / correctAnswer.size() * 100);
            }
        }
        else if(level.getLevelType() == 3){
            return api.getCorrectnessAnswer(checkAnswerDTO.getAnswer(), level.getTask());
        }


        return correctnessAnswerDTO;
    }
}
