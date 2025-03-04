import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { newsApi } from '../../services/api';
import NewsCard from './NewsCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const CategorySection = ({ title, category, backgroundColor }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const response = await newsApi.getNews(1, 3, category);
        
        if (response.success) {
          setNews(response.data);
        } else {
          setError('获取分类新闻失败');
        }
      } catch (err) {
        console.error(`获取${category}分类新闻出错:`, err);
        setError('获取分类新闻时发生错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryNews();
  }, [category]);
  
  if (loading) {
    return (
      <SectionContainer style={{ backgroundColor }}>
        <div className="container">
          <SectionHeader>
            <SectionTitle>{title}</SectionTitle>
          </SectionHeader>
          <LoadingSpinner size="small" />
        </div>
      </SectionContainer>
    );
  }
  
  if (error || news.length === 0) {
    return null; // 如果有错误或没有数据，不显示该区域
  }
  
  return (
    <SectionContainer style={{ backgroundColor }}>
      <div className="container">
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          <ViewAllLink to={`/news?category=${encodeURIComponent(category)}`}>
            查看更多
          </ViewAllLink>
        </SectionHeader>
        
        <NewsGrid>
          {news.map(item => (
            <NewsCard key={item._id} news={item} />
          ))}
        </NewsGrid>
      </div>
    </SectionContainer>
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
  color: var(--text-primary);
  font-size: var(--font-size-xl);
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

export default CategorySection;