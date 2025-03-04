import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Alert from '../ui/Alert';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
    const { username, email, password, confirmPassword } = formData;
    
    // 验证用户名
    if (!username) {
      errors.username = '请输入用户名';
    } else if (username.length < 2) {
      errors.username = '用户名至少需要2个字符';
    } else if (username.length > 50) {
      errors.username = '用户名不能超过50个字符';
    }
    
    // 验证电子邮件
    if (!email) {
      errors.email = '请输入邮箱';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!password) {
      errors.password = '请输入密码';
    } else if (password.length < 6) {
      errors.password = '密码至少需要6个字符';
    }
    
    // 验证确认密码
    if (!confirmPassword) {
      errors.confirmPassword = '请确认密码';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = '两次输入的密码不匹配';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!validateForm()) return;
    
    // 提取需要的注册数据
    const { username, email, password } = formData;
    
    // 尝试注册
    const success = await register({ username, email, password });
    
    if (success) {
      // 成功注册后，重定向到登录页面并显示成功消息
      navigate('/login?success=' + encodeURIComponent('注册成功！请登录您的账户'));
    }
  };
  
  const closeAlert = () => {
    setAlertInfo({ show: false, type: '', message: '' });
  };
  
  return (
    <PageContainer>
      <ImageContainer>
        <h2>加入知识产权资讯社区</h2>
        <p>了解最新行业动态，获取专业解析和案例分析</p>
      </ImageContainer>
      
      <FormContainer>
        <FormHeader>
          <FormTitle>注册</FormTitle>
          <FormSubtitle>创建您的知识产权资讯账户</FormSubtitle>
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
            <FormLabel htmlFor="username">用户名</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <StyledInput
                type="text"
                id="username"
                name="username"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleChange}
                error={formErrors.username}
              />
            </InputWrapper>
            {formErrors.username && <ErrorMessage>{formErrors.username}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email">邮箱</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
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
          
          <FormGroup>
            <FormLabel htmlFor="confirmPassword">确认密码</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
              />
            </InputWrapper>
            {formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
          </FormGroup>
          
          <TermsAgreement>
            <Checkbox
              type="checkbox"
              id="terms"
              required
            />
            <CheckboxLabel htmlFor="terms">
              我已阅读并同意 <TermsLink to="/page/terms">服务条款</TermsLink> 和 <TermsLink to="/page/privacy">隐私政策</TermsLink>
            </CheckboxLabel>
          </TermsAgreement>
          
          <SubmitButton type="submit">
            <FaUserPlus />
            注册
          </SubmitButton>
        </StyledForm>
        
        <FormFooter>
          <FormFooterText>
            已有账户？ <LoginLink to="/login">立即登录</LoginLink>
          </FormFooterText>
        </FormFooter>
      </FormContainer>
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

const ImageContainer = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: var(--spacing-xl);
  text-align: center;
  background-image: url('/images/register-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  order: -1;
  
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

const TermsAgreement = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const Checkbox = styled.input`
  margin-right: var(--spacing-xs);
  margin-top: 5px;
`;

const CheckboxLabel = styled.label`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
`;

const TermsLink = styled(Link)`
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

const LoginLink = styled(Link)`
  color: var(--primary-color);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default RegisterPage;