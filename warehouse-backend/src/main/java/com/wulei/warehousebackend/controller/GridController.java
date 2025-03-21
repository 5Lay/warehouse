package com.wulei.warehousebackend.controller;

import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.model.dto.GridDto;
import com.wulei.warehousebackend.service.GridService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/grid")
public class GridController {

    @Resource
    private GridService gridService;

    @GetMapping("/{id}")
    public BaseResponse<GridDto> getGrid(@PathVariable Long id) {
        return ResultUtils.success(gridService.getGridMap(id));
    }

    @PutMapping()
    public BaseResponse<Integer> updateGrid(@RequestBody GridDto gridDto) {
        return ResultUtils.success(gridService.updateGridMap(gridDto));
    }
}
