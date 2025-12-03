import { useState } from 'react';
import { fetcher } from '@/utils/api';

interface RatingFormProps {
  ticketId: number;
  onRate: (rating: number, feedback: string) => void;
}

export default function RatingForm({ ticketId, onRate }: RatingFormProps) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetcher(`/api/tickets/${ticketId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
      onRate(rating, feedback);
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">Rating</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: star <= rating ? 'var(--warning)' : 'var(--text-secondary)',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">Feedback (Optional)</label>
        <textarea
          className="input"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="How was your experience?"
          rows={3}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  );
}
