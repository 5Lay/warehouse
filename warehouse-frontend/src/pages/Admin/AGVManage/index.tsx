import { addAgv, deleteAgv, getAgcList, updateAgv } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';

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

const columns: ProColumns<API.Agv>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'AGV编号',
    dataIndex: 'id',
    editable: false,
  },
  {
    title: '起点X坐标',
    dataIndex: 'startX',
  },
  {
    title: '起点Y坐标',
    dataIndex: 'startY',
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
    title: '修改时间',
    dataIndex: 'updateTime',
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

interface Values {
  startX?: string;
  startY?: string;
}

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    addAgv(values as API.Agv);
    actionRef.current?.reload();
    setOpen(false);
  };

  return (
    <div id="agv-manage">
      <ProTable<API.Agv>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          // await waitTime(2000);
          const res = await getAgcList();
          console.log(res);
          return {
            data: res.data,
          };
        }}
        editable={{
          type: 'multiple',
          onSave: async (key, row) => {
            await updateAgv(row);
          },
          onDelete: async (key, row) => {
            console.log(key, row);
            await deleteAgv(row.id);
          },
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
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <Modal
        open={open}
        title="新增AGV"
        okText="添加"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="horizontal"
            form={form}
            name="form_in_modal"
            initialValues={{}}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="startX"
          label="起点X坐标"
          rules={[{ required: true, message: '请输入AGV起点X坐标' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="startY"
          label="起点Y坐标"
          rules={[{ required: true, message: '请输入AGV起点Y坐标' }]}
        >
          <Input />
        </Form.Item>
      </Modal>
    </div>
  );
};
export default UserManage;
