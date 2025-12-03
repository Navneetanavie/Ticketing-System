export interface User {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT_AGENT';
}

export interface Attachment {
  id: number;
  filename: string;
  fileType: string;
  uploadedAt: string;
  uploader: User;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  rating?: number;
  feedback?: string;
}

export interface Comment {
  id: number;
  text: string;
  author: User;
  timestamp: string;
}
