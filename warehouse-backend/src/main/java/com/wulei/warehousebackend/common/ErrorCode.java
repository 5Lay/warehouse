package com.wulei.warehousebackend.common;

/**
 * 错误码
 */
public enum ErrorCode {
    SUCCESS(200, "success", ""),
    FAIL(500, "fail", ""),
    PARAM_ERROR(40001, "param error", ""),
    USER_NOT_EXIST(40002, "user not exist", ""),
    USER_NOT_LOGIN(40003, "user not login", ""),
    USER_ACCOUNT_ERROR(40004, "user account error", ""),
    USER_ACCOUNT_FORBIDDEN(40005, "user account forbidden", ""),
    USER_WITHOUT_PERMISSION(40006, "user without permission", ""),
    USER_HAS_EXISTED(40007, "user has existed", ""),
    TOKEN_ERROR(40008, "token error", ""),
    TOKEN_EXPIRE(40009, "token expire", ""),
    SYSTEM_ERROR(50000, "system error", "");

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
    private final String description;

    ErrorCode(Integer code, String message, String description) {
        this.code = code;
        this.message = message;
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
