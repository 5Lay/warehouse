package com.wulei.warehousebackend.model.response;

import com.wulei.warehousebackend.model.dto.Coordinate;
import lombok.Data;

import java.util.List;

// PathResponse.java
@Data
public class PathResponse {
    private List<PathInfo> paths;

    @Data
    public static class PathInfo {
        private int agvId;
        private List<Coordinate> path;
    }
}