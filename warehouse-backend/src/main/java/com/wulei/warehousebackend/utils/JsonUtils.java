package com.wulei.warehousebackend.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class JsonUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 将对象转换为 JSON 字符串
     */
    public static String toJsonString(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert object to JSON string", e);
        }
    }

    /**
     * 将 JSON 字符串转换为指定类型的对象
     */
    public static <T> T fromJsonString(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON string to object", e);
        }
    }

    /**
     * 将 JSON 字符串转换为复杂的泛型对象（如 List<List<Integer>>）
     */
    public static <T> T fromJsonString(String json, TypeReference<T> typeRef) {
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON string to object", e);
        }
    }
}