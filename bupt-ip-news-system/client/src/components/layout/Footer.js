import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeixin, FaWeibo } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterSection>
          <FooterLogo>
            <span className="logo-text">BUPT</span>
            <span className="logo-subtext">知识产权资讯</span>
          </FooterLogo>
          <FooterDescription>
            北京邮电大学知识产权信息服务中心致力于提供专业、全面的知识产权信息与资讯，为创新者提供有价值的知识产权保护与应用指导。
          </FooterDescription>
          <SocialLinks>
            <SocialLink href="#" title="微信">
              <FaWeixin />
            </SocialLink>
            <SocialLink href="#" title="微博">
              <FaWeibo />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>快速链接</FooterTitle>
          <FooterLinks>
            <FooterLink to="/">首页</FooterLink>
            <FooterLink to="/news?category=专利法规">专利法规</FooterLink>
            <FooterLink to="/news?category=商标法规">商标法规</FooterLink>
            <FooterLink to="/news?category=著作权法规">著作权法规</FooterLink>
            <FooterLink to="/news?category=知识产权保护">知识产权保护</FooterLink>
            <FooterLink to="/news?category=国际知识产权">国际动态</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>服务指南</FooterTitle>
          <FooterLinks>
            <FooterLink to="/page/about">关于我们</FooterLink>
            <FooterLink to="/page/services">服务内容</FooterLink>
            <FooterLink to="/page/privacy">隐私政策</FooterLink>
            <FooterLink to="/page/terms">使用条款</FooterLink>
            <FooterLink to="/page/faq">常见问题</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>联系我们</FooterTitle>
          <ContactInfo>
            <ContactItem>
              <ContactIcon><FaMapMarkerAlt /></ContactIcon>
              <span>北京市海淀区西土城路10号</span>
            </ContactItem>
            <ContactItem>
              <ContactIcon><FaPhone /></ContactIcon>
              <span>010-12345678</span>
            </ContactItem>
            <ContactItem>
              <ContactIcon><FaEnvelope /></ContactIcon>
              <span>ipinfo@bupt.edu.cn</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>
      </FooterWrapper>
      
      <FooterBottom>
        <Copyright>
          © {currentYear} 北京邮电大学知识产权信息服务中心. 保留所有权利.
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

// 样式组件
const FooterContainer = styled.footer`
  background-color: var(--bg-dark);
  color: var(--text-white);
  padding-top: var(--spacing-xl);
`;

const FooterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const FooterLogo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
  
  .logo-text {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--text-white);
    letter-spacing: 1px;
  }
  
  .logo-subtext {
    font-size: var(--font-size-xs);
    color: var(--text-light);
    letter-spacing: 3px;
  }
`;

const FooterDescription = styled.p`
  color: var(--text-light);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-white);
  font-size: var(--font-size-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h3`
  color: var(--text-white);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
  position: relative;
  padding-bottom: var(--spacing-sm);
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--primary-color);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLink = styled(Link)`
  color: var(--text-light);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary-light);
    padding-left: var(--spacing-xs);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  color: var(--text-light);
`;

const ContactIcon = styled.span`
  margin-right: var(--spacing-sm);
  color: var(--primary-light);
`;

const FooterBottom = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  padding: var(--spacing-md) 0;
  text-align: center;
  margin-top: var(--spacing-lg);
`;

const Copyright = styled.p`
  color: var(--text-light);
  font-size: var(--font-size-sm);
`;

export default Footer;