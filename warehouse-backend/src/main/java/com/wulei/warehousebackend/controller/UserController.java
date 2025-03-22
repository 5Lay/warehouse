package com.wulei.warehousebackend.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.model.entity.User;
import com.wulei.warehousebackend.model.request.LoginRequest;
import com.wulei.warehousebackend.model.request.RegisterRequest;
import com.wulei.warehousebackend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
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
    public BaseResponse<Long> register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest == null) {
            return ResultUtils.fail(ErrorCode.PARAM_ERROR);
        }
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();
        String checkPassword = registerRequest.getCheckPassword();

        if (StringUtils.isAnyBlank(username, password, checkPassword)) {
            return ResultUtils.fail(ErrorCode.PARAM_ERROR);
        }
        Long result = userService.register(username, password, checkPassword);

        return ResultUtils.success(result);
    }

    @PostMapping ("/login")
    public BaseResponse<User> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        if (loginRequest == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if (StringUtils.isAnyBlank(username, password)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        User user = userService.login(username, password, request);
        return ResultUtils.success(user);
    }

    @PostMapping ("/logout")
    public BaseResponse<Integer> logout(HttpServletRequest request) {
        if (request == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        int logout = userService.logout(request);
        return ResultUtils.success(logout);
    }

    @GetMapping ("/current")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request) {
        User currentUser = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        if (currentUser == null) {
            throw new BussinessException(ErrorCode.USER_NOT_LOGIN);
        }
        Long id = currentUser.getId();
        // todo: 验证用户是否合法
        User user = userService.getById(id);
        User safeUser = userService.getSafeUser(user);
        return ResultUtils.success(safeUser);
    }

    @GetMapping("/search")
    public BaseResponse<List<User>> searchUser(String username, HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            queryWrapper.like("username", username);
        }
        List<User> userList = userService.list(queryWrapper);
        List<User> safeUserList = userList.stream().map(user -> {
            return userService.getSafeUser(user);
        }).collect(Collectors.toList());
        return ResultUtils.success(safeUserList);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Boolean> delete(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        if (id == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        boolean remove = userService.removeById(id);
        return ResultUtils.success(remove);
    }

    @PutMapping("/")
    public BaseResponse<Boolean> update(@RequestBody User user, HttpServletRequest request) {
        if (user == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        if (!isAdmin(request) || !isSelf(user, request)) {
            throw new BussinessException(ErrorCode.USER_WITHOUT_PERMISSION);
        }
        user.setUpdateTime(new Date());
        boolean update = userService.updateById(user);
        return ResultUtils.success(update);
    }

    private boolean isAdmin(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        return user != null && user.getUserRole() == ADMIN_ROLE;
    }

    private boolean isSelf(User user, HttpServletRequest request) {
        User currentUser = (User) request.getSession().getAttribute(USER_LOGIN_STATUS);
        return currentUser != null  && currentUser.getId().equals(user.getId());
    }
}
