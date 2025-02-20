package com.wulei.warehousebackend.common;

public class ResultUtils {

    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse(200, "success", data);
    }

    public static  BaseResponse fail(ErrorCode errorCode) {
        return new BaseResponse(errorCode);
    }

    public static  BaseResponse fail(int code, String message, String description) {
        return new BaseResponse(code, message, description);
    }

    public static  BaseResponse fail(ErrorCode errorCode, String message, String description) {
        return new BaseResponse(errorCode.getCode(), message, description);
    }
}
