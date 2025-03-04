import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaEye } from 'react-icons/fa';
import { newsApi } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

const RelatedNews = ({ category, currentNewsId }) => {
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRelatedNews = async () => {
      if (!category || !currentNewsId) return;
      
      try {
        setLoading(true);
        const response = await newsApi.getNews(1, 5, category);
        
        if (response.success) {
          // 过滤掉当前新闻
          const filteredNews = response.data.filter(news => news._id !== currentNewsId);
          setRelatedNews(filteredNews.slice(0, 4)); // 最多显示4篇相关新闻
        } else {
          setError('获取相关新闻失败');
        }
      } catch (err) {
        console.error('获取相关新闻出错:', err);
        setError('获取相关新闻时发生错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedNews();
  }, [category, currentNewsId]);
  
  if (loading) {
    return (
      <RelatedNewsContainer>
        <RelatedNewsTitle>相关阅读</RelatedNewsTitle>
        <LoadingSpinner size="small" />
      </RelatedNewsContainer>
    );
  }
  
  if (error || relatedNews.length === 0) {
    return null; // 如果有错误或没有相关新闻，不显示此区域
  }
  
  return (
    <RelatedNewsContainer>
      <RelatedNewsTitle>相关阅读</RelatedNewsTitle>
      <RelatedNewsList>
        {relatedNews.map(news => (
          <RelatedNewsItem key={news._id}>
            <RelatedNewsLink to={`/news/${news._id}`}>
              {news.coverImage && (
                <RelatedNewsImage 
                  src={news.coverImage.startsWith('http') ? news.coverImage : `/images/covers/${news.coverImage}`} 
                  alt={news.title} 
                />
              )}
              <RelatedNewsContent>
                <RelatedNewsItemTitle>{news.title}</RelatedNewsItemTitle>
                <RelatedNewsMeta>
                  <RelatedNewsDate>
                    {format(new Date(news.publishDate), 'yyyy-MM-dd')}
                  </RelatedNewsDate>
                  <RelatedNewsViews>
                    <FaEye /> {news.views}
                  </RelatedNewsViews>
                </RelatedNewsMeta>
              </RelatedNewsContent>
            </RelatedNewsLink>
          </RelatedNewsItem>
        ))}
      </RelatedNewsList>
      <ViewMoreLink to={`/news?category=${encodeURIComponent(category)}`}>
        查看更多 {category} 相关内容
      </ViewMoreLink>
    </RelatedNewsContainer>
  );
};

// 样式组件
const RelatedNewsContainer = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-lg);
`;

const RelatedNewsTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--primary-color);
  }
`;

const RelatedNewsList = styled.ul`
  list-style: none;
  margin: var(--spacing-lg) 0;
  padding: 0;
`;

const RelatedNewsItem = styled.li`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RelatedNewsLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateX(5px);
    color: var(--primary-color);
  }
`;

const RelatedNewsImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
  margin-right: var(--spacing-sm);
`;

const RelatedNewsContent = styled.div`
  flex: 1;
`;

const RelatedNewsItemTitle = styled.h4`
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-xs);
  line-height: 1.4;
  
  /* 标题最多显示两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RelatedNewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--text-light);
`;

const RelatedNewsDate = styled.span``;

const RelatedNewsViews = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ViewMoreLink = styled(Link)`
  display: inline-block;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default RelatedNews;