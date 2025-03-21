package com.wulei.warehousebackend.service;

import com.wulei.warehousebackend.model.dto.GridDto;
import com.wulei.warehousebackend.model.entity.Grid;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author Administrator
* @description 针对表【grid(仓库地图)】的数据库操作Service
* @createDate 2025-03-19 22:06:40
*/
public interface GridService extends IService<Grid> {

    public GridDto getGridMap(Long id);

    public Integer updateGridMap(GridDto gridDto);
}
