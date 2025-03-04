import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { newsApi } from '../../services/api';
import NewsCard from '../news/NewsCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const NewsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });
  const [activeFilters, setActiveFilters] = useState({
    category: categoryParam,
    tag: tagParam
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // 分类列表
  const categories = [
    '专利法规',
    '商标法规',
    '著作权法规',
    '知识产权保护',
    '专利申请',
    '专利案例',
    '知识产权动态',
    '国际知识产权'
  ];
  
  // 标签列表
  const tags = [
    '专利法',
    '商标法',
    '著作权法',
    '知识产权保护',
    '人工智能',
    'NFT',
    '中美关系',
    '专利开放许可',
    '司法案例',
    '5G通信'
  ];
  
  // 获取新闻列表
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // 模拟API调用 - 实际项目中应使用真实API
        setTimeout(() => {
          setNews([
            {
              _id: '1',
              title: '中国专利法修订案2021年正式实施',
              summary: '中国专利法修订案将于2021年6月1日正式实施，此次修订加强了专利保护力度，延长了外观设计专利保护期限。',
              category: '专利法规',
              tags: ['专利法', '法律修订'],
              coverImage: 'patent-law.jpg',
              publishDate: new Date('2021-05-15'),
              views: 1245,
              likes: 86,
              comments: []
            },
            {
              _id: '2',
              title: '华为最新5G通信专利申请引领全球创新',
              summary: '华为公司在5G通信领域再创佳绩，最新专利申请数量位居全球第一，展示了中国企业在高科技领域的创新实力。',
              category: '专利申请',
              tags: ['华为', '5G通信', '专利申请'],
              coverImage: 'huawei-5g.jpg',
              publishDate: new Date('2022-07-20'),
              views: 980,
              likes: 62,
              comments: []
            },
            {
              _id: '3',
              title: '人工智能生成内容的著作权争议与最新司法解释',
              summary: '随着人工智能技术的快速发展，AI生成内容的著作权归属问题引发广泛讨论，多国司法机构开始出台相关解释和规定。',
              category: '著作权法规',
              tags: ['人工智能', 'AI创作', '著作权'],
              coverImage: 'ai-copyright.jpg',
              publishDate: new Date('2023-09-05'),
              views: 753,
              likes: 41,
              comments: []
            }
          ]);
          
          setPagination({
            ...pagination,
            total: 30,
            pages: 10
          });
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('获取新闻列表出错:', err);
        setError('获取新闻列表时发生错误');
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [pagination.page, pagination.limit, activeFilters]);
  
  // 处理分页
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({
        ...pagination,
        page: newPage
      });
      
      // 滚动到页面顶部
      window.scrollTo(0, 0);
    }
  };
  
  // 处理筛选
  const handleFilterChange = (type, value) => {
    // 如果点击的是已激活的筛选，则清除该筛选
    if (activeFilters[type] === value) {
      setActiveFilters({
        ...activeFilters,
        [type]: ''
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        [type]: value
      });
    }
    
    // 重置分页
    setPagination({
      ...pagination,
      page: 1
    });
  };
  
  // 清除所有筛选
  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      tag: ''
    });
    
    // 重置分页
    setPagination({
      ...pagination,
      page: 1
    });
  };
  
  // 构建页面标题
  const getPageTitle = () => {
    if (activeFilters.category) {
      return `${activeFilters.category}相关资讯`;
    } else if (activeFilters.tag) {
      return `"${activeFilters.tag}"相关资讯`;
    } else {
      return '知识产权资讯';
    }
  };
  
  return (
    <PageContainer className="container">
      <PageHeader>
        <PageTitle>{getPageTitle()}</PageTitle>
        <FilterToggle onClick={() => setShowFilters(!showFilters)}>
          <FaFilter />
          <span>{showFilters ? '隐藏筛选' : '显示筛选'}</span>
        </FilterToggle>
      </PageHeader>
      
      <FiltersSection className={showFilters ? 'active' : ''}>
        <FilterGroup>
          <FilterGroupTitle>按分类筛选</FilterGroupTitle>
          <FilterList>
            {categories.map(category => (
              <FilterItem 
                key={category}
                active={activeFilters.category === category}
                onClick={() => handleFilterChange('category', category)}
              >
                {category}
              </FilterItem>
            ))}
          </FilterList>
        </FilterGroup>
        
        <FilterGroup>
          <FilterGroupTitle>按标签筛选</FilterGroupTitle>
          <FilterList>
            {tags.map(tag => (
              <FilterItem 
                key={tag}
                active={activeFilters.tag === tag}
                onClick={() => handleFilterChange('tag', tag)}
              >
                {tag}
              </FilterItem>
            ))}
          </FilterList>
        </FilterGroup>
        
        {(activeFilters.category || activeFilters.tag) && (
          <ActiveFiltersSection>
            <ActiveFiltersTitle>当前筛选</ActiveFiltersTitle>
            <ActiveFiltersList>
              {activeFilters.category && (
                <ActiveFilterItem>
                  分类: {activeFilters.category}
                  <RemoveFilterButton onClick={() => handleFilterChange('category', activeFilters.category)}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterItem>
              )}
              {activeFilters.tag && (
                <ActiveFilterItem>
                  标签: {activeFilters.tag}
                  <RemoveFilterButton onClick={() => handleFilterChange('tag', activeFilters.tag)}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterItem>
              )}
              <ClearAllButton onClick={clearAllFilters}>
                清除全部
              </ClearAllButton>
            </ActiveFiltersList>
          </ActiveFiltersSection>
        )}
      </FiltersSection>
      
      <MainContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : news.length === 0 ? (
          <NoResults>
            <NoResultsTitle>暂无相关资讯</NoResultsTitle>
            <NoResultsText>
              当前筛选条件下未找到任何资讯，请尝试其他筛选条件。
            </NoResultsText>
            <BackButton onClick={clearAllFilters}>清除筛选</BackButton>
          </NoResults>
        ) : (
          <>
            <NewsGrid>
              {news.map(item => (
                <NewsCard key={item._id} news={item} />
              ))}
            </NewsGrid>
            
            <Pagination>
              <PaginationInfo>
                共 {pagination.total} 条资讯，当前第 {pagination.page}/{pagination.pages} 页
              </PaginationInfo>
              <PaginationControls>
                <PaginationButton 
                  onClick={() => handlePageChange(1)} 
                  disabled={pagination.page === 1}
                >
                  首页
                </PaginationButton>
                <PaginationButton 
                  onClick={() => handlePageChange(pagination.page - 1)} 
                  disabled={pagination.page === 1}
                >
                  上一页
                </PaginationButton>
                {/* 显示页码 */}
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  
                  // 根据当前页码计算显示的页码范围
                  if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  // 确保页码在有效范围内
                  if (pageNum >= 1 && pageNum <= pagination.pages) {
                    return (
                      <PageNumber 
                        key={pageNum} 
                        active={pageNum === pagination.page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PageNumber>
                    );
                  }
                  
                  return null;
                })}
                <PaginationButton 
                  onClick={() => handlePageChange(pagination.page + 1)} 
                  disabled={pagination.page === pagination.pages}
                >
                  下一页
                </PaginationButton>
                <PaginationButton 
                  onClick={() => handlePageChange(pagination.pages)} 
                  disabled={pagination.page === pagination.pages}
                >
                  末页
                </PaginationButton>
              </PaginationControls>
            </Pagination>
          </>
        )}
      </MainContent>
    </PageContainer>
  );
};

