package com.wulei.warehousebackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.config.utils.TaskWebSocketHandler;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.model.dto.Coordinate;
import com.wulei.warehousebackend.model.entity.Agv;
import com.wulei.warehousebackend.model.request.PathRequest;
import com.wulei.warehousebackend.model.response.PathResponse;
import com.wulei.warehousebackend.service.AgvService;
import com.wulei.warehousebackend.mapper.AgvMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
* @author Administrator
* @description 针对表【agv(自动引导车)】的数据库操作Service实现
* @createDate 2025-03-05 22:30:39
*/
@Service
public class AgvServiceImpl extends ServiceImpl<AgvMapper, Agv>
    implements AgvService{

    private static final String PYTHON_API_URL = "http://localhost:5000/plan";

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private TaskWebSocketHandler wsHandler;

    public void processPythonCallback(String taskId, PathResponse response) {
        // 当收到Python服务回调时触发推送
        wsHandler.sendTaskResult(taskId, response);
    }

    public PathResponse getPaths(PathRequest request) {
        // 1. 请求体校验
        validateRequest(request);

        // 2. 调用Python服务
        HttpEntity<PathRequest> entity = new HttpEntity<>(request);
        ResponseEntity<PathResponse> response;

        try {
            response = restTemplate.postForEntity(
                    PYTHON_API_URL,
                    entity,
                    PathResponse.class
            );
        } catch (RestClientException e) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "路径规划服务调用失败: " + e.getMessage());
        }
        System.out.println(response.getStatusCode()+ "\n" + response.getBody() + "\n" + HttpStatus.OK);
        // 3. 处理响应
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "服务返回错误: " + response.getBody());
        }
        return response.getBody();
    }

    private void validateRequest(PathRequest request) {
        // 校验栅格地图尺寸
        if (request.getGrid().isEmpty() ||
                request.getGrid().get(0).isEmpty()) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "栅格地图无效");
        }

        // 校验坐标合法性
        int rows = request.getGrid().size();
        int cols = request.getGrid().get(0).size();

        for (Coordinate coord : request.getStarts()) {
            validateCoordinate(coord, rows, cols);
        }
        for (Coordinate coord : request.getGoals()) {
            validateCoordinate(coord, rows, cols);
        }
    }

    private void validateCoordinate(Coordinate coord, int rows, int cols) {
        if (coord.getX() < 0 || coord.getX() >= rows ||
                coord.getY() < 0 || coord.getY() >= cols) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "坐标超出地图范围");
        }
    }


}




