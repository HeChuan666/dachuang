import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* 主色调 - 科技蓝色系 */
    --primary-color: #0066cc;
    --primary-light: #4d94ff;
    --primary-dark: #004c99;
    
    /* 强调色 - 科技感橙色 */
    --accent-color: #ff6600;
    --accent-light: #ff944d;
    --accent-dark: #cc5200;
    
    /* 背景色 */
    --bg-primary: #f8f9fa;
    --bg-secondary: #ffffff;
    --bg-dark: #1a1a2e;
    
    /* 文本色 */
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-light: #999999;
    --text-white: #ffffff;
    
    /* 边框和阴影 */
    --border-color: #e0e0e0;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --box-shadow-hover: 0 8px 15px rgba(0, 0, 0, 0.1);
    
    /* 间距 */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
    
    /* 动画时间 */
    --transition-fast: 0.2s;
    --transition-normal: 0.3s;
    --transition-slow: 0.5s;
    
    /* 圆角 */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 20px;
    
    /* 字体大小 */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
    --font-size-xxxl: 2.5rem;
    
    /* 容器宽度 */
    --container-max-width: 1200px;
    --container-padding: 1rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Roboto', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--primary-light);
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-md);
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: var(--font-size-xxxl);
  }

  h2 {
    font-size: var(--font-size-xxl);
  }

  h3 {
    font-size: var(--font-size-xl);
  }

  h4 {
    font-size: var(--font-size-lg);
  }

  h5 {
    font-size: var(--font-size-md);
  }

  h6 {
    font-size: var(--font-size-sm);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul, ol {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-xl);
  }

  .container {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  .section {
    padding: var(--spacing-xl) 0;
  }

  /* 科技感滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }

  /* 按钮样式 */
  .btn {
    display: inline-block;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.5rem 1rem;
    font-size: var(--font-size-md);
    line-height: 1.5;
    border-radius: var(--border-radius-md);
    transition: all var(--transition-normal);
    cursor: pointer;
    
    &:focus, &:hover {
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
    }
    
    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &.btn-primary {
      color: var(--text-white);
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      
      &:hover {
        background-color: var(--primary-dark);
        border-color: var(--primary-dark);
      }
    }

    &.btn-secondary {
      color: var(--text-white);
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      
      &:hover {
        background-color: var(--accent-dark);
        border-color: var(--accent-dark);
      }
    }

    &.btn-outline {
      color: var(--primary-color);
      background-color: transparent;
      border-color: var(--primary-color);
      
      &:hover {
        color: var(--text-white);
        background-color: var(--primary-color);
      }
    }
  }

  /* 表单样式 */
  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .form-label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }

  .form-control {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: var(--font-size-md);
    line-height: 1.5;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    background-clip: padding-box;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
    
    &:focus {
      border-color: var(--primary-light);
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
    }
  }

  /* 卡片样式 */
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: var(--bg-secondary);
    background-clip: border-box;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    box-shadow: var(--box-shadow);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: var(--box-shadow-hover);
    }
  }

  .card-body {
    flex: 1 1 auto;
    padding: var(--spacing-lg);
  }

  .card-title {
    margin-bottom: var(--spacing-md);
    font-weight: 600;
  }

  .card-text {
    margin-bottom: var(--spacing-md);
  }

  /* 工具类 */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-muted {
    color: var(--text-light);
  }

  .mt-1 { margin-top: var(--spacing-xs); }
  .mt-2 { margin-top: var(--spacing-sm); }
  .mt-3 { margin-top: var(--spacing-md); }
  .mt-4 { margin-top: var(--spacing-lg); }
  .mt-5 { margin-top: var(--spacing-xl); }

  .mb-1 { margin-bottom: var(--spacing-xs); }
  .mb-2 { margin-bottom: var(--spacing-sm); }
  .mb-3 { margin-bottom: var(--spacing-md); }
  .mb-4 { margin-bottom: var(--spacing-lg); }
  .mb-5 { margin-bottom: var(--spacing-xl); }

  /* 加载动画 */
  .loading {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
    
    &:after {
      content: " ";
      display: block;
      border-radius: 50%;
      width: 46px;
      height: 46px;
      margin: 1px;
      border: 5px solid var(--primary-color);
      border-color: var(--primary-color) transparent var(--primary-color) transparent;
      animation: loading 1.2s linear infinite;
    }
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* 响应式布局 */
  @media (max-width: 1200px) {
    .container {
      max-width: 960px;
    }
  }

  @media (max-width: 992px) {
    .container {
      max-width: 720px;
    }
  }

  @media (max-width: 768px) {
    .container {
      max-width: 540px;
    }
    
    h1 {
      font-size: calc(var(--font-size-xxxl) * 0.8);
    }
    
    h2 {
      font-size: calc(var(--font-size-xxl) * 0.8);
    }
  }

  @media (max-width: 576px) {
    .container {
      max-width: 100%;
    }
  }
`;

export default GlobalStyles;