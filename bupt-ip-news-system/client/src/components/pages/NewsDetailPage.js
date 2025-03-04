import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaUser, FaCalendarAlt, FaEye, FaThumbsUp, FaRegThumbsUp, FaBookmark, FaRegBookmark, FaShare } from 'react-icons/fa';
import { newsApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import Alert from '../ui/Alert';
import RelatedNews from '../news/RelatedNews';
import CommentSection from '../news/CommentSection';

const NewsDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  
  // 获取新闻详情
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await newsApi.getNewsById(id);
        
        if (response.success) {
          setNews(response.data);
          
          // 检查当前用户是否已收藏该新闻
          if (isAuthenticated && user?.favoriteNews) {
            setFavorited(user.favoriteNews.includes(id));
          }
        } else {
          setError('获取新闻详情失败');
        }
      } catch (err) {
        console.error('获取新闻详情出错:', err);
        setError('获取新闻详情时发生错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsDetail();
  }, [id, isAuthenticated, user]);
  
  // 处理点赞
  const handleLike = async () => {
    if (!isAuthenticated) {
      setAlertInfo({
        show: true,
        type: 'warning',
        message: '请先登录后再点赞'
      });
      return;
    }
    
    try {
      const response = await newsApi.likeNews(id);
      
      if (response.success) {
        setNews(prev => ({
          ...prev,
          likes: response.likes
        }));
        setLiked(true);
        
        setAlertInfo({
          show: true,
          type: 'success',
          message: '点赞成功！'
        });
      }
    } catch (err) {
      console.error('点赞失败:', err);
      setAlertInfo({
        show: true,
        type: 'error',
        message: '点赞失败，请稍后再试'
      });
    }
  };
  
  // 处理收藏
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setAlertInfo({
        show: true,
        type: 'warning',
        message: '请先登录后再收藏'
      });
      return;
    }
    
    try {
      const response = await newsApi.favoriteNews(id);
      
      if (response.success) {
        setFavorited(response.isFavorite);
        
        setAlertInfo({
          show: true,
          type: 'success',
          message: response.isFavorite ? '收藏成功！' : '已取消收藏'
        });
      }
    } catch (err) {
      console.error('收藏/取消收藏失败:', err);
      setAlertInfo({
        show: true,
        type: 'error',
        message: '操作失败，请稍后再试'
      });
    }
  };
  
  // 处理分享
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: window.location.href
      })
        .then(() => console.log('成功分享'))
        .catch(error => console.log('分享失败', error));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setAlertInfo({
            show: true,
            type: 'success',
            message: '链接已复制到剪贴板'
          });
        })
        .catch(() => {
          setAlertInfo({
            show: true,
            type: 'error',
            message: '复制链接失败'
          });
        });
    }
  };
  
  const closeAlert = () => {
    setAlertInfo({ show: false, type: '', message: '' });
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !news) {
    return (
      <ErrorContainer className="container">
        <ErrorMessage>
          {error || '未找到该新闻'}
        </ErrorMessage>
        <BackButton as={Link} to="/news">返回新闻列表</BackButton>
      </ErrorContainer>
    );
  }
  
  const { 
    title, 
    content, 
    category, 
    tags, 
    author, 
    publishDate, 
    views, 
    likes, 
    comments,
    coverImage
  } = news;
  
  // 格式化日期
  const formattedDate = format(new Date(publishDate), 'yyyy-MM-dd');
  
  // 默认封面图地址
  const coverImageUrl = coverImage?.startsWith('http') 
    ? coverImage 
    : `/images/covers/${coverImage}`;
  
  return (
    <PageContainer>
      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          message={alertInfo.message} 
          onClose={closeAlert}
        />
      )}
      
      <NewsHeader style={{ backgroundImage: `url(${coverImageUrl})` }}>
        <HeaderOverlay>
          <div className="container">
            <BreadcrumbNav>
              <BreadcrumbItem as={Link} to="/">首页</BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem as={Link} to={`/news?category=${encodeURIComponent(category)}`}>
                {category}
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>正文</BreadcrumbItem>
            </BreadcrumbNav>
            
            <NewsTitle>{title}</NewsTitle>
            
            <NewsMeta>
              <MetaItem>
                <FaUser />
                <span>{author.nickname || author.username}</span>
              </MetaItem>
              <MetaItem>
                <FaCalendarAlt />
                <span>{formattedDate}</span>
              </MetaItem>
              <MetaItem>
                <FaEye />
                <span>{views} 阅读</span>
              </MetaItem>
            </NewsMeta>
          </div>
        </HeaderOverlay>
      </NewsHeader>
      
      <NewsContainer className="container">
        <MainContent>
          <NewsContent dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(content) }} />
          
          <TagsContainer>
            {tags.map((tag, index) => (
              <TagItem key={index} as={Link} to={`/news?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </TagItem>
            ))}
          </TagsContainer>
          
          <ActionBar>
            <ActionButton onClick={handleLike} active={liked}>
              {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
              <span>点赞 {likes}</span>
            </ActionButton>
            
            <ActionButton onClick={handleFavorite} active={favorited}>
              {favorited ? <FaBookmark /> : <FaRegBookmark />}
              <span>{favorited ? '已收藏' : '收藏'}</span>
            </ActionButton>
            
            <ActionButton onClick={handleShare}>
              <FaShare />
              <span>分享</span>
            </ActionButton>
          </ActionBar>
          
          <Divider />
          
          <CommentSection newsId={id} comments={comments} />
        </MainContent>
        
        <Sidebar>
          <AuthorCard>
            <AuthorAvatar src={author.avatar || '/images/default-avatar.png'} alt={author.nickname || author.username} />
            <AuthorName>{author.nickname || author.username}</AuthorName>
            <AuthorBio>知识产权资讯编辑</AuthorBio>
          </AuthorCard>
          
          <RelatedNews category={category} currentNewsId={id} />
        </Sidebar>
      </NewsContainer>
    </PageContainer>
  );
};

// 将Markdown格式转换为HTML格式
// 这里使用一个简单的实现，实际项目中可能需要使用如marked.js等库
const formatMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // 替换标题
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  
  // 替换粗体和斜体
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
  
  // 替换链接
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // 替换列表
  html = html
    .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/^\+ (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/^\d+\. (.*$)/gm, '<ol><li>$1</li></ol>');
  
  // 修复列表标签
  html = html
    .replace(/<\/ul><ul>/g, '')
    .replace(/<\/ol><ol>/g, '');
  
  // 替换分隔线
  html = html.replace(/^\-\-\-$/gm, '<hr>');
  
  // 替换段落
  html = html.replace(/^([^<].*?)$/gm, '<p>$1</p>');
  
  // 替换换行符
  html = html.replace(/\n$/gm, '');
  
  return html;
};

// 样式组件
const PageContainer = styled.div`
  min-height: 100vh;
`;

const NewsHeader = styled.div`
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: var(--spacing-xl);
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  color: white;
`;

const BreadcrumbItem = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  
  &:last-child {
    color: white;
  }
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 var(--spacing-xs);
  color: rgba(255, 255, 255, 0.6);
`;

const NewsTitle = styled.h1`
  color: white;
  font-size: var(--font-size-xxxl);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xxl);
  }
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: rgba(255, 255, 255, 0.8);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  
  svg {
    margin-right: var(--spacing-xs);
  }
`;

const NewsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
  
  @media (min-width: 992px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const MainContent = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-xl);
`;

const NewsContent = styled.div`
  line-height: 1.8;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
  
  h1 {
    font-size: var(--font-size-xxl);
  }
  
  h2 {
    font-size: var(--font-size-xl);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
  }
  
  h3 {
    font-size: var(--font-size-lg);
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  ul, ol {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-xl);
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: var(--spacing-md);
    margin-left: 0;
    margin-right: 0;
    color: var(--text-secondary);
    font-style: italic;
  }
  
  img {
    max-width: 100%;
    border-radius: var(--border-radius-md);
    margin: var(--spacing-md) 0;
  }
  
  code {
    background-color: var(--bg-primary);
    padding: 2px 4px;
    border-radius: var(--border-radius-sm);
    font-family: monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: var(--bg-primary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    overflow-x: auto;
    margin: var(--spacing-md) 0;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin: var(--spacing-xl) 0;
`;

const TagItem = styled.span`
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-light);
    color: white;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-primary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--primary-light)'};
    color: white;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-color);
  margin: var(--spacing-lg) 0;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const AuthorCard = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-lg);
  text-align: center;
`;

const AuthorAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--spacing-sm);
`;

const AuthorName = styled.h3`
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
`;

const AuthorBio = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: 0;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: var(--spacing-xxl) 0;
`;

const ErrorMessage = styled.div`
  font-size: var(--font-size-xl);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

const BackButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

export default NewsDetailPage;