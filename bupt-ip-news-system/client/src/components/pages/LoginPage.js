import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Alert from '../ui/Alert';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从 URL 参数中获取成功消息（如有）
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successMsg = params.get('success');
    
    if (successMsg) {
      setAlertInfo({
        show: true,
        type: 'success',
        message: decodeURIComponent(successMsg)
      });
      
      // 5秒后自动关闭提示
      const timer = setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  // 如果用户已认证，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // 显示API错误
  useEffect(() => {
    if (error) {
      setAlertInfo({
        show: true,
        type: 'error',
        message: error
      });
      
      // 清除错误
      clearError();
    }
  }, [error, clearError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除该字段的错误
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const { email, password } = formData;
    
    // 验证电子邮件
    if (!email) {
      errors.email = '请输入邮箱';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!password) {
      errors.password = '请输入密码';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!validateForm()) return;
    
    // 尝试登录
    const success = await login(formData);
    
    if (success) {
      // 成功登录后，清除表单
      setFormData({ email: '', password: '' });
    }
  };
  
  const closeAlert = () => {
    setAlertInfo({ show: false, type: '', message: '' });
  };
  
  return (
    <PageContainer>
      <FormContainer>
        <FormHeader>
          <FormTitle>登录</FormTitle>
          <FormSubtitle>登录您的知识产权资讯账户</FormSubtitle>
        </FormHeader>
        
        {alertInfo.show && (
          <Alert 
            type={alertInfo.type} 
            message={alertInfo.message} 
            onClose={closeAlert}
          />
        )}
        
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">邮箱</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <StyledInput
                type="email"
                id="email"
                name="email"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
              />
            </InputWrapper>
            {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="password">密码</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
              />
              <ShowPasswordToggle 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '隐藏' : '显示'}
              </ShowPasswordToggle>
            </InputWrapper>
            {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
          </FormGroup>
          
          <FormOptions>
            <RememberMe>
              <Checkbox
                type="checkbox"
                id="remember"
              />
              <CheckboxLabel htmlFor="remember">记住我</CheckboxLabel>
            </RememberMe>
            
            <ForgotPassword to="/forgot-password">忘记密码？</ForgotPassword>
          </FormOptions>
          
          <SubmitButton type="submit">
            <FaSignInAlt />
            登录
          </SubmitButton>
        </StyledForm>
        
        <FormFooter>
          <FormFooterText>
            还没有账户？ <RegisterLink to="/register">立即注册</RegisterLink>
          </FormFooterText>
        </FormFooter>
      </FormContainer>
      
      <ImageContainer>
        <h2>探索知识产权的世界</h2>
        <p>获取最新资讯、专业解读及实用指南</p>
      </ImageContainer>
    </PageContainer>
  );
};

// 样式组件
const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: calc(100vh - 200px);
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormContainer = styled.div`
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const FormHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`;

const FormSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-md);
`;

const StyledForm = styled.form`
  margin-bottom: var(--spacing-lg);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-primary);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  color: var(--text-light);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid ${props => props.error ? 'var(--accent-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
  }
`;

const ShowPasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: var(--accent-color);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: var(--spacing-xs);
`;

const CheckboxLabel = styled.label`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
`;

const ForgotPassword = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const FormFooter = styled.div`
  text-align: center;
`;

const FormFooterText = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-md);
`;

const RegisterLink = styled(Link)`
  color: var(--primary-color);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: var(--spacing-xl);
  text-align: center;
  background-image: url('/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 102, 204, 0.8) 0%, rgba(0, 76, 153, 0.9) 100%);
  }
  
  h2, p {
    position: relative;
    z-index: 2;
  }
  
  h2 {
    font-size: var(--font-size-xxl);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    font-size: var(--font-size-lg);
    max-width: 400px;
  }
  
  @media (max-width: 991px) {
    display: none;
  }
`;

export default LoginPage;