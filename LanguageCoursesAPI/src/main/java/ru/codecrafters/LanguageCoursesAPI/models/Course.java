package ru.codecrafters.LanguageCoursesAPI.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "courses")
@SecondaryTable(name = "course_classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title")
    private String title;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "teacher_id")
    private UUID teacherId;

    @Column(table = "course_classrooms", name = "classroom_id")
    private UUID classroomId;

    @OneToMany(mappedBy = "course")
    private List<Lesson> lessons;

}
