package com.wulei.warehousebackend.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Aspect
@Component
@Slf4j
public class RequestLogAspect {

    // 定义一个切点，拦截所有Controller层的方法
    @Pointcut("execution(* com.wulei.warehousebackend.controller.*.*(..))")
    public void controllerLayer() {}

    // 在方法执行前记录请求信息
    @Before("controllerLayer()")
    public void doBefore() {
        // 获取请求对象
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        // 记录请求信息
        log.info("Request URL: {}", request.getRequestURI());
        log.info("Request Method: {}", request.getMethod());
        log.info("Request Params: {}", request.getParameterMap());
    }

    // 在方法执行后记录响应信息
    @AfterReturning(returning = "result", pointcut = "controllerLayer()")
    public void doAfterReturning(Object result) {
        // 记录响应结果
        log.info("Response Result: {}", result);
    }
}
