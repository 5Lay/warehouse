package com.wulei.warehousebackend.service;

import com.wulei.warehousebackend.model.entity.Agv;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wulei.warehousebackend.model.request.PathRequest;
import com.wulei.warehousebackend.model.response.PathResponse;

/**
* @author Administrator
* @description 针对表【agv(自动引导车)】的数据库操作Service
* @createDate 2025-03-05 22:30:39
*/
public interface AgvService extends IService<Agv> {

    public PathResponse getPaths(PathRequest request);

    public void processPythonCallback(String taskId, PathResponse response);

}
