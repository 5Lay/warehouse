package com.wulei.warehousebackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.config.utils.TaskWebSocketHandler;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.mapper.OrderMapper;
import com.wulei.warehousebackend.model.dto.Coordinate;
import com.wulei.warehousebackend.model.entity.Agv;
import com.wulei.warehousebackend.model.entity.Order;
import com.wulei.warehousebackend.model.request.PathRequest;
import com.wulei.warehousebackend.model.request.PythonRequest;
import com.wulei.warehousebackend.model.response.PathResponse;
import com.wulei.warehousebackend.service.AgvService;
import com.wulei.warehousebackend.mapper.AgvMapper;
import com.wulei.warehousebackend.service.utils.HungarianAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    @Autowired
    private AgvMapper agvMapper;
    @Autowired
    private OrderMapper orderMapper;

    public void processPythonCallback(String taskId, PathResponse response) {
        // 当收到Python服务回调时触发推送
        wsHandler.sendTaskResult(taskId, response);
    }

    public String getPaths(PathRequest request) {
        // 1. 请求体校验
        validateRequest(request);

        // 2. 分配订单
        List<Coordinate> starts = new ArrayList<>();
        List<Coordinate> goals = new ArrayList<>();
        for (Long id : request.getAgvId()) {
            Agv agv = agvMapper.selectById(id);
            if (agv == null) {
                throw new BussinessException(ErrorCode.PARAM_ERROR,"id为" + id + "的AGV不存在");
            }
            starts.add(new Coordinate(agv.getStartX(), agv.getStartY()));
        }

        for (Long id : request.getOrderId()) {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                throw new BussinessException(ErrorCode.PARAM_ERROR, "id为" + id + "的订单不存在");
            }
            goals.add(new Coordinate(order.getGoalX(), order.getGoalY()));
        }
        int[] assigned = assign_order(starts, goals);
        List<Coordinate> assigned_goals = new ArrayList<>();
        for (int i = 0; i < assigned.length; i++) {
            assigned_goals.add(goals.get(assigned[i]));
        }

        // 2. 调用Python服务
        HttpEntity<PythonRequest> entity = new HttpEntity<>(new PythonRequest(starts, assigned_goals, request.getGrid()));
        ResponseEntity<Map> response;

        try {
            response = restTemplate.postForEntity(
                    PYTHON_API_URL,
                    entity,
                    Map.class
            );
        } catch (RestClientException e) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "路径规划服务调用失败: " + e.getMessage());
        }
        System.out.println(response.getStatusCode()+ "\n" + response.getBody() + "\n" + HttpStatus.OK);
        // 3. 处理响应
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "服务返回错误: " + response.getBody());
        }
        return (String) response.getBody().get("task_id");
    }

    private void validateRequest(PathRequest request) {
        // 校验栅格地图尺寸
        if (request.getGrid().isEmpty() ||
                request.getGrid().get(0).isEmpty()) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "栅格地图无效");
        }

        // 校验坐标合法性
        List<List<Integer>> grid = request.getGrid();
        int rows = grid.size();
        int cols = grid.get(0).size();
        List<Coordinate> starts = new ArrayList<>();
        List<Coordinate> goals = new ArrayList<>();
        for (Long id : request.getAgvId()) {
            Agv agv = agvMapper.selectById(id);
            if (agv == null) {
                throw new BussinessException(ErrorCode.PARAM_ERROR,"id为" + id + "的AGV不存在");
            }
            starts.add(new Coordinate(agv.getStartX(), agv.getStartY()));
        }

        for (Long id : request.getOrderId()) {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                throw new BussinessException(ErrorCode.PARAM_ERROR, "id为" + id + "的订单不存在");
            }
            goals.add(new Coordinate(order.getGoalX(), order.getGoalY()));
        }

        if (starts.size() != goals.size()) {

        }

        for (Coordinate coord : starts) {
            validateCoordinate(coord, rows, cols, grid);
        }
        for (Coordinate coord : goals) {
            validateCoordinate(coord, rows, cols, grid);
        }
    }

    private void validateCoordinate(Coordinate coord, int rows, int cols, List<List<Integer>> grid) {
        if (coord.getX() < 0 || coord.getX() >= rows ||
                coord.getY() < 0 || coord.getY() >= cols) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "坐标超出地图范围");
        }
        if (grid.get(coord.getX()).get(coord.getY()) == 1) {
            throw new BussinessException(ErrorCode.PATH_PLAN_ERROR, "坐标位于货架上");
        }
    }

    // 匈牙利算法分配订单
    private int[] assign_order(List<Coordinate> agvs, List<Coordinate> orders) {
        Coordinate[] starts = agvs.toArray(new Coordinate[agvs.size()]);
        Coordinate[] goals = orders.toArray(new Coordinate[orders.size()]);
        HungarianAlgorithm ha = new HungarianAlgorithm(starts, goals);
        int[] assignment = ha.execute();

        // 输出分配结果
        for (int i = 0; i < starts.length; i++) {
            if (assignment[i] < goals.length) {
                System.out.printf("AGV %d(%d,%d) -> Order %d(%d,%d)\n",
                        i, starts[i].x, starts[i].y,
                        assignment[i],
                        goals[assignment[i]].x,
                        goals[assignment[i]].y);
            } else {
                System.out.printf("AGV %d 未分配订单\n", i);
            }
        }
        return assignment;
    }
}




