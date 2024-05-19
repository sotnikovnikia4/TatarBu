package ru.codecrafters.LanguageCoursesAPI.controllers;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.datasource.lookup.IsolationLevelDataSourceRouter;
import org.springframework.web.bind.annotation.*;
import ru.codecrafters.LanguageCoursesAPI.dto.*;
import ru.codecrafters.LanguageCoursesAPI.models.Lesson;
import ru.codecrafters.LanguageCoursesAPI.models.Level;
import ru.codecrafters.LanguageCoursesAPI.services.LessonsService;
import ru.codecrafters.LanguageCoursesAPI.services.LevelsService;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/levels")
@RequiredArgsConstructor
@ResponseStatus(HttpStatus.OK)
public class LevelsController {
    private final LessonsService lessonsService;
    private final LevelsService levelsService;
    private final ModelMapper modelMapper;

    @GetMapping
    public List<LevelDTO> getLevelByLessonId(@RequestParam(name = "lesson_id") UUID lessonId){
        List<Level> levels = lessonsService.getLevelsByLessonId(lessonId);
        List<LevelDTO> levels1 = levels.stream().map(c -> modelMapper.map(c, LevelDTO.class)).toList();

        for(int i = 0; i < levels.size(); i++){
            levels1.get(i).setAnswer(levels.get(i).getCorrectAnswerAsList());
        }

        return levels1;
    }

    @GetMapping("/{id}")
    public LevelDTO getLevel(@PathVariable UUID id){
        return modelMapper.map(levelsService.getById(id) ,LevelDTO.class);
    }

    @PostMapping("/create")
    public LevelDTO create(@RequestBody CreationLevelDTO creationLevelDTO){
        Level level = modelMapper.map(creationLevelDTO, Level.class);
        level.setCorrectAnswerAsList(creationLevelDTO.getAnswer());
        level.setId(null);
        level.setLevelType(level.getLevelType()+1);

        levelsService.save(level);

        return modelMapper.map(level, LevelDTO.class);
    }

    @PostMapping("/check-answer")
    public CorrectnessAnswerDTO check(@RequestBody CheckAnswerDTO checkAnswerDTO){
        //Level level = levelsService.getById(checkAnswerDTO.getLevel().getId());

        levelsService.checkAnswer(checkAnswerDTO);

        return levelsService.checkAnswer(checkAnswerDTO);
    }

}
