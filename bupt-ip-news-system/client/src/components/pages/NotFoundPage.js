import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>页面未找到</ErrorTitle>
        <ErrorMessage>抱歉，您访问的页面不存在或已被移除。</ErrorMessage>
        <ButtonsContainer>
          <HomeButton as={Link} to="/">返回首页</HomeButton>
          <BackButton onClick={() => window.history.back()}>返回上一页</BackButton>
        </ButtonsContainer>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

// 样式组件
const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: var(--spacing-xl);
  background-color: var(--bg-primary);
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const NotFoundContent = styled.div`
  text-align: center;
  background-color: var(--bg-secondary);
  padding: var(--spacing-xxl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.div`
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: var(--primary-color);
    border-radius: 2px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-xl);
`;

const ErrorMessage = styled.p`
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ButtonBase = styled(Link)`
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  text-align: center;
`;

const HomeButton = styled(ButtonBase)`
  background-color: var(--primary-color);
  color: white;
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

const BackButton = styled(ButtonBase)`
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--bg-primary);
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;

export default NotFoundPage;