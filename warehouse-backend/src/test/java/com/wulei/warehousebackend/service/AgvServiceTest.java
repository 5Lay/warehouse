package com.wulei.warehousebackend.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
public class AgvServiceTest {

    @Resource
    AgvService agvService;
    @Test
    public void getAgvList() {

        System.out.println(agvService.list());
    }
}
