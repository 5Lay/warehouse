package com.wulei.warehousebackend.controller;

import cn.hutool.core.date.DateTime;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.model.entity.Agv;
import com.wulei.warehousebackend.model.entity.User;
import com.wulei.warehousebackend.model.request.AddAgvRequest;
import com.wulei.warehousebackend.model.request.PathRequest;
import com.wulei.warehousebackend.model.response.PathResponse;
import com.wulei.warehousebackend.service.AgvService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static com.wulei.warehousebackend.constant.UserConstant.ADMIN_ROLE;
import static com.wulei.warehousebackend.constant.UserConstant.USER_LOGIN_STATUS;

@Slf4j
@RestController
@RequestMapping("/agv")
public class AGVController {

    @Resource
    AgvService agvService;

    @PostMapping()
    public BaseResponse<Boolean> addAgv(@RequestBody AddAgvRequest agvRequest, HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        if (agvRequest == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        Agv agv = new Agv();
        agv.setStartX(agvRequest.getStartX());
        agv.setStartY(agvRequest.getStartY());
        boolean result = agvService.save(agv);
        return ResultUtils.success(result);
    }

    @GetMapping()
    public BaseResponse<List<Agv>> getAgvList(HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        List<Agv> agvList = agvService.list();
        return ResultUtils.success(agvList);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Boolean> deleteAgv(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        if (id == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        boolean result = agvService.removeById(id);
        return ResultUtils.success(result);
    }

    @PutMapping()
    public BaseResponse<Boolean> updateAgv(@RequestBody Agv agv, HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        if (agv == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        agv.setUpdateTime(DateTime.now());
        boolean result = agvService.updateById(agv);
        return ResultUtils.success(result);
    }

    private boolean isAdmin(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        return user != null && user.getUserRole() == ADMIN_ROLE;
    }

    @PostMapping("/paths")
    public BaseResponse planPaths(@Valid @RequestBody PathRequest request) {
        System.out.println("PathRequest:"  + request);
        String response = agvService.getPaths(request);
        return ResultUtils.success(response);
    }

    @PostMapping("/task-callback")
    public BaseResponse handlePythonCallback(
            @RequestBody Map<String, Object> payload
    ) {
        String taskId = (String) payload.get("taskId");
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        PathResponse response = objectMapper.convertValue(payload.get("result"), PathResponse.class);
        System.out.println("pathResponse:" + response);
        agvService.processPythonCallback(taskId, response);
        Object result = payload.get("result");
//        System.out.println(taskId + result);
        return ResultUtils.success(result);
    }
}

