import { Footer } from '@/components';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import {message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import Settings from '../../../../config/defaultSettings';
import { register } from '@/services/ant-design-pro/api';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Register: React.FC = () => {
  const { styles } = useStyles();
  
  const handleSubmit = async (values: API.RegisterParams) => {
    if (values.password !== values.checkPassword) {
      message.error('两次密码输入不一致！请重试');
      return;
    }
    try {
      // 注册
      const id = await register({
        ...values,
      });
      if (id > 0) {
        const defaultRegisterSuccessMessage = '注册成功！';
        message.success(defaultRegisterSuccessMessage);

        // 此方法会跳转到 redirect 参数所在的位置
        // 注册成功后跳转到登录页
        if (!history) return;
        const query = new URLSearchParams(history.location.search);
        history.push({pathname: '/user/login', search: query.toString()});
        return;
      } else {
        throw new Error(`register failed, id: ${id}`);
      }
    } catch (error) {
      const defaultRegisterFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="智能仓储系统"
          subTitle={'无人仓储，AGV智能搬运'}
          initialValues={{
            autoLogin: true,
          }}
    
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            centered
            items={[
              {
                key: 'username',
                label: '账户密码注册',
              },
            ]}
          />

          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'请输入用户名'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
                {
                  min: 6,
                  message: '用户名至少6位',
                }
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
                {
                  min: 8,
                  message: '密码至少8位',
                }
              ]}
            />
            <ProFormText.Password
              name="checkPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'请再次输入密码'}
              rules={[
                {
                  required: true,
                  message: '确认密码是必填项！',
                },
                {
                  min: 8,
                  message: '密码至少8位',
                }
              ]}
            />
          </>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
