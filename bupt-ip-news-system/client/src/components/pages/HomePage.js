import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { newsApi } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import NewsCard from '../news/NewsCard';
import HeroSection from '../layout/HeroSection';
import FeaturedNews from '../news/FeaturedNews';
import CategorySection from '../news/CategorySection';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // 获取最新新闻
        const response = await newsApi.getNews(1, 12);
        
        if (response.success) {
          setLatestNews(response.data);
          
          // 选择一篇作为特色新闻
          if (response.data.length > 0) {
            // 通常选择访问量最高的作为特色新闻
            const featured = [...response.data].sort((a, b) => b.views - a.views)[0];
            setFeaturedNews(featured);
          }
        } else {
          setError('获取新闻失败');
        }
      } catch (err) {
        console.error('获取新闻出错:', err);
        setError('获取新闻时发生错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  return (
    <>
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 特色新闻 */}
      {featuredNews && (
        <SectionContainer className="container">
          <SectionTitle>特色内容</SectionTitle>
          <FeaturedNews news={featuredNews} />
        </SectionContainer>
      )}
      
      {/* 最新资讯 */}
      <SectionContainer className="container">
        <SectionHeader>
          <SectionTitle>最新资讯</SectionTitle>
          <ViewAllLink to="/news">查看全部</ViewAllLink>
        </SectionHeader>
        
        <NewsGrid>
          {latestNews.slice(0, 6).map(news => (
            <NewsCard key={news._id} news={news} />
          ))}
        </NewsGrid>
      </SectionContainer>
      
      {/* 分类专区 */}
      <CategorySection 
        title="专利法规与案例" 
        category="专利法规" 
        backgroundColor="var(--bg-primary)"
      />
      
      <CategorySection 
        title="知识产权保护" 
        category="知识产权保护" 
        backgroundColor="var(--bg-secondary)"
      />
      
      <CategorySection 
        title="国际知识产权动态" 
        category="国际知识产权" 
        backgroundColor="var(--bg-primary)"
      />
      
      {/* 快速访问区 */}
      <QuickAccessSection>
        <div className="container">
          <SectionTitle light>快速访问</SectionTitle>
          <QuickAccessGrid>
            <QuickAccessCard to="/news?category=专利申请">
              <QuickAccessIcon>📝</QuickAccessIcon>
              <QuickAccessTitle>专利申请</QuickAccessTitle>
              <QuickAccessDesc>了解专利申请流程与策略</QuickAccessDesc>
            </QuickAccessCard>
            
            <QuickAccessCard to="/news?category=商标法规">
              <QuickAccessIcon>🔖</QuickAccessIcon>
              <QuickAccessTitle>商标法规</QuickAccessTitle>
              <QuickAccessDesc>商标注册与保护最新政策</QuickAccessDesc>
            </QuickAccessCard>
            
            <QuickAccessCard to="/news?category=著作权法规">
              <QuickAccessIcon>📚</QuickAccessIcon>
              <QuickAccessTitle>著作权法规</QuickAccessTitle>
              <QuickAccessDesc>著作权法律法规与案例</QuickAccessDesc>
            </QuickAccessCard>
            
            <QuickAccessCard to="/news?tag=AI创作">
              <QuickAccessIcon>🤖</QuickAccessIcon>
              <QuickAccessTitle>AI与知识产权</QuickAccessTitle>
              <QuickAccessDesc>人工智能创作的知识产权议题</QuickAccessDesc>
            </QuickAccessCard>
          </QuickAccessGrid>
        </div>
      </QuickAccessSection>
    </>
  );
};

// 样式组件
const SectionContainer = styled.section`
  padding: var(--spacing-xl) 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h2`
  color: ${props => props.light ? 'var(--text-white)' : 'var(--text-primary)'};
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--primary-color);
  }
`;

const ViewAllLink = styled(Link)`
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  
  &:after {
    content: '→';
    margin-left: var(--spacing-xs);
    transition: transform var(--transition-fast);
  }
  
  &:hover:after {
    transform: translateX(5px);
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-lg);
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--accent-color);
  font-size: var(--font-size-lg);
`;

const QuickAccessSection = styled.section`
  background-color: var(--bg-dark);
  padding: var(--spacing-xl) 0;
  color: var(--text-white);
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-lg);
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const QuickAccessCard = styled(Link)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  color: var(--text-white);
  text-decoration: none;
  text-align: center;
  transition: all var(--transition-normal);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    color: var(--primary-light);
  }
`;

const QuickAccessIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
`;

const QuickAccessTitle = styled.h3`
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-lg);
`;

const QuickAccessDesc = styled.p`
  color: var(--text-light);
  font-size: var(--font-size-sm);
  margin-bottom: 0;
`;

export default HomePage;