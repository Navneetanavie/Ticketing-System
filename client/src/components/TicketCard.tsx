import { Ticket } from '@/types';
import Link from 'next/link';

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link href={`/tickets/${ticket.id}`} style={{ display: 'block' }}>
      <div className="card" style={{ height: '100%', transition: 'transform 0.2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span className={`badge badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>
          {ticket.subject}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {ticket.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <span>Priority: <span style={{ color: ticket.priority === 'HIGH' ? 'var(--error)' : 'inherit' }}>{ticket.priority}</span></span>
          <span>By: {ticket.createdBy.username}</span>
        </div>
      </div>
    </Link>
  );
}
