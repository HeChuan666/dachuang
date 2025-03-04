import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaUser, FaReply, FaRegComment } from 'react-icons/fa';
import { newsApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Alert from '../ui/Alert';

const CommentSection = ({ newsId, comments = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  const [localComments, setLocalComments] = useState(comments);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAlertInfo({
        show: true,
        type: 'warning',
        message: '请先登录后再发表评论'
      });
      return;
    }
    
    if (!commentText.trim()) {
      setAlertInfo({
        show: true,
        type: 'warning',
        message: '评论内容不能为空'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await newsApi.addComment(newsId, commentText);
      
      if (response.success) {
        setLocalComments(response.data);
        setCommentText('');
        
        setAlertInfo({
          show: true,
          type: 'success',
          message: '评论发表成功'
        });
      } else {
        setAlertInfo({
          show: true,
          type: 'error',
          message: '评论发表失败'
        });
      }
    } catch (err) {
      console.error('发表评论失败:', err);
      setAlertInfo({
        show: true,
        type: 'error',
        message: '发表评论时发生错误'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const closeAlert = () => {
    setAlertInfo({ show: false, type: '', message: '' });
  };
  
  return (
    <CommentSectionContainer>
      <SectionTitle>
        <FaRegComment />
        <span>评论区 ({localComments.length})</span>
      </SectionTitle>
      
      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          message={alertInfo.message} 
          onClose={closeAlert}
        />
      )}
      
      <CommentForm onSubmit={handleCommentSubmit}>
        <CommentTextarea
          placeholder={isAuthenticated ? "写下您的评论..." : "请先登录后再评论"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!isAuthenticated || isSubmitting}
        />
        <CommentFormActions>
          {!isAuthenticated && (
            <LoginPrompt>
              <Link to="/login">登录</Link> 或 <Link to="/register">注册</Link> 后参与评论
            </LoginPrompt>
          )}
          <SubmitButton 
            type="submit" 
            disabled={!isAuthenticated || isSubmitting}
          >
            {isSubmitting ? '提交中...' : '发表评论'}
          </SubmitButton>
        </CommentFormActions>
      </CommentForm>
      
      <CommentList>
        {localComments.length > 0 ? (
          localComments.map((comment, index) => (
            <CommentItem key={comment._id || index}>
              <CommentAvatar>
                <FaUser />
              </CommentAvatar>
              <CommentContent>
                <CommentHeader>
                  <CommentAuthor>{comment.name}</CommentAuthor>
                  <CommentDate>
                    {format(new Date(comment.date), 'yyyy-MM-dd HH:mm')}
                  </CommentDate>
                </CommentHeader>
                <CommentText>{comment.text}</CommentText>
                <CommentActions>
                  <CommentAction>
                    <FaReply />
                    <span>回复</span>
                  </CommentAction>
                </CommentActions>
              </CommentContent>
            </CommentItem>
          ))
        ) : (
          <NoComments>暂无评论，快来发表第一条评论吧！</NoComments>
        )}
      </CommentList>
    </CommentSectionContainer>
  );
};

// 样式组件
const CommentSectionContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
`;

const CommentForm = styled.form`
  margin-bottom: var(--spacing-xl);
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-family: inherit;
  resize: vertical;
  transition: border-color var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  &:disabled {
    background-color: var(--bg-primary);
    cursor: not-allowed;
  }
`;

const CommentFormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
`;

const LoginPrompt = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  margin-top: var(--spacing-xl);
`;

const CommentItem = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  color: var(--text-light);
  font-size: var(--font-size-lg);
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
`;

const CommentAuthor = styled.div`
  font-weight: 500;
  color: var(--text-primary);
`;

const CommentDate = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-light);
`;

const CommentText = styled.div`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
`;

const CommentActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const CommentAction = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  font-size: var(--font-size-xs);
  color: var(--text-light);
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const NoComments = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-light);
  font-style: italic;
`;

export default CommentSection;