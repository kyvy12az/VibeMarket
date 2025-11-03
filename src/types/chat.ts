export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  status?: 'online' | 'offline';
}

export interface Participant {
  id: number;
  name: string;
  avatar?: string;
}

export interface Message {
  id?: number;
  tempId?: string;
  conversationId?: number;
  senderId: number;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  file_url?: string;
  fileUrl?: string;
  thumbnail_url?: string;
  file_type?: string;
  file_size?: number;
  original_name?: string;
  timestamp: string;
  isRead: boolean;
  isPending?: boolean;
  sender?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: number;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  participants: Participant[];
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at?: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  message?: string;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
  message?: string;
}

export interface UploadedFile {
  file_url: string;
  thumbnail_url?: string;
  file_type: string;
  file_size: number;
  original_name: string;
}

export interface UploadResponse {
  success: boolean;
  data?: UploadedFile[];
  message?: string;
  total_count?: number;
  uploaded_count?: number;
  errors?: any[];
}
