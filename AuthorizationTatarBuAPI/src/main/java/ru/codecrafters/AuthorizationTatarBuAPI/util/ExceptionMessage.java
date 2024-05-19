package ru.codecrafters.AuthorizationTatarBuAPI.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExceptionMessage {
    private String message;
    private Date timestamp;
}
