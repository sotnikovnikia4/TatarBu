package ru.codecrafters.LanguageCoursesAPI.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.codecrafters.LanguageCoursesAPI.exceptions.APIException;
import ru.codecrafters.LanguageCoursesAPI.exceptions.CourseException;
import ru.codecrafters.LanguageCoursesAPI.util.ExceptionMessage;

import java.util.Date;

@RestControllerAdvice
public class ExceptionController {
    @ExceptionHandler(CourseException.class)
    public ResponseEntity<ExceptionMessage> handleException(CourseException e){
        ExceptionMessage message = new ExceptionMessage(e.getMessage(), new Date());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ExceptionMessage> handleException(APIException e){
        ExceptionMessage message = new ExceptionMessage(e.getMessage(), new Date());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }
}
