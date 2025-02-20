package com.wulei.warehousebackend.common;

import lombok.Data;

/**
 * 通用返回类
 * @param <T>
 */
@Data
public class BaseResponse<T> {
    private Integer code;
    private String message;
    private T data;
    private String description;

    public BaseResponse() {
    }

    public BaseResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public BaseResponse(Integer code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

    public BaseResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public BaseResponse(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.description = errorCode.getDescription();
    }
}
