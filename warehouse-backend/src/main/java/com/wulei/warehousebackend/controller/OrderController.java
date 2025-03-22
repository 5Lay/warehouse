package com.wulei.warehousebackend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.mapper.OrderMapper;
import com.wulei.warehousebackend.model.dto.OrderDto;
import com.wulei.warehousebackend.model.entity.Order;
import com.wulei.warehousebackend.model.request.OrderRequest;
import com.wulei.warehousebackend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Resource
    OrderService orderService;

    @Resource
    OrderMapper orderMapper;

    @GetMapping()
    public BaseResponse<List<Order>> getOrderList() {
        List<Order> orderList = orderService.list(new QueryWrapper<>());
        return ResultUtils.success(orderList);
    }

    @PostMapping()
    public BaseResponse<Boolean> addOrder(@RequestBody OrderRequest orderRequest) {
        if (orderRequest == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        Order order = new Order();
        order.setGoalX(orderRequest.getGoalX());
        order.setGoalY(orderRequest.getGoalY());
        boolean result = orderService.save(order);
        return ResultUtils.success(result);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Boolean> deleteOrder(@PathVariable Long id) {
        if (id == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        final boolean result = orderService.removeById(id);
        return ResultUtils.success(result);
    }

    @PutMapping()
    public BaseResponse<Boolean> updateOrder(@RequestBody OrderDto orderDto) {
        if (orderDto == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        Order order = new Order();
        order.setId(orderDto.getId());
        order.setGoalX(orderDto.getGoalX());
        order.setGoalY(orderDto.getGoalY());
        order.setUpdateTime(new Date());
        boolean result = orderService.updateById(order);
        return ResultUtils.success(result);
    }
}
