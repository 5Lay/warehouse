package com.wulei.warehousebackend.controller;

import com.wulei.warehousebackend.common.BaseResponse;
import com.wulei.warehousebackend.common.ResultUtils;
import com.wulei.warehousebackend.model.entity.Record;
import com.wulei.warehousebackend.model.request.RecordRequest;
import com.wulei.warehousebackend.service.RecordService;
import com.wulei.warehousebackend.utils.JsonUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;

@RestController
@RequestMapping("/record")
public class RecordController {

    @Resource
    private RecordService recordService;

    @PostMapping()
    public BaseResponse<Boolean> addRecord(@RequestBody RecordRequest recordRequest) {
        System.out.println(recordRequest);
        Record record = convertRecordRequestToRecord(recordRequest);
        final boolean result = recordService.save(record);
        return ResultUtils.success(result);
    }

    public Record convertRecordRequestToRecord(RecordRequest recordRequest) {
        Record record = new Record();

        // 转换 starts 为 JSON 字符串
        record.setStarts(JsonUtils.toJsonString(recordRequest.getStarts()));

        // 转换 goals 为 JSON 字符串
        record.setGoals(JsonUtils.toJsonString(recordRequest.getGoals()));

        // 转换 grid 为 JSON 字符串
        record.setGird(JsonUtils.toJsonString(recordRequest.getGrid()));

        // 转换 paths 为 JSON 字符串
        record.setPaths(JsonUtils.toJsonString(recordRequest.getPaths()));

        // 设置 userId
        record.setUserId(recordRequest.getUserId());

        // 设置创建时间
        record.setCreateTime(new Date());

        return record;
    }
}
