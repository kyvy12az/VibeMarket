import React, { useEffect, useState } from 'react';
import { X, Users, Image, FileText, Video, LogOut, Play, Download, Palette, Check } from 'lucide-react';
import { Conversation, ColorTheme } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Enhanced color themes with message colors
const colorThemes: ColorTheme[] = [
  {
    name: 'Mặc định',
    value: '',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: '#667eea',
    messageColor: '#667eea',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Hồng tím',
    value: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: '#f093fb',
    messageColor: '#e879f9',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Xanh biển',
    value: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: '#4facfe',
    messageColor: '#3b82f6',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Xanh lá',
    value: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    preview: '#43e97b',
    messageColor: '#22c55e',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Cam đỏ',
    value: '#fa709a',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: '#fa709a',
    messageColor: '#f97316',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Vàng nhẹ',
    value: '#ffecd2',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    preview: '#ffecd2',
    messageColor: '#f59e0b',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Xanh mint',
    value: '#a8edea',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: '#a8edea',
    messageColor: '#06b6d4',
    messageTextColor: '#ffffff'
  },
  {
    name: 'Tím lavender',
    value: '#d299c2',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    preview: '#d299c2',
    messageColor: '#8b5cf6',
    messageTextColor: '#ffffff'
  }
];

// Helper function to get message colors based on background
const getMessageColors = (backgroundColor?: string) => {
  if (!backgroundColor) {
    return {
      messageColor: '#667eea',
      messageTextColor: '#ffffff',
      secondaryMessageColor: '#f1f5f9'
    };
  }

  const theme = colorThemes.find(t => t.value === backgroundColor);
  if (theme) {
    return {
      messageColor: theme.messageColor || theme.value,
      messageTextColor: theme.messageTextColor || '#ffffff',
      secondaryMessageColor: `${theme.value}15` // 15% opacity
    };
  }

  // Auto-generate colors if not in predefined themes
  return {
    messageColor: backgroundColor,
    messageTextColor: '#ffffff',
    secondaryMessageColor: `${backgroundColor}15`
  };
};

interface ChatInfoSidebarProps {
  conversation: Conversation;
  onClose: () => void;
  onLeave: (conversationId: number) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
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
  onConversationUpdate,
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState(conversation.background_color || '');

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

  const handleColorChange = async (colorValue: string) => {
    setIsUpdatingColor(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        return;
      }

      // Get message colors for the selected theme
      const messageColors = getMessageColors(colorValue);

      const response = await fetch(`${BACKEND_URL}/api/chat/update_conversation.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          background_color: colorValue || null,
          message_color: messageColors.messageColor,
          message_text_color: messageColors.messageTextColor,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể cập nhật màu nền');
      }

      // Update local state
      setSelectedColor(colorValue);
      
      // Update parent component with all color data
      if (onConversationUpdate) {
        onConversationUpdate({
          ...conversation,
          background_color: colorValue || undefined,
          message_color: messageColors.messageColor,
          message_text_color: messageColors.messageTextColor,
        });
      }

      const themeName = colorThemes.find(theme => theme.value === colorValue)?.name || 'Tùy chỉnh';
      toast.success(`Đã đổi màu nền thành: ${themeName}`);
      setShowColorPicker(false);

    } catch (error: any) {
      console.error('Error updating conversation color:', error);
      toast.error(error.message || 'Không thể cập nhật màu nền');
    } finally {
      setIsUpdatingColor(false);
    }
  };

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

  // Enhanced color preview with message bubble preview
  const renderColorPreview = (theme: ColorTheme) => (
    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg">
      <div
        className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform relative overflow-hidden"
        style={{ background: theme.gradient }}
      >
        {selectedColor === theme.value && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check size={16} className="text-white drop-shadow-lg" />
          </div>
        )}
        {isUpdatingColor && selectedColor === theme.value && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Message preview */}
      <div className="w-full space-y-1">
        <div 
          className="text-xs px-2 py-1 rounded-lg text-white text-center"
          style={{ 
            backgroundColor: theme.messageColor || theme.value,
            color: theme.messageTextColor 
          }}
        >
          Tin nhắn
        </div>
        <div className="text-xs px-2 py-1 rounded-lg bg-gray-200 text-gray-800 text-center">
          Phản hồi
        </div>
      </div>
      
      <span className="text-xs font-medium text-center">{theme.name}</span>
    </div>
  );

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

          {/* Enhanced Customize Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Palette size={16} className="text-primary" />
              Tùy chỉnh giao diện
            </h4>

            {/* Background Color */}
            <div className="space-y-3">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ 
                      background: selectedColor || '#667eea'
                    }}
                  />
                  {/* Message color preview */}
                  <div 
                    className="w-6 h-4 rounded text-xs flex items-center justify-center text-white font-bold"
                    style={{ 
                      backgroundColor: getMessageColors(selectedColor).messageColor,
                      fontSize: '10px'
                    }}
                  >
                    Aa
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Màu nền & tin nhắn</p>
                  <p className="text-xs text-muted-foreground">
                    {colorThemes.find(theme => theme.value === selectedColor)?.name || 'Mặc định'}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: showColorPicker ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} className="text-muted-foreground" />
                </motion.div>
              </button>

              {/* Enhanced Color Picker */}
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-secondary/20 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-3 text-center">
                        Chọn màu chủ đề - Tin nhắn sẽ tự động điều chỉnh
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {colorThemes.map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => handleColorChange(theme.value)}
                            disabled={isUpdatingColor}
                            className="relative group hover:scale-105 transition-transform"
                            title={theme.name}
                          >
                            {renderColorPreview(theme)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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