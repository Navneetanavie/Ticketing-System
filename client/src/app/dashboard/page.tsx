'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/utils/api';
import { Ticket, User } from '@/types';
import TicketCard from '@/components/TicketCard';
import Link from 'next/link';

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchTickets();
  }, [router]);

  const fetchTickets = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);

    fetcher(`/api/tickets?${params.toString()}`)
      .then(setTickets)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Debounce search or just search on button click? Let's do button or effect.
  // Effect for filters, maybe debounce for search. For simplicity: Effect on filters, Enter/Blur for search.
  useEffect(() => {
    if (user) fetchTickets();
  }, [statusFilter, priorityFilter]); // Re-fetch when filters change

  if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.username}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="btn btn-secondary">
              Admin Panel
            </Link>
          )}
          <Link href="/tickets/new" className="btn btn-primary">
            + New Ticket
          </Link>
          <button
            onClick={() => { localStorage.removeItem('user'); router.push('/login'); }}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="input"
            placeholder="Search by subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTickets()}
          />
        </div>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        <button onClick={fetchTickets} className="btn btn-secondary">Search</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {tickets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <p>No tickets found.</p>
        </div>
      )}
    </div>
  );
}
