package com.wulei.warehousebackend.service;
import java.util.Date;

import com.wulei.warehousebackend.model.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @Resource
    UserService userService;

    @Test
    public void addUser() {
        User user = new User();

        user.setUsername("111111111");
        user.setPassword("123456");
        user.setNickname("lei");
        user.setGender(1);
        user.setAvatar("https://thirdwx.qlogo.cn/mmopen/vi_32/o33SoQ72YOpSLiavCzmL8Sj3IVWvcUj3icwibCYvxeuvInQWbywgiaZSINFnyLkYzKLRPH0TRQhPpfShVmibWaVgfIw/132");
        user.setPhone("110");
        user.setEmail("123@qq.com");

         userService.save(user);
    }

    @Test
    void register() {
        String username = "";
        String password = "";
        String checkPassword = "12345678";
        Long result = userService.register(username, password, checkPassword);
        assertEquals(-1L, result);

        username = "wu";
        result = userService.register(username, password, checkPassword);
        assertEquals(-1L, result);

        username = "wu@lei";
        password = "1234567";
        result = userService.register(username, password, checkPassword);
        assertEquals(-1L, result);

        password = "12345678";
        result = userService.register(username, password, checkPassword);

        username = "wulei";
        result = userService.register(username, password, checkPassword);
        assertEquals(-1L, result);

        username = "wuleii";
        result = userService.register(username, password, checkPassword);
//        assertNotEquals(-1L, result);


    }
}