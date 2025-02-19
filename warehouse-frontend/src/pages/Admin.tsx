import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
interface AdminProps {
  children: React.ReactNode;
}

const Admin: React.FC<AdminProps> = (props) => {
  const { children } = props;
  return (
    <PageContainer content={' 这个页面只有 admin 权限才能查看'}>
      {children}
    </PageContainer>
  );
};
export default Admin;
