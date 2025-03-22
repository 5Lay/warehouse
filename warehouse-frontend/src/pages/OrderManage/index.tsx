import { addOrder, deleteOrder, getOrderList, updateOrder } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Form, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';

const columns: ProColumns<API.Order>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '订单编号',
    dataIndex: 'id',
    editable: false,
  },
  {
    title: '目标X坐标',
    dataIndex: 'goalX',
  },
  {
    title: '目标Y坐标',
    dataIndex: 'goalY',
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

const OrderManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onCreate = async (values: API.Order) => {
    console.log('Received values of form: ', values);
    await addOrder(values);
    actionRef.current?.reload();
    setOpen(false);
  };

  
  return (
    <div id="order-manage">
      <ProTable<API.Order, API.PageParams>
        columns={columns}
        cardBordered
        headerTitle={'订单列表'}
        actionRef={actionRef}
        rowKey="id"

        request={async (params, sort, filter) => {
          console.log(sort, filter);
          // await waitTime(2000);
          const res = await getOrderList();
          console.log(res);
          return {
            data: res.data,
          };
        }}

        editable={{
          type: 'multiple',
          onSave: async (key, row) => {
            await updateOrder(row);
          },
          onDelete: async (key, row) => {
            console.log(key, row);
            await deleteOrder(row.id);
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
        title="新增订单"
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
          name="goalX"
          label="目标X坐标"
          rules={[{ required: true, message: '请输入订单目标X坐标' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="goalY"
          label="目标Y坐标"
          rules={[{ required: true, message: '请输入订单目标Y坐标' }]}
        >
          <Input />
        </Form.Item>
      </Modal>
    </div>
  );
};
export default OrderManage;
