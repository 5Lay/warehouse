package com.wulei.warehousebackend.model.request;


import com.wulei.warehousebackend.model.dto.Coordinate;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class PathRequest {
    @NotNull(message = "起点不能为空")
    private List<Coordinate> starts;

    @NotNull(message = "终点不能为空")
    private List<Coordinate> goals;

    @NotNull(message = "栅格地图不能为空")
    private List<List<Integer>> grid;
}
