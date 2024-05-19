package ru.codecrafters.LanguageCoursesAPI.exceptions;

public class APIException extends RuntimeException{
    public APIException(String message){
        super(message);
    }
}
