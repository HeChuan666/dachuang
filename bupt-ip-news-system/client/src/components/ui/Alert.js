import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const Alert = ({ type = 'info', message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        // 等待动画完成后调用 onClose
        const animationTimer = setTimeout(() => {
          if (onClose) onClose();
        }, 300);
        
        return () => clearTimeout(animationTimer);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    
    // 等待动画完成后调用 onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaTimesCircle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };
  
  return (
    <AlertContainer type={type} isVisible={isVisible}>
      <AlertIcon>{getIcon()}</AlertIcon>
      <AlertMessage>{message}</AlertMessage>
      <CloseButton onClick={handleClose}>
        <FaTimes />
      </CloseButton>
    </AlertContainer>
  );
};

// 动画
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
`;

// 样式组件
const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  animation: ${props => props.isVisible ? css`${fadeInUp} 0.3s ease forwards` : css`${fadeOutDown} 0.3s ease forwards`};
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return css`
          background-color: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
          color: #28a745;
        `;
      case 'warning':
        return css`
          background-color: rgba(255, 193, 7, 0.1);
          border-left: 4px solid #ffc107;
          color: #d39e00;
        `;
      case 'error':
        return css`
          background-color: rgba(220, 53, 69, 0.1);
          border-left: 4px solid #dc3545;
          color: #dc3545;
        `;
      case 'info':
      default:
        return css`
          background-color: rgba(0, 123, 255, 0.1);
          border-left: 4px solid #007bff;
          color: #007bff;
        `;
    }
  }}
`;

const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: var(--spacing-sm);
  font-size: 1.2rem;
`;

const AlertMessage = styled.div`
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: var(--spacing-sm);
  font-size: 1rem;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
  
  &:hover {
    opacity: 1;
  }
`;

export default Alert;