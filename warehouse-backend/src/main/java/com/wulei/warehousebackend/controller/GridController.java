package com.wulei.warehousebackend.controller;

import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ErrorCode;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.exception.BussinessException;
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
        if (id == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        return ResultUtils.success(gridService.getGridMap(id));
    }

    @PutMapping()
    public BaseResponse<Integer> updateGrid(@RequestBody GridDto gridDto) {
        if (gridDto == null) {
            throw new BussinessException(ErrorCode.PARAM_ERROR);
        }
        return ResultUtils.success(gridService.updateGridMap(gridDto));
    }
}
