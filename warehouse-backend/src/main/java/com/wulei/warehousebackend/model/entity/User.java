package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 用户
 * @TableName user
 */
@TableName(value ="user")
@Data
public class User implements Serializable {
    /**
     * 用户id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 性别 0-位置 1-男 2-女
     */
    private Integer gender;

    /**
     * 头像url
     */
    private String avatar;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 用户状态 0-异常 1-正常
     */
    @TableField(value = "user_status")
    private Integer userStatus;

    /**
     * 创建时间
     */
    @TableField(value = "create_time")
    private Date createTime;

    /**
     *  更新时间
     */
    @TableField(value = "update_time")
    private Date updateTime;

    /**
     * 是否删除（逻辑删除） 0-未删除 1-已删除
     */
    @TableField(value = "is_delete")
    @TableLogic
    private Integer isDeleted;

    /**
     * 用户角色 默认值0（普通用户） 、1（管理员）
     */
    @TableField(value = "user_role")
    private Integer userRole;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}