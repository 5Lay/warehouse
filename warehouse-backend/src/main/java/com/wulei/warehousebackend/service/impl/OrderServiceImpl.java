package com.wulei.warehousebackend.service.impl.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.model.entity.Order;
import com.wulei.warehousebackend.service.OrderService;
import com.wulei.warehousebackend.mapper.OrderMapper;
import org.springframework.stereotype.Service;

/**
* @author Administrator
* @description 针对表【order(订单表)】的数据库操作Service实现
* @createDate 2025-03-21 16:47:27
*/
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order>
    implements OrderService{

}




