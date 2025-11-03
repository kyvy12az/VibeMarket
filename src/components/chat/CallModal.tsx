import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'incoming' | 'outgoing';
  callData: {
    callId: string;
    conversationId?: number;
    callerName?: string;
    callerAvatar?: string;
    callType: 'voice' | 'video';
    participants?: Array<{ id: number; name: string; avatar?: string }>;
    timestamp?: string;
  };
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  type,
  callData,
  onAccept,
  onReject,
  onCancel,
}) => {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  // init ringtone audio once
  useEffect(() => {
    const src = '/sounds/incoming-call.mp3'; 
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = false;
    audio.volume = 1;
    ringtoneRef.current = audio;

    // try to unlock audio on first user interaction (autoplay policy)
    const tryUnlock = async () => {
      try {
        const p = ringtoneRef.current?.play();
        if (p) {
          await p;
          ringtoneRef.current?.pause();
          if (ringtoneRef.current) ringtoneRef.current.currentTime = 0;
        }
      } catch {
        // ignore, will require user gesture on actual incoming call
      }
    };
    document.addEventListener('pointerdown', tryUnlock, { once: true, capture: true });

    return () => {
      try { audio.pause(); audio.src = ''; } catch {}
      document.removeEventListener('pointerdown', tryUnlock, { capture: true } as any);
      ringtoneRef.current = null;
    };
  }, []);

  // play/stop ringtone based on modal open + type
  useEffect(() => {
    if (isOpen && type === 'incoming') {
      try {
        const p = ringtoneRef.current?.play();
        if (p) p.catch(() => { /* silent */ });
      } catch { /* silent */ }
    } else {
      try {
        ringtoneRef.current?.pause();
        if (ringtoneRef.current) ringtoneRef.current.currentTime = 0;
      } catch {}
    }
  }, [isOpen, type]);

  const stopRingtone = () => {
    try {
      ringtoneRef.current?.pause();
      if (ringtoneRef.current) ringtoneRef.current.currentTime = 0;
    } catch {}
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={(v) => { stopRingtone(); onClose(); }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-2xl transition-all">
                <div className="text-center">
                  {/* Avatar with animation */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mx-auto mb-6"
                  >
                    <div className="relative inline-block">
                      <img
                        src={callData.callerAvatar || '/images/avatars/Avt-Default.png'}
                        alt={callData.callerName}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20"
                      />
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                    </div>
                  </motion.div>

                  {/* Caller Name */}
                  <Dialog.Title as="h2" className="text-2xl font-bold text-foreground mb-2">
                    {callData.callerName || 'Không xác định'}
                  </Dialog.Title>

                  {/* Call Type & Status */}
                  <p className="text-muted-foreground mb-8 flex items-center justify-center gap-2">
                    {callData.callType === 'video' ? (
                      <Video size={18} className="text-primary" />
                    ) : (
                      <Phone size={18} className="text-primary" />
                    )}
                    {type === 'incoming'
                      ? `Cuộc gọi ${callData.callType === 'video' ? 'video' : 'thoại'} đến`
                      : 'Đang gọi...'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-6">
                    {type === 'incoming' ? (
                      <>
                        {/* Reject Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { stopRingtone(); onReject && onReject(); }}
                          className="w-16 h-16 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <PhoneOff size={24} />
                        </motion.button>

                        {/* Accept Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { stopRingtone(); onAccept && onAccept(); }}
                          className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-glow transition-all"
                        >
                          {callData.callType === 'video' ? (
                            <Video size={28} />
                          ) : (
                            <Phone size={28} />
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <>
                        {/* Cancel Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { stopRingtone(); onCancel && onCancel(); }}
                          className="w-16 h-16 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <X size={24} />
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Participants (for group calls) */}
                  {callData.participants && callData.participants.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        {callData.participants.length} người tham gia
                      </p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {callData.participants.slice(0, 5).map((participant) => (
                          <img
                            key={participant.id}
                            src={participant.avatar || '/images/avatars/Avt-Default.png'}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                            title={participant.name}
                          />
                        ))}
                        {callData.participants.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground ring-2 ring-border">
                            +{callData.participants.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CallModal;