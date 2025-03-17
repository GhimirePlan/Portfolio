'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa6';
import { BiEdit, BiTrash, BiReply } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';

// Comment component to handle both top-level comments and replies
const Comment = ({ 
  comment, 
  session, 
  onEdit, 
  onDelete, 
  onReply, 
  editingCommentId, 
  editText, 
  setEditText, 
  isSubmitting, 
  handleUpdateComment,
  setEditingCommentId,
  replyingToCommentId,
  setReplyingToCommentId,
  replyText,
  setReplyText,
  handleSubmitReply
}) => {
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isEditing = editingCommentId === comment._id;
  const isReplying = replyingToCommentId === comment._id;
  const isOwnComment = session?.user?.email === comment.user.email;
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  // Calculate left margin based on nesting level
  const marginClass = comment.level > 0 ? `ml-${Math.min(comment.level * 4, 12)}` : '';

  return (
    <div className={`${marginClass} mb-4`}>
      <div className="bg-[#141b2d] p-4 rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center mb-3">
            {comment.user.image ? (
              <Image 
                src={comment.user.image} 
                alt={comment.user.name} 
                width={32} 
                height={32} 
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-8 h-8 bg-[#16f2b3] rounded-full flex items-center justify-center mr-3">
                <span className="text-[#1a1443] font-bold">
                  {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <div className="text-white font-medium">{comment.user.name}</div>
              <div className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {session && (
              <button 
                onClick={() => onReply(comment)}
                className="text-gray-400 hover:text-[#16f2b3]"
                aria-label="Reply to comment"
              >
                <BiReply size={18} />
              </button>
            )}
            
            {isOwnComment && (
              <>
                <button 
                  onClick={() => onEdit(comment)}
                  className="text-gray-400 hover:text-[#16f2b3]"
                  aria-label="Edit comment"
                >
                  <BiEdit size={18} />
                </button>
                <button 
                  onClick={() => onDelete(comment._id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete comment"
                >
                  <BiTrash size={18} />
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div>
            <textarea
              className="w-full p-3 bg-[#1a1443] text-white border border-[#1d293a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
              rows="3"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingCommentId(null)}
                className="text-gray-400 px-3 py-1 rounded-lg hover:bg-[#1d293a]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateComment(comment._id)}
                className="bg-[#16f2b3] text-[#1a1443] px-3 py-1 rounded-lg font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-white mt-2">{comment.content}</div>
        )}
        
        {isReplying && (
          <div className="mt-4 bg-[#1a1443] p-3 rounded-lg">
            <textarea
              className="w-full p-3 bg-[#141b2d] text-white border border-[#1d293a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
              rows="2"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setReplyingToCommentId(null)}
                className="text-gray-400 px-3 py-1 rounded-lg hover:bg-[#1d293a]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReply(comment._id)}
                className="bg-[#16f2b3] text-[#1a1443] px-3 py-1 rounded-lg font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Render replies */}
      {hasReplies && (
        <div className="mt-2 pl-4 border-l-2 border-[#1d293a]">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              session={session}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              editingCommentId={editingCommentId}
              editText={editText}
              setEditText={setEditText}
              isSubmitting={isSubmitting}
              handleUpdateComment={handleUpdateComment}
              setEditingCommentId={setEditingCommentId}
              replyingToCommentId={replyingToCommentId}
              setReplyingToCommentId={setReplyingToCommentId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleSubmitReply={handleSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ blogSlug }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch comments when component mounts or blogSlug changes
  useEffect(() => {
    if (blogSlug && isClient) {
      fetchComments();
    }
  }, [blogSlug, isClient]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?blogSlug=${blogSlug}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments || []);
      } else {
        console.error('Failed to fetch comments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogSlug,
          content: commentText.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCommentText('');
        // Refresh comments
        fetchComments();
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch (error) {
      setError('An error occurred while posting your comment');
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogSlug,
          content: replyText.trim(),
          parentId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setReplyText('');
        setReplyingToCommentId(null);
        // Refresh comments
        fetchComments();
      } else {
        setError(data.error || 'Failed to post reply');
      }
    } catch (error) {
      setError('An error occurred while posting your reply');
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.content);
    setReplyingToCommentId(null);
  };

  const handleReplyToComment = (comment) => {
    setReplyingToCommentId(comment._id);
    setReplyText('');
    setEditingCommentId(null);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editText.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the comment in the local state
        setComments(prevComments => 
          updateCommentInState(prevComments, commentId, { content: editText.trim() })
        );
        setEditingCommentId(null);
        setEditText('');
      } else {
        setError(data.error || 'Failed to update comment');
      }
    } catch (error) {
      setError('An error occurred while updating your comment');
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to update a comment in the nested state
  const updateCommentInState = (comments, commentId, updates) => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return { ...comment, ...updates };
      }
      
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInState(comment.replies, commentId, updates)
        };
      }
      
      return comment;
    });
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the comment from the local state
        fetchComments(); // Refresh all comments to get updated structure
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      setError('An error occurred while deleting your comment');
      console.error('Error deleting comment:', error);
    }
  };

  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <div className="mt-10 bg-[#1b203e] border border-[#1d293a] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
      
      {/* Comment Form */}
      {status === 'authenticated' ? (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {session.user.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name} 
                width={40} 
                height={40} 
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-[#16f2b3] rounded-full flex items-center justify-center mr-3">
                <span className="text-[#1a1443] font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <span className="text-white">{session.user.name}</span>
          </div>
          
          <form onSubmit={handleSubmitComment}>
            <textarea
              className="w-full p-3 bg-[#141b2d] text-white border border-[#1d293a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
              rows="3"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            
            {error && <p className="text-red-500 mt-2">{error}</p>}
            
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-[#141b2d] rounded-lg text-center">
          <p className="text-white mb-4">Sign in to join the conversation</p>
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto mx-auto"
          >
            <FaGoogle className="text-red-500" />
            Sign in with Google
          </button>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16f2b3]"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              session={session}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleReplyToComment}
              editingCommentId={editingCommentId}
              editText={editText}
              setEditText={setEditText}
              isSubmitting={isSubmitting}
              handleUpdateComment={handleUpdateComment}
              setEditingCommentId={setEditingCommentId}
              replyingToCommentId={replyingToCommentId}
              setReplyingToCommentId={setReplyingToCommentId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleSubmitReply={handleSubmitReply}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
} 