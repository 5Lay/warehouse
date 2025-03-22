import { Component } from "react";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' }

    ],
  },
  
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    Component: './Admin',
    routes: [
      
      { path: '/admin/user-manage', name: '用户管理',  component: './Admin/UserManage' },
      { path: '/admin/agv-manage', name: 'AGV管理',  component: './Admin/AGVManage' },
      { Component: './404' }
    ],
  },
  { name: '订单管理', icon: 'table', path: '/order-manage', component: './OrderManage' },
  {
    path: '/simulate',
    name: '仿真页',
    icon: 'crown',
    Component: './Simulate',
    routes: [
      
      { path: '/simulate/screen', name: '仿真大屏',  component: './Simulate/Screen' },
      { path: '/simulate/manage', name: '仿真管理',  component: './Simulate/SimulateManage' },
      { Component: './404' }
    ],
  },
  {
    path: '/user',
    name: '个人页',
    icon: 'user',
    Component: './User',
    routes: [
      { name: '个人中心', path: '/user/info', component: './User/Info' },
    ],
  },
  
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
