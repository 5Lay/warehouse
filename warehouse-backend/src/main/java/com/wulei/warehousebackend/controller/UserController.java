package com.wulei.warehousebackend.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wulei.warehousebackend.model.entity.User;
import com.wulei.warehousebackend.model.request.LoginRequest;
import com.wulei.warehousebackend.model.request.RegisterRequest;
import com.wulei.warehousebackend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.wulei.warehousebackend.constant.UserConstant.ADMIN_ROLE;
import static com.wulei.warehousebackend.constant.UserConstant.USER_LOGIN_STATUS;

@RestController
@RequestMapping ("/user")
@Slf4j
public class UserController {

    @Resource
    private UserService userService;


    @PostMapping ("/register")
    public Long register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest == null) {
            return null;
        }
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();
        String checkPassword = registerRequest.getCheckPassword();

        if (StringUtils.isAnyBlank(username, password, checkPassword)) {
            return null;
        }

        return userService.register(username, password, checkPassword);
    }

    @PostMapping ("/login")
    public User login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        if (loginRequest == null) {
            return null;
        }
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if (StringUtils.isAnyBlank(username, password)) {
            return null;
        }

        return userService.login(username, password, request);
    }

    @GetMapping ("/current")
    public User getCurrentUser(HttpServletRequest request) {
        User currentUser = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        if (currentUser == null) {
            return null;
        }
        Long id = currentUser.getId();
        // todo: 验证用户是否合法
        User user = userService.getById(id);
        return userService.getSafeUser(user);
    }

    @GetMapping("search")
    public List<User> searchUser(String username, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return new ArrayList<>();
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            queryWrapper.like("username", username);
        }
        List<User> userList = userService.list(queryWrapper);
        return userList.stream().map(user -> {
            return userService.getSafeUser(user);
        }).collect(Collectors.toList());
    }

    @DeleteMapping("delete")
    public boolean delete(Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return false;
        }
        if (id == null) {
            return false;
        }
        return userService.removeById(id);
    }

    private boolean isAdmin(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        return user != null && user.getUserRole() == ADMIN_ROLE;
    }
}
