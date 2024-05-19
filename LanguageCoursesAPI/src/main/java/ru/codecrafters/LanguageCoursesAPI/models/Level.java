package ru.codecrafters.LanguageCoursesAPI.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Array;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Level {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "level_type")
    private Integer levelType;

    @Column(name = "task")
    private String task;

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "points")
    private Integer points;

    @ManyToOne
    @JoinColumn(name = "lesson_id", referencedColumnName = "id")
    private Lesson lesson;

    public List<String> getCorrectAnswerAsList(){
        return List.of(correctAnswer.split("\\|"));
    }

    public void setCorrectAnswerAsList(List<String> answer){
        StringBuilder sb = new StringBuilder();
        for(String s : answer){
            sb.append(s);
            sb.append('|');
        }

        if(sb.length() != 0) sb.setLength(sb.length() - 1);

        correctAnswer = sb.toString();
    }
}
