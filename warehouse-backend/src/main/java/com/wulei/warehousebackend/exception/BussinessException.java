package com.wulei.warehousebackend.exception;

import com.wulei.warehousebackend.common.ErrorCode;

/**
 * 自定义业务异常
 */
public class BussinessException extends RuntimeException {

    /**
     * 错误码
     */
    private Integer code;

    /**
     * 错误信息
     */
    private String message;

    /**
     * 错误描述
     */
    private String description;

    public BussinessException(Integer code, String message, String description) {
        super(message);
        this.code = code;
        this.description = description;
    }

    public BussinessException(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.description = errorCode.getDescription();
    }

    public BussinessException(ErrorCode errorCode, String description) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }
}
