package com.wulei.warehousebackend.exception;

import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.common.ResultUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 业务异常处理
     * @param e
     * @return
     */
    @ExceptionHandler(BussinessException.class)
    public BaseResponse bussinessExceptionHandler(BussinessException e) {
        log.error("bussinessException：{}" , e.getMessage(), e);
        return ResultUtils.fail(e.getCode(), e.getMessage(), e.getDescription());
    }

    /**
     * 运行时异常处理
     * @param e
     * @return
     */
    @ExceptionHandler(RuntimeException.class)
    public BaseResponse runtimeExceptionHandler(RuntimeException e) {
        log.error("runtimeException：{}" , e.getMessage(), e);
        return ResultUtils.fail(ErrorCode.SYSTEM_ERROR, e.getMessage(), "");
    }
}
