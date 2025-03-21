package com.wulei.warehousebackend.service;

import com.wulei.warehousebackend.mapper.GridMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
public class GridServiceTest {

    @Autowired
    private GridService gridService;

    @Resource
    private GridMapper gridMapper;

    @Test
    public void gridTest() {
    }
}
