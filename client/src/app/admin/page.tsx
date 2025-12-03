'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import UserList from '@/components/UserList';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Panel</h1>
        <Link href="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </header>

      <UserList />
    </div>
  );
}
