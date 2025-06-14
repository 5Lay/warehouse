package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 仿真记录表
 * @TableName record
 */
@TableName(value ="record")
@Data
public class Record implements Serializable {
    /**
     * 记录id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 起点列表
     */
    private String starts;

    /**
     * 目标点列表
     */
    private String goals;

    /**
     * 栅格地图
     */
    private String gird;

    /**
     * 路径列表
     */
    private String paths;

    /**
     * 创建用户id
     */
    private Long userId;

    /**
     * 创建时间
     */
    private Date createTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}