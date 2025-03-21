package com.wulei.warehousebackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 仓库地图
 * @TableName grid
 */
@TableName(value ="grid")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Grid implements Serializable {
    /**
     * 地图id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 行数
     */
    private Integer gridRow;

    /**
     * 列数
     */
    private Integer gridCol;

    /**
     * 栅格地图压缩后的字符串
     */
    private String gridMap;

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