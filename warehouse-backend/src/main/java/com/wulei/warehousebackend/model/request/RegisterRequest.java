package com.wulei.warehousebackend.model.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String checkPassword;
}
