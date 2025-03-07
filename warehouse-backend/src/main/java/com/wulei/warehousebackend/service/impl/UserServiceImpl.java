package com.wulei.warehousebackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.exception.BussinessException;
import com.wulei.warehousebackend.model.entity.User;
import com.wulei.warehousebackend.service.UserService;
import com.wulei.warehousebackend.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

import static com.wulei.warehousebackend.constant.UserConstant.SALT;
import static com.wulei.warehousebackend.constant.UserConstant.USER_LOGIN_STATUS;


/**
* @author Administrator
* @description 针对表【user(用户)】的数据库操作Service实现
* @createDate 2025-02-15 10:52:26
*/
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService {



    @Resource
    UserMapper userMapper;

    @Override
    public Long register(String username, String password, String checkPassword) {
        // 判断用户名、密码、确认密码是否为空
        if (StringUtils.isAnyBlank(username, password, checkPassword)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名、密码、确认密码不能为空");
        }

        // 判断用户名长度是否小于4
        if (username.length() < 4 ) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名长度不能小于4");
        }

        // 判断密码长度是否小于8
        if (password.length() < 8) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "密码长度不能小于8");
        }

        // 判断用户名是否包含特殊字符
        String regex = "[!@#$%^&*(){}\\[\\]:;\"',.<>?/~`]";
        Pattern pattern = Pattern.compile(regex);
        if (pattern.matcher(username).find()) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名不能包含特殊字符");
        }

        // 判断两次输入的密码是否相同
        if (!password.equals(checkPassword)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "两次输入的密码不一致");
        }

        // 判断用户名是否已存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        if (userMapper.selectOne(queryWrapper) != null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名已存在");
        }

        // 加密

        String encodePassword = DigestUtils.md5DigestAsHex((SALT + password).getBytes());

        User user = new User();
        user.setUsername(username);
        user.setPassword(encodePassword);
        int result = userMapper.insert(user);
        if (result == 0) {
            throw new BussinessException(ErrorCode.SYSTEM_ERROR, "用户注册失败");
        }
        return user.getId();
    }

    @Override
    public User login(String username, String password, HttpServletRequest request) {
        // 判断用户名、密码、确认密码是否为空
        if (StringUtils.isAnyBlank(username, password)) {
            // todo 全局异常处理
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名、密码不能为空");
        }

        // 判断用户名长度是否小于4
        if (username.length() < 4 ) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名长度不能小于4");
        }

        // 判断密码长度是否小于8
        if (password.length() < 8) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "密码长度不能小于8");
        }

        // 判断用户名是否包含特殊字符
        String regex = "[!@#$%^&*(){}\\[\\]:;\"',.<>?/~`]";
        Pattern pattern = Pattern.compile(regex);
        if (pattern.matcher(username).find()) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, "用户名不能包含特殊字符");
        }

        String encodePassword = DigestUtils.md5DigestAsHex((SALT + password).getBytes());

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        queryWrapper.eq("password", encodePassword);
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            log.info("user login failed, username can't match password");
            throw new BussinessException(ErrorCode.USER_ACCOUNT_ERROR, "用户名或密码错误");
        }

        // 用户脱敏
        User safeUser = getSafeUser(user);


        // 记录用户态
        request.getSession().setAttribute(USER_LOGIN_STATUS, safeUser);

        return safeUser;
    }

    @Override
    public int logout(HttpServletRequest request) {
        request.getSession().removeAttribute(USER_LOGIN_STATUS);
        return 1;
    }


    /**
     * 用户信息脱敏
     * @param user
     * @return
     */
    @Override
    public User getSafeUser(User user) {
        if (user == null) {
            return null;
        }
        User safeUser = new User();
        safeUser.setId(user.getId());
        safeUser.setUsername(user.getUsername());
        safeUser.setNickname(user.getNickname());
        safeUser.setGender(user.getGender());
        safeUser.setAge(user.getAge());
        safeUser.setAvatar(user.getAvatar());
        safeUser.setAddress(user.getAddress());
        safeUser.setPhone(user.getPhone());
        safeUser.setEmail(user.getEmail());
        safeUser.setCreateTime(user.getCreateTime());
        safeUser.setUpdateTime(user.getUpdateTime());
        safeUser.setUserRole(user.getUserRole());
        safeUser.setUserStatus(user.getUserStatus());

        return safeUser;
    }
}




