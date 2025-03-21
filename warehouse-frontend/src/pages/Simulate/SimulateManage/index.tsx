import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {Image} from 'antd';
import { useRef } from 'react';
import React from 'react';
import { searchUsers, deleteUser, updateUser } from '@/services/ant-design-pro/api';


export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'ID',
    dataIndex: 'id',
    valueType: 'indexBorder',
    hideInTable: true,
    editable: false,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    copyable: true,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    editable: false
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    search: false,
    editable: false,
    render: (_, record) => (
      <div>
        <Image src={record.avatar} width={50} height={50}/>
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: { text: '未知', color: 'grey' },
      1: { text: '男', color: 'blue' },
      2: { text: '女', color: 'pink' },
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    copyable: true,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮件',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    valueType: 'select',
    valueEnum: {
      0: { text: '正常', status: 'success' },
      1: { text: '封号', status: 'Error' },
    },
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: { text: '普通用户', status: 'Default' },
      1: { text: '管理员', status: 'success'},
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    hideInTable: false,
    editable: false,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
    ],
  },
];

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  return (
    <div id='user-manage'>
      <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          // await waitTime(2000);
          const res = await searchUsers();
          return {
            data: res.data,
          };
        }}
        editable={{
          type: 'multiple',
          onSave: async (key, row) => {
            await updateUser(row);
          },
          onDelete: async (key, row) => {
            console.log(key, row);
            await deleteUser(row.id);
          }
        }}
        
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户管理"
        toolBarRender={() => [
          
 
        ]}
      />
    </div>
  );
};
export default UserManage;
