package com.wulei.warehousebackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.model.dto.GridDto;
import com.wulei.warehousebackend.model.entity.Grid;
import com.wulei.warehousebackend.service.GridService;
import com.wulei.warehousebackend.mapper.GridMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
* @author Administrator
* @description 针对表【grid(仓库地图)】的数据库操作Service实现
* @createDate 2025-03-19 22:06:40
*/
@Service
public class GridServiceImpl extends ServiceImpl<GridMapper, Grid>
    implements GridService{

    @Resource
    private GridMapper gridMapper;

    @Override
    public GridDto getGridMap(Long gridId) {
        Grid grid = gridMapper.selectById(gridId);
        return gridObjToDto(grid);
    }

    @Override
    public Integer updateGridMap(GridDto gridDto) {
        Grid gridObj = gridDtoToObj(gridDto);
        gridObj.setUpdateTime(new Date());
        return gridMapper.updateById(gridObj);
    }

    private Grid gridDtoToObj(GridDto gridDto) {
        List<List<Integer>> gridMap = gridDto.getGrid();
        Grid grid = new Grid();
        grid.setId(gridDto.getId());
        grid.setGridRow(gridMap.size());
        grid.setGridCol(gridMap.get(0).size());
        StringBuilder sb = new StringBuilder();

        for (List<Integer> row : gridMap) {
            for (Integer value : row) {
                if (value == 0 || value == 1) {
                    sb.append(value);
                } else {
                    throw new IllegalArgumentException("矩阵中包含非0或非1的值: " + value);
                }
            }
        }
        grid.setGridMap(sb.toString());
        return grid;
    }


    private GridDto gridObjToDto(Grid grid) {
        List<List<Integer>> gridMap = new ArrayList<List<Integer>>();
        int r = grid.getGridRow();
        int c = grid.getGridCol();
        String gridStr = grid.getGridMap();
        // 初始化 gridMap，确保有 r 行
        for (int i = 0; i < r; i++) {
            gridMap.add(new ArrayList<>());
        }

        for (int i = 0, k = 0; i < r; i++) {
            for (int j = 0; j < c; j++, k++) {
                // 确保 k 不超过 gridStr 的长度
                if (k >= gridStr.length()) {
                    throw new IllegalArgumentException("字符串长度不足");
                }
                int value = Integer.parseInt(String.valueOf(gridStr.charAt(k)));
                gridMap.get(i).add(value);
            }
        }
        return new GridDto(grid.getId(), gridMap);
    }
}




