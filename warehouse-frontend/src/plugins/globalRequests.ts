/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import { message } from "antd";
import { extend } from "umi-request";
import { stringify } from "querystring";
import { history } from "umi";

 
 


 
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  // requestType: 'form',
});
 
/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
    console.log("do request url: " + url)
    return {
        url,
        options: {
        ...options,
        headers: {
        },
        },
    };
});
 
/**
 * 所有响应拦截器
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
request.interceptors.response.use(async (response, options): Promise<any> => {
    const res = await response.clone().json();
    if (res.code === 200) {
        return res;
    }

    if (res.code === 40003) {
        message.error("请先登录");
        // 重定向到登录页面
        history.replace({
            pathname: "/user/login",
            search: stringify({
                redirect: location.pathname,
            }),
        });
    } else {
        message.error(res.description);
    }

    return res;
});
 
export default request;