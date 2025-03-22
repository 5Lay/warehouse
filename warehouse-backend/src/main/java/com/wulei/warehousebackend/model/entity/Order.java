package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 订单表
 * @TableName order
 */
@TableName(value ="order_info")
@Data
public class Order implements Serializable {
    /**
     * 订单id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 目的地X坐标
     */
    private Integer goalX;

    /**
     * 目的地Y坐标
     */
    private Integer goalY;

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