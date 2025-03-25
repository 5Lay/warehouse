package com.wulei.warehousebackend.model.request;

import com.wulei.warehousebackend.model.dto.Point;
import lombok.Data;

import java.util.List;

@Data
public class RecordRequest {

    private List<Point> starts;
    private List<Point> goals;
    private List<List<Integer>> grid;
    private List<List<Point>> paths;
    private Long userId;
}