// 样式组件
const PageContainer = styled.div`
  padding: var(--spacing-xl) var(--container-padding);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-primary);
  }
`;

const FiltersSection = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--box-shadow);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height var(--transition-normal), opacity var(--transition-normal), padding var(--transition-normal);
  
  &.active {
    max-height: 1000px;
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const FilterGroup = styled.div`
  margin-bottom: var(--spacing-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroupTitle = styled.h3`
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const FilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
`;

const FilterItem = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-primary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--bg-primary)'};
    border-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--primary-color)'};
    color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  }
`;

const ActiveFiltersSection = styled.div`
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
`;

const ActiveFiltersTitle = styled.h3`
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
`;

const ActiveFilterItem = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--primary-light);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: white;
  margin-left: var(--spacing-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ClearAllButton = styled.button`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
  }
`;

const MainContent = styled.div`
  min-height: 400px;
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

const Pagination = styled.div`
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const PaginationInfo = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
`;

const PaginationControls = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  justify-content: center;
`;

const PaginationButton = styled.button`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--primary-light)'};
    border-color: var(--primary-color);
    color: white;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--accent-color);
  font-size: var(--font-size-lg);
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--spacing-xxl) 0;
`;

const NoResultsTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const NoResultsText = styled.p`
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
  }
`;

export default NewsPage;