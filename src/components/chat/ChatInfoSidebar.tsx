import React, { useEffect, useState } from 'react';
import { X, Users, Image, FileText, Video, LogOut, Play, Download } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ChatInfoSidebarProps {
  conversation: Conversation;
  onClose: () => void;
  onLeave: (conversationId: number) => void;
}

interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'file' | string;
  file_url: string;
  thumbnail_url?: string;
  original_name?: string;
  file_size?: number;
  created_at?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// helper to resolve file paths returned by backend (Cloudinary absolute URLs or relative backend paths)
const resolveUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const backend = (BACKEND_URL || "").replace(/\/+$/, "");
  const path = String(p).replace(/^\/+/, "");
  return backend ? `${backend}/${path}` : `/${path}`;
};

const ChatInfoSidebar: React.FC<ChatInfoSidebarProps> = ({
  conversation,
  onClose,
  onLeave,
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const getToken = () => {
    const candidates = [
      localStorage.getItem('vibeventure_token'),
      localStorage.getItem('token'),
      sessionStorage.getItem('vibeventure_token'),
      sessionStorage.getItem('token'),
    ];
    for (const c of candidates) if (c) return c.startsWith('Bearer ') ? c.slice(7) : c;
    const m = document.cookie.match(/(?:^|; )(?:vibeventure_token|token)=([^;]+)/);
    if (m) return decodeURIComponent(m[1]).startsWith('Bearer ') ? decodeURIComponent(m[1]).slice(7) : decodeURIComponent(m[1]);
    return null;
  };

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();

    const fetchMedia = async () => {
      if (!conversation) return;
      setIsLoadingMedia(true);
      try {
        const token = getToken();
        const res = await fetch(`${BACKEND_URL}/api/chat/media.php?conversation_id=${conversation.id}&limit=9`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: ac.signal,
        });
        if (!res.ok) {
          if (res.status === 401) {
            toast.error('Token hết hạn. Vui lòng đăng nhập lại.');
            setMedia([]);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (mounted && data && data.success && Array.isArray(data.data)) {
          setMedia(data.data);
        } else {
          setMedia([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Fetch media error:', err);
        toast.error('Không thể tải file phương tiện');
        setMedia([]);
      } finally {
        if (mounted) setIsLoadingMedia(false);
      }
    };

    fetchMedia();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [conversation]);

  const renderMediaItem = (item: MediaItem) => {
    const url = resolveUrl(item.file_url);
    if (item.type === 'image') {
      return (
        <a
          key={item.id}
          href={url}
          data-fancybox="chat-media"
          data-caption={item.original_name || 'Hình ảnh'}
          className="aspect-square rounded-lg overflow-hidden block"
        >
          <img src={url} alt={item.original_name || 'image'} className="w-full h-full object-cover" loading="lazy" />
        </a>
      );
    }
    if (item.type === 'video') {
      const poster = item.thumbnail_url ? resolveUrl(item.thumbnail_url) : undefined;
      return (
        <a
          key={item.id}
          href={url}
          data-fancybox="chat-media"
          data-caption={item.original_name || 'Video'}
          className="aspect-square rounded-lg overflow-hidden block"
        >
          <div className="relative w-full h-full bg-black/20">
            {poster ? (
              <img src={poster} alt={item.original_name || 'video'} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/80">
                <Play />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Play className="w-10 h-10 text-white/90" />
            </div>
          </div>
        </a>
      );
    }
    // file / document
    return (
      <a
        key={item.id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-secondary/50 p-3 text-center"
        title={item.original_name || 'File'}
      >
        <div className="flex flex-col items-center gap-2">
          <FileText className="text-muted-foreground" />
          <div className="text-xs font-medium truncate max-w-[6rem]">{item.original_name || 'Tệp đính kèm'}</div>
          {item.file_size && <div className="text-xs text-muted-foreground">{(item.file_size / 1024).toFixed(1)} KB</div>}
        </div>
      </a>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-80 bg-card border-l border-border flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">Thông tin</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-6">
          {/* Avatar & Name */}
          <div className="text-center">
            <img
              src={
                conversation.type === 'group'
                  ? conversation.avatar || '/images/avatars/Avt-Group-Default.png'
                  : (conversation.participants.find(p => p.id)?.avatar || '/images/avatars/Avt-Default.png')
              }
              alt={conversation.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-border"
            />
            <h2 className="text-xl font-bold text-foreground mb-1">
              {conversation.type === 'group'
                ? conversation.name
                : conversation.participants.find(p => p.id)?.name}
            </h2>
            {conversation.type === 'group' && (
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users size={14} />
                {conversation.participants.length} thành viên
              </p>
            )}
          </div>

          {/* Members */}
          {conversation.type === 'group' && (
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Thành viên
              </h4>
              <div className="space-y-2">
                {conversation.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <img
                      src={participant.avatar || '/images/avatars/Avt-Default.png'}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {participant.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Image size={16} className="text-primary" />
              File phương tiện
            </h4>

            {isLoadingMedia ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : media.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có file phương tiện nào.</div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {media.slice(0, 9).map((m) => (
                    <div key={m.id} className="aspect-square">
                      {renderMediaItem(m)}
                    </div>
                  ))}
                </div>
                {media.length > 9 && (
                  <div className="mt-3 text-right">
                    <a
                      href={`${BACKEND_URL}/chat/media-list.php?conversation_id=${conversation.id}`}
                      className="text-sm text-primary hover:underline flex items-center justify-end gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem tất cả ({media.length})
                      <Download size={14} />
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {conversation.type === 'group' && (
          <div className="p-4 border-t border-border">
            <button
              onClick={() => onLeave(conversation.id)}
              className="w-full px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Rời khỏi nhóm
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatInfoSidebar;