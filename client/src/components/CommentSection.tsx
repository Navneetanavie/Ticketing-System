import { useState, useEffect } from 'react';
import { Comment, User } from '@/types';
import { fetcher } from '@/utils/api';

export default function CommentSection({ ticketId }: { ticketId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher(`/api/tickets/${ticketId}/comments`)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await fetcher(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment }),
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: '600', color: 'var(--text)' }}>{comment.author.username}</span>
              <span>{new Date(comment.timestamp).toLocaleString()}</span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet.</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="input"
          style={{ minHeight: '100px', marginBottom: '1rem', resize: 'vertical' }}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>
    </div>
  );
}
