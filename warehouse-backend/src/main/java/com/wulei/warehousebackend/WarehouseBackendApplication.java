package com.wulei.warehousebackend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wulei.warehousebackend.mapper")
public class WarehouseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WarehouseBackendApplication.class, args);
    }

}
