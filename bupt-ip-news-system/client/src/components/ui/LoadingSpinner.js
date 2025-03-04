import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = ({ size = 'medium', center = true }) => {
  return (
    <SpinnerContainer center={center}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};

// 样式组件
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  ${({ center }) => center && `
    min-height: 200px;
  `}
`;

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '64px';
      case 'medium':
      default:
        return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '24px';
      case 'large':
        return '64px';
      case 'medium':
      default:
        return '40px';
    }
  }};
  
  &:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: ${({ size }) => {
      switch (size) {
        case 'small':
          return '4px';
        case 'large':
          return '8px';
        case 'medium':
        default:
          return '6px';
      }
    }} solid var(--primary-color);
    border-color: var(--primary-color) transparent var(--primary-color) transparent;
    animation: ${spin} 1.2s linear infinite, ${pulse} 1.5s ease-in-out infinite;
  }
`;

export default LoadingSpinner;