package com.wulei.warehousebackend.model.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.wulei.warehousebackend.utils.CoordinateDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonDeserialize(using = CoordinateDeserializer.class)
public class Coordinate {
    @JsonProperty("x")
    public int x;
    @JsonProperty("y")
    public int y;

    public int manhattanDistance(Coordinate other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
}
