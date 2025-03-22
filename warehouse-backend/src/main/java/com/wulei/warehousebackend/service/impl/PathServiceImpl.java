package com.wulei.warehousebackend.service.impl.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wulei.warehousebackend.model.entity.Path;
import com.wulei.warehousebackend.service.PathService;
import com.wulei.warehousebackend.mapper.PathMapper;
import org.springframework.stereotype.Service;

/**
* @author Administrator
* @description 针对表【path(路径表)】的数据库操作Service实现
* @createDate 2025-03-21 16:47:27
*/
@Service
public class PathServiceImpl extends ServiceImpl<PathMapper, Path>
    implements PathService{

}




