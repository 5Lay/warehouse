package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 路径表
 * @TableName path
 */
@TableName(value ="path")
@Data
public class Path implements Serializable {
    /**
     * 路径id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * AGV_id
     */
    private Long agvId;

    /**
     * 订单id
     */
    private Long orderId;

    /**
     * 每一步的动作
     */
    private String actions;

    /**
     * 
     */
    private Long recordId;

    /**
     * 创建时间
     */
    private Date createTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}