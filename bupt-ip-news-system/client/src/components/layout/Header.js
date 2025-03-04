import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 关闭菜单当窗口变宽
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 切换菜单
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 切换搜索框
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LogoContainer>
          <Link to="/">
            <Logo>
              <span className="logo-text">BUPT</span>
              <span className="logo-subtext">知识产权资讯</span>
            </Logo>
          </Link>
          <MobileIcons>
            <SearchIcon onClick={toggleSearch}>
              <FaSearch />
            </SearchIcon>
            <MenuIcon onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </MenuIcon>
          </MobileIcons>
        </LogoContainer>

        <NavContainer className={isMenuOpen ? 'active' : ''}>
          <NavLinks>
            <NavItem>
              <NavLink to="/">首页</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/news?category=专利法规">专利法规</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/news?category=商标法规">商标法规</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/news?category=著作权法规">著作权法规</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/news?category=知识产权保护">知识产权保护</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/news?category=国际知识产权">国际动态</NavLink>
            </NavItem>
          </NavLinks>

          <SearchContainer className={isSearchOpen ? 'active' : ''}>
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchInput
                type="text"
                placeholder="搜索知识产权资讯..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                <FaSearch />
              </SearchButton>
            </SearchForm>
          </SearchContainer>

          <UserActions>
            {isAuthenticated ? (
              <>
                <UserMenu>
                  <UserMenuTrigger>
                    <FaUserCircle />
                    <span>{user?.nickname || user?.username}</span>
                  </UserMenuTrigger>
                  <UserMenuDropdown>
                    <UserMenuItem as={Link} to="/profile">个人中心</UserMenuItem>
                    {user?.role === 'admin' && (
                      <UserMenuItem as={Link} to="/admin">管理控制台</UserMenuItem>
                    )}
                    <UserMenuItem onClick={handleLogout}>
                      <FaSignOutAlt /> 退出登录
                    </UserMenuItem>
                  </UserMenuDropdown>
                </UserMenu>
              </>
            ) : (
              <>
                <AuthButton as={Link} to="/login">登录</AuthButton>
                <AuthButton as={Link} to="/register" primary="true">注册</AuthButton>
              </>
            )}
          </UserActions>
        </NavContainer>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

// 样式组件
const HeaderContainer = styled.header`
  background-color: var(--bg-secondary);
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) var(--container-padding);
  max-width: var(--container-max-width);
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  .logo-text {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--primary-color);
    letter-spacing: 1px;
  }
  
  .logo-subtext {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    letter-spacing: 3px;
  }
`;

const MobileIcons = styled.div`
  display: flex;
  align-items: center;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-md);
  cursor: pointer;
`;

const MenuIcon = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-lg);
  cursor: pointer;
`;

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.active {
    max-height: 500px;
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    max-height: none;
    overflow: visible;
    margin-left: var(--spacing-lg);
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const NavItem = styled.li`
  margin: var(--spacing-xs) 0;
  
  @media (min-width: 768px) {
    margin: 0 var(--spacing-sm);
  }
`;

const NavLink = styled(Link)`
  color: var(--text-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  padding: var(--spacing-xs) 0;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (min-width: 768px) {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  margin: var(--spacing-sm) 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.active {
    max-height: 50px;
  }
  
  @media (min-width: 768px) {
    width: auto;
    margin: 0 var(--spacing-md);
    max-height: none;
    overflow: visible;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
  font-size: var(--font-size-sm);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  @media (min-width: 768px) {
    width: 200px;
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const UserActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--spacing-md);
  
  @media (min-width: 768px) {
    flex-direction: row;
    margin-top: 0;
  }
`;

const AuthButton = styled(Link)`
  padding: var(--spacing-xs) var(--spacing-md);
  margin: var(--spacing-xs) 0;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  width: 100%;
  
  ${({ primary }) => primary 
    ? `
      background-color: var(--primary-color);
      color: white;
      &:hover {
        background-color: var(--primary-dark);
        color: white;
      }
    ` 
    : `
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      &:hover {
        background-color: var(--primary-light);
        color: white;
      }
    `}
  
  @media (min-width: 768px) {
    margin: 0 var(--spacing-xs);
    width: auto;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserMenuTrigger = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: var(--primary-color);
  font-size: var(--font-size-md);
  cursor: pointer;
  
  svg {
    margin-right: var(--spacing-xs);
  }
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow);
  min-width: 180px;
  z-index: 1000;
  padding: var(--spacing-xs) 0;
  display: none;
  
  ${UserMenu}:hover & {
    display: block;
  }
`;

const UserMenuItem = styled.a`
  display: block;
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--primary-color);
  }
  
  svg {
    margin-right: var(--spacing-xs);
  }
`;

export default Header;