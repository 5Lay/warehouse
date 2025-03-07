package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 自动引导车
 * @TableName agv
 */
@TableName(value ="agv")
@Data
public class Agv implements Serializable {
    /**
     * AGV_ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 起点X坐标
     */
    private Integer start_x;

    /**
     * 起点Y坐标
     */
    private Integer start_y;

    /**
     * 终点X坐标
     */
    private Integer goal_x;

    /**
     * 终点Y坐标
     */
    private Integer goal_y;

    /**
     * 路径动作
     */
    private String actions;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}