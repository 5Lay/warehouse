package com.wulei.warehousebackend.model.response;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.wulei.warehousebackend.model.dto.Coordinate;
import lombok.Data;

import java.util.List;

// PathResponse.java
@Data
public class PathResponse {
    @JsonProperty("starts")
    private List<Coordinate> starts;
    @JsonProperty("goals")
    private List<Coordinate> goals;
    @JsonProperty("grid")
    private List<List<Integer>> grid;
    @JsonProperty("paths")
    private List<List<Coordinate>> paths;
}