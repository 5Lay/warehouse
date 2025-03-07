import { updateUser } from '@/services/ant-design-pro/api';
import { UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Typography,
} from 'antd';
import Title from 'antd/es/typography/Title';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
const dateFormat = 'YYYY-MM-DD';
const GenderMap: { [key: number]: { sex: string; color: string } } = {
  0: {
    sex: '未知',
    color: 'grey',
  },
  1: {
    sex: '男',
    color: 'blue',
  },
  2: {
    sex: '女',
    color: 'pink',
  },
};

const RoleMap: { [key: number]: string } = {
  0: '普通用户',
  1: '管理员',
};

const StatusMap: { [key: number]: string } = {
  0: '正常',
  1: '封号',
};

const UserInfo: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [formValues, setFormValues] = useState(currentUser);
  const gender = GenderMap[formValues?.gender ?? 0];
  const role = RoleMap[formValues?.userRole ?? 0];
  const status = StatusMap[formValues?.userStatus ?? 0];
  

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // 当 initialState 或 currentUser 发生变化时，更新本地状态
  useEffect(() => {
    setFormValues(currentUser);
  }, [currentUser]);

  const onSave = async (values: API.CurrentUser) => {
    console.log('Received values of form: ', values);
    let newUser: API.CurrentUser = { ...formValues } as API.CurrentUser;
    if (values.nickname !== undefined && newUser) {
      newUser.nickname = values.nickname;
    }
    if (values.age !== undefined && newUser) {
      newUser.age = values.age;
    }
    if (values.gender !== undefined && newUser) {
      newUser.gender = values.gender;
    }
    if (values.address !== undefined && newUser) {
      newUser.address = values.address;
    }
    if (values.phone !== undefined && newUser) {
      newUser.phone = values.phone;
    }
    if (values.email !== undefined && newUser) {
      newUser.email = values.email;
    }
    await updateUser(newUser);
    setFormValues(newUser);
    setOpen(false);
  };

  return (
    <>
      <div id="userInfo" style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title="个人信息"
          variant="borderless"
          style={{ width: '80%', padding: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
        >
          <Flex gap="middle">
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<UserOutlined />}
              src={formValues?.avatar}
              style={{ margin: '10px' }}
            />
            <Flex vertical>
              <Title>{formValues?.nickname}</Title>
              {/* <span>性别: {GenderMap[formValues?.gender ?? 0]}</span> */}

              <Typography.Text
                style={{
                  backgroundColor: 'rgba(77, 72, 72, 0.016)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginTop: '5px',
                }}
              >
                性别:{' '}
                <Badge
                  key={gender.color}
                  color={gender.color}
                  style={{ padding: '5px' }}
                  text={gender.sex}
                />
              </Typography.Text>
              <Typography.Text
                style={{
                  backgroundColor: 'rgba(77, 72, 72, 0.016)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginTop: '5px',
                }}
              >
                年龄: {formValues?.age}
              </Typography.Text>
            </Flex>
          </Flex>

          <Divider />
          <Descriptions
            title="基本信息"
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
            size="middle"
            bordered
            extra={
              <Button type="primary" onClick={() => setOpen(true)}>
                编辑
              </Button>
            }
          >
            <Descriptions.Item label="姓名">{formValues?.nickname}</Descriptions.Item>
            <Descriptions.Item label="性别">{gender.sex}</Descriptions.Item>
            <Descriptions.Item label="年龄">{formValues?.age}</Descriptions.Item>
            <Descriptions.Item label="电话">{formValues?.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>
              {formValues?.email}
            </Descriptions.Item>
            <Descriptions.Item label="住址" span={2}>
              {formValues?.address}
            </Descriptions.Item>
            <Descriptions.Item label="用户角色">{role}</Descriptions.Item>
            <Descriptions.Item label="用户状态">{status}</Descriptions.Item>
            <Descriptions.Item label="注册时间" span={2}>
              {moment(formValues?.createTime).format(dateFormat)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      <Modal
        open={open}
        title="编辑个人信息"
        okText="保存"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="horizontal"
            form={form}
            name="form_in_modal"
            initialValues={{
                nickname: formValues?.nickname,
                gender: formValues?.gender === 0 ? 1 : formValues?.gender,
                age: formValues?.age,
                address: formValues?.address,
                phone: formValues?.phone,
                email: formValues?.email,
                userRole: formValues?.userRole,
                userStatus: formValues?.userStatus,
                createTime: moment(formValues?.createTime).format(dateFormat),
              }}
            clearOnDestroy
            onFinish={(values) => onSave(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item name="nickname" label="姓名" rules={[{ message: '请输入姓名' }]}>
          <Input maxLength={50}  />
        </Form.Item>
        <Form.Item name="gender" label="性别" className="collection-create-form_last-form-item">
        <Radio.Group
          options={[
            { value: 1, label: '男' },
            { value: 2, label: '女' },
          ]}
        />
        </Form.Item>
        <Form.Item name="age" label="年龄" rules={[{ message: '请输入年龄' }]} validateTrigger="onInput">
          {/* <InputNumber min={1} max={100} defaultValue={formValues?.age} changeOnWheel /> */}
          <Input maxLength={50}  />
        </Form.Item>
        <Form.Item name="address" label="住址" rules={[{ message: '请输入住址' }]}>
          <Input maxLength={50}  />
        </Form.Item>
        <Form.Item name="phone" label="电话" rules={[{ message: '请输入电话' }]}>
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ message: '请输入邮箱' }]}>
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          name="userRole"
          label="用户角色"
          className="collection-create-form_last-form-item"
        >
          <Select
            style={{ width: 120 }}
            disabled
            options={[
              { value: 0, label: '普通用户' },
              { value: 1, label: '管理员' },
            ]}
          />
        </Form.Item>
        <Form.Item name="userStatus" label="用户状态" className="collection-create-form_last-form-item">
          <Select
            style={{ width: 120 }}
            disabled
            options={[
              { value: 0, label: '正常' },
              { value: 1, label: '封号' },]}
          />
        </Form.Item>
        <Form.Item name="CreateTime" label="注册时间" rules={[{ message: '请输入注册时间' }]}>
          <Input disabled />
        </Form.Item>
      </Modal>
    </>
  );
};
export default UserInfo;
