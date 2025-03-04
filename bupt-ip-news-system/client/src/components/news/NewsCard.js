import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaEye, FaThumbsUp, FaComment } from 'react-icons/fa';

const NewsCard = ({ news }) => {
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
    <CardContainer to={`/news/${_id}`}>
      <CardImageWrapper>
        <CardImage src={coverImageUrl} alt={title} />
        <CardCategory>{category}</CardCategory>
      </CardImageWrapper>
      
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardSummary>{summary}</CardSummary>
        
        <CardMeta>
          <CardDate>{formattedDate}</CardDate>
          
          <CardStats>
            <CardStat title="浏览量">
              <FaEye /> <span>{views}</span>
            </CardStat>
            <CardStat title="点赞数">
              <FaThumbsUp /> <span>{likes}</span>
            </CardStat>
            <CardStat title="评论数">
              <FaComment /> <span>{comments?.length || 0}</span>
            </CardStat>
          </CardStats>
        </CardMeta>
        
        <CardTags>
          {tags.slice(0, 3).map((tag, index) => (
            <CardTag key={index}>{tag}</CardTag>
          ))}
        </CardTags>
      </CardBody>
    </CardContainer>
  );
};

// 样式组件
const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  text-decoration: none;
  color: var(--text-primary);
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow-hover);
    color: var(--text-primary);
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const CardCategory = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--border-radius-sm);
  z-index: 1;
`;

const CardBody = styled.div`
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
  
  /* 标题最多显示两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardSummary = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
  
  /* 摘要最多显示三行 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-light);
`;

const CardDate = styled.span`
  white-space: nowrap;
`;

const CardStats = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const CardStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 12px;
  }
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
`;

const CardTag = styled.span`
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  white-space: nowrap;
`;

export default NewsCard;