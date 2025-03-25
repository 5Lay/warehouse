package com.wulei.warehousebackend.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.wulei.warehousebackend.model.dto.Coordinate;

import java.io.IOException;
import java.util.List;

public class CoordinateDeserializer extends JsonDeserializer<Coordinate> {
    @Override
    public Coordinate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        // 读取数组值
        List<Integer> values = p.readValueAs(List.class);
        if (values.size() != 2) {
            throw new IllegalArgumentException("Invalid coordinate array. Expected [x, y]");
        }
        return new Coordinate(values.get(0), values.get(1));
    }
}
