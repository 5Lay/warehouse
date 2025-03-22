// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequests';

/** 删除用户 Delete /api/order/{id} */
export async function deleteOrder(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/order/${id}`, {
    method: 'Delete',
    ...(options || {}),
  });
}

/** 更新AGV Put /api/order/ */
export async function updateOrder(body: API.Order, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/order`, {
    method: 'Put',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加AGV POST /api/order/ */
export async function addOrder(body: API.Order, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Boolean>>('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取AGV列表 GET /api/order/ */
export async function getOrderList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.Order[]>>('/api/order', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新Grid Put /api/grid/ */
export async function updateGrid(body: API.GridData, options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>(`/api/grid`, {
    method: 'Put',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/grid/{id} */
export async function getGridData(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.GridData>>(`/api/grid/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取AGV列表 GET /api/agv/ */
export async function getAgvList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.Agv[]>>('/api/agv', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除用户 Delete /api/agv/{id} */
export async function deleteAgv(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/agv/${id}`, {
    method: 'Delete',
    ...(options || {}),
  });
}

/** 更新AGV Put /api/agv/ */
export async function updateAgv(body: API.Agv, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/agv`, {
    method: 'Put',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加AGV POST /api/agv/ */
export async function addAgv(body: API.Agv, options?: { [key: string]: any }) {
  return request<API.BaseResponse<Boolean>>('/api/agv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 Delete /api/user */
export async function deleteUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/user/${id}`, {
    method: 'Delete',
    ...(options || {}),
  });
}

/** 更新用户 Put /api/user */
export async function updateUser(body: API.CurrentUser,options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>(`/api/user`, {
    method: 'Put',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 搜索用户 GET /api/user */
export async function searchUsers(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser[]>>('/api/user/search', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
