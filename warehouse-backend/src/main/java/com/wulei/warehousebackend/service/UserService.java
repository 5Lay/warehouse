package com.wulei.warehousebackend.service;

import com.wulei.warehousebackend.model.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;

/**
* @author Administrator
* @description 针对表【user(用户)】的数据库操作Service
* @createDate 2025-02-15 10:52:26
*/
public interface UserService extends IService<User> {

    public Long register(String username, String password, String checkPassword);

    public User login(String username, String password, HttpServletRequest request);

    public int logout(HttpServletRequest request);

    User getSafeUser(User user);
}
