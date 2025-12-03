import { useState, useEffect } from 'react';
import { Attachment } from '@/types';
import { fetcher } from '@/utils/api';

export default function AttachmentSection({ ticketId }: { ticketId: number }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAttachments();
  }, [ticketId]);

  const loadAttachments = () => {
    fetcher(`/api/tickets/${ticketId}/attachments`)
      .then(setAttachments)
      .catch(console.error);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const credentials = btoa(`${JSON.parse(localStorage.getItem('user') || '{}').username}:${JSON.parse(localStorage.getItem('user') || '{}').password}`);

      const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/attachments`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      loadAttachments();
    } catch (err) {
      console.error(err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const credentials = btoa(`${JSON.parse(localStorage.getItem('user') || '{}').username}:${JSON.parse(localStorage.getItem('user') || '{}').password}`);

      const res = await fetch(`http://localhost:8080/api/attachments/${attachment.id}/download`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download file');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
          {uploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {attachments.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No attachments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {attachments.map((att) => (
            <li key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ flex: 1 }}>{att.filename}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {new Date(att.uploadedAt).toLocaleString()}
              </span>
              <button
                onClick={() => handleDownload(att)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
