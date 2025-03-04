import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaEye, FaThumbsUp, FaComment, FaArrowRight } from 'react-icons/fa';

const FeaturedNews = ({ news }) => {
  const {
    _id,
    title,
    summary,
    category,
    tags,
    coverImage,
    publishDate,
    views,
    likes,
    comments,
    author
  } = news;

  // 格式化日期
  const formattedDate = format(new Date(publishDate), 'yyyy-MM-dd');
  
  // 默认封面图地址
  const coverImageUrl = coverImage?.startsWith('http') 
    ? coverImage 
    : `/images/covers/${coverImage}`;
  
  return (
    <FeaturedContainer>
      <FeaturedImage>
        <img src={coverImageUrl} alt={title} />
        <FeaturedCategory>{category}</FeaturedCategory>
      </FeaturedImage>
      
      <FeaturedContent>
        <FeaturedMeta>
          <FeaturedDate>{formattedDate}</FeaturedDate>
          
          <FeaturedStats>
            <FeaturedStat title="浏览量">
              <FaEye /> <span>{views}</span>
            </FeaturedStat>
            <FeaturedStat title="点赞数">
              <FaThumbsUp /> <span>{likes}</span>
            </FeaturedStat>
            <FeaturedStat title="评论数">
              <FaComment /> <span>{comments?.length || 0}</span>
            </FeaturedStat>
          </FeaturedStats>
        </FeaturedMeta>
        
        <FeaturedTitle>{title}</FeaturedTitle>
        <FeaturedSummary>{summary}</FeaturedSummary>
        
        <FeaturedTags>
          {tags.slice(0, 5).map((tag, index) => (
            <FeaturedTag key={index}>{tag}</FeaturedTag>
          ))}
        </FeaturedTags>
        
        <FeaturedReadMore to={`/news/${_id}`}>
          阅读全文 <FaArrowRight />
        </FeaturedReadMore>
      </FeaturedContent>
    </FeaturedContainer>
  );
};

// 样式组件
const FeaturedContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FeaturedImage = styled.div`
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const FeaturedCategory = styled.div`
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
  z-index: 1;
`;

const FeaturedContent = styled.div`
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
`;

const FeaturedMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-light);
`;

const FeaturedDate = styled.span`
  white-space: nowrap;
`;

const FeaturedStats = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const FeaturedStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FeaturedTitle = styled.h2`
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
  color: var(--text-primary);
`;

const FeaturedSummary = styled.p`
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  flex-grow: 1;
`;

const FeaturedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
`;

const FeaturedTag = styled.span`
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  padding: 4px 10px;
  border-radius: var(--border-radius-sm);
`;

const FeaturedReadMore = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  font-weight: 500;
  font-size: var(--font-size-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  
  svg {
    margin-left: var(--spacing-xs);
    transition: transform var(--transition-fast);
  }
  
  &:hover {
    color: var(--primary-dark);
    
    svg {
      transform: translateX(5px);
    }
  }
`;

export default FeaturedNews;