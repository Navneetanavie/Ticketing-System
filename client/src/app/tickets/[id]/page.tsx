'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetcher } from '@/utils/api';
import { Ticket, User } from '@/types';
import CommentSection from '@/components/CommentSection';
import AttachmentSection from '@/components/AttachmentSection';
import RatingForm from '@/components/RatingForm';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);

    fetcher(`/api/tickets/${id}`)
      .then(setTicket)
      .catch((err) => {
        console.error(err);
        alert('Failed to load ticket');
        router.push('/dashboard');
      })
      .finally(() => setLoading(false));

    if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT_AGENT') {
      fetcher('/api/users').then(setUsers).catch(console.error);
    }
  }, [id, router]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      const updated = await fetcher(`/api/tickets/${ticket.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setTicket(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    if (!ticket) return;
    try {
      const assignee = users.find(u => u.id === Number(userId));
      const updated = await fetcher(`/api/tickets/${ticket.id}`, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo: assignee || null }),
      });
      setTicket(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to assign ticket');
    }
  };

  if (loading || !ticket) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;

  const canManage = user?.role === 'ADMIN' || user?.role === 'SUPPORT_AGENT';

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <button onClick={() => router.back()} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{ticket.subject}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <span>Created by {ticket.createdBy.username}</span>
              <span>•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span className={`badge badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
            {canManage && (
              <>
                <select
                  className="input"
                  style={{ padding: '0.25rem', fontSize: '0.875rem', width: 'auto' }}
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                {user?.role === 'ADMIN' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Assign To</label>
                    <select
                      className="input"
                      style={{ padding: '0.25rem', fontSize: '0.875rem', width: 'auto' }}
                      value={ticket.assignedTo?.id || ''}
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ticket.description}</p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Attachments</h3>
          <AttachmentSection ticketId={ticket.id} />
        </div>

        {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Rate Resolution</h3>
            {ticket.rating ? (
              <div className="card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--warning)' }}>{'★'.repeat(ticket.rating)}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>({ticket.rating}/5)</span>
                </div>
                {ticket.feedback && <p style={{ fontStyle: 'italic' }}>"{ticket.feedback}"</p>}
              </div>
            ) : (
              user?.id === ticket.createdBy.id ? (
                <RatingForm ticketId={ticket.id} onRate={(r, f) => {
                  setTicket({ ...ticket, rating: r, feedback: f });
                }} />
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Waiting for user rating.</p>
              )
            )}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Comments</h3>
          <CommentSection ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}
