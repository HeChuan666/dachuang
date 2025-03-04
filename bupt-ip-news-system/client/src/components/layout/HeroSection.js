import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const HeroSection = () => {
  return (
    <HeroContainer>
      <HeroOverlay />
      <HeroContent className="container">
        <HeroHeading>
          <span className="highlight">知识产权</span>资讯平台
        </HeroHeading>
        <HeroSubheading>
          关注最新知识产权法规、案例及动态，助力创新保护
        </HeroSubheading>
        <HeroActions>
          <PrimaryButton as={Link} to="/news">浏览资讯</PrimaryButton>
          <SecondaryButton as={Link} to="/page/services">了解服务</SecondaryButton>
        </HeroActions>
      </HeroContent>
      
      <HeroStats>
        <div className="container">
          <StatsGrid>
            <StatItem>
              <StatValue>1000+</StatValue>
              <StatLabel>知识产权案例</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>200+</StatValue>
              <StatLabel>法规解读</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>50+</StatValue>
              <StatLabel>专家团队</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>24h</StatValue>
              <StatLabel>实时更新</StatLabel>
            </StatItem>
          </StatsGrid>
        </div>
      </HeroStats>
      
      <PatternOverlay />
    </HeroContainer>
  );
};

// 动画
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const moveBackground = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// 样式组件
const HeroContainer = styled.section`
  position: relative;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-dark);
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%);
  z-index: 1;
`;

const PatternOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  padding: var(--spacing-xxl) var(--container-padding);
  animation: ${fadeIn} 1.2s ease-out;
`;

const HeroHeading = styled.h1`
  color: white;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  letter-spacing: 1px;
  
  .highlight {
    background: linear-gradient(90deg, var(--primary-light) 0%, var(--accent-light) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: ${moveBackground} 5s ease infinite;
    background-size: 200% 200%;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubheading = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-lg);
  max-width: 700px;
  margin: 0 auto var(--spacing-xl);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
`;

const HeroActions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const ButtonBase = styled(Link)`
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-xl);
  font-size: var(--font-size-md);
  font-weight: 500;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: var(--primary-color);
  color: white;
  border: 2px solid var(--primary-color);
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    color: white;
  }
`;

const HeroStats = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: var(--spacing-md) 0;
  position: relative;
  z-index: 3;
  margin-top: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--primary-light);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.9;
`;

export default HeroSection;