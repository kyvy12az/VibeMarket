import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import toast, { Toaster } from 'react-hot-toast';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Phone
} from 'lucide-react';
const isDev = import.meta.env.VITE_NODE_ENV === 'development';
const log = isDev ? console.log.bind(console) : () => { };
const logError = isDev ? console.error.bind(console) : () => { };

interface User {
    id: string;
    name: string;
    avatar: string;
    peerId?: string;
}

interface CallData {
    callId: string;
    conversationId: string;
    type: 'voice' | 'video';
    caller?: User;
    declinedBy?: User;
    reason?: string;
    participants?: Array<{
        id: string;
        name: string;
        avatar: string;
        peerId?: string;
    }>;
}

const VideoCall: React.FC = () => {
    const navigate = useNavigate();
    const { conversationId, callType, callId } = useParams<{
        conversationId: string;
        callType: 'voice' | 'video';
        callId: string;
    }>();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null); // Thêm ref
    const [currentCallId, setCurrentCallId] = useState<string | null>(null);
    const [activeCalls, setActiveCalls] = useState<Record<string, MediaConnection>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [participants, setParticipants] = useState<Array<{
        id: string;
        name: string;
        stream: MediaStream | null;
        isLocal: boolean;
        avatar?: string;
    }>>([]);
    const peerRef = useRef<Peer | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const serverUrl = import.meta.env.VITE_BACKEND_CALL_URL || 'http://localhost:3000/call';

    const initializeStream = React.useCallback(async () => {
        try {
            const constraints = {
                video: callType === 'video',
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            };

            log('Initializing stream with constraints:', constraints, 'for callType:', callType);

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            log('Local stream acquired with tracks:', stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted, readyState: t.readyState })));

            // ensure audio track enabled
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = true;
                log('Audio track enabled:', audioTrack.enabled, 'muted:', audioTrack.muted);
            }

            // ensure video track enabled according to isVideoOff state
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isVideoOff;
                log('Video track enabled:', videoTrack.enabled);
            }

            setLocalStream(stream);
            localStreamRef.current = stream;
        } catch (err) {
            const error = err as Error;
            logError('Media error during initialization:', error.name, error.message);
            toast.error('Không thể truy cập camera/mic: ' + error.message + '. Vui lòng kiểm tra quyền truy cập.');
            setLocalStream(null);
            localStreamRef.current = null;
        }
    }, [callType, isVideoOff]);

    useEffect(() => {
        initializeStream().catch(err => logError('Initial stream setup failed:', err));

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [initializeStream]);

    useEffect(() => {
        const getToken = () => {
            const fromLocal = localStorage.getItem('vibeventure_token') || localStorage.getItem('token');
            if (fromLocal) return fromLocal;
            const fromSession = sessionStorage.getItem('token');
            if (fromSession) return fromSession;
            const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
            if (m) return decodeURIComponent(m[1]);
            return null;
        };

        let jwtToken = getToken();
        if (!jwtToken) {
            toast.error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            return;
        }
        if (jwtToken.startsWith('Bearer ')) jwtToken = jwtToken.slice(7);

        const socket = io(serverUrl, {
            auth: { token: jwtToken },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            log('Socket connected to /call namespace, initializing PeerJS');
            const peer = new Peer({
                host: '0.peerjs.com',
                port: 443,
                path: '/',
                secure: true,
                debug: isDev ? 1 : 0,
            });

            log("=== PEER INIT === Using 0.peerjs.com public server");

            peerRef.current = peer;

            peer.on('open', (peerId) => {
                log('PeerJS open with ID:', peerId);
                socket.emit('register_peer', peerId);
                if (conversationId && callType && callId) {
                    log('Auto-emitting initiate_call because we have URL params');
                    socket.emit('initiate_call', {
                        callId,
                        conversationId,
                        callType,
                    });
                }
            });

            peer.on('call', (call) => {
                log('Received call from peer:', call.peer, 'for', callType, 'call');
                if (localStreamRef.current) {
                    const audioTrack = localStreamRef.current.getAudioTracks()[0];
                    log('Answering call with local stream - audio track enabled:', audioTrack?.enabled, 'muted:', audioTrack?.muted);
                    call.answer(localStreamRef.current);
                } else {
                    logError('No local stream available to answer call, attempting to reinitialize');
                    initializeStream().then(() => {
                        if (localStreamRef.current) {
                            const audioTrack = localStreamRef.current.getAudioTracks()[0];
                            log('Reinitialized and answering call - audio track enabled:', audioTrack?.enabled, 'muted:', audioTrack?.muted);
                            call.answer(localStreamRef.current);
                        }
                    }).catch(err => logError('Reinitialization failed:', err));
                }
                setActiveCalls((prev) => ({ ...prev, [call.peer]: call }));
                call.on('stream', (remoteStream) => {
                    log('Received remote stream from:', call.peer, 'audio tracks:', remoteStream.getAudioTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
                    addVideoStream(remoteStream, call.peer, 'Không xác định', '/images/avatars/Avt-Default.png');
                });
                call.on('close', () => removeVideoStream(call.peer));
                call.on('error', (err) => {
                    logError('Call error:', err);
                    removeVideoStream(call.peer);
                });
            });

            peer.on('error', (err) => {
                logError('PeerJS error:', err);
                setIsConnected(false);
            });
        });

        socket.on('connect_error', (err) => {
            logError('Socket connect error:', err.message);
            setIsConnected(false);
        });

        socket.on('incoming_call', (data: CallData) => {
            log('Incoming call received:', data);
            setCurrentCallId(data.callId);
            // toast.success('Cuộc gọi đến từ ' + (data.caller?.name || 'ai đó'));
            setTimeout(() => {
                if (peerRef.current?.id) {
                    log('Auto-joining incoming call:', { callId: data.callId, peerId: peerRef.current.id });
                    socketRef.current?.emit('join_call', { callId: data.callId, peerId: peerRef.current.id });
                }
            }, 500);
        });

        socket.on('call_initiated', (data: CallData) => {
            log('Call initiated response:', data);
            setCurrentCallId(data.callId);
            // Auto-join
            setTimeout(() => {
                if (peerRef.current?.id) {
                    log('Auto-joining initiated call:', { callId: data.callId, peerId: peerRef.current.id });
                    socketRef.current?.emit('join_call', { callId: data.callId, peerId: peerRef.current.id });
                }
            }, 500);
        });

        socket.on('call_joined', (data: CallData) => {
            log('Call joined event received:', data);
            setCurrentCallId(data.callId);
            // toast.success('Đã tham gia cuộc gọi thành công');
            if (!localStreamRef.current) {
                logError('No local stream available for call_joined, attempting to reinitialize');
                initializeStream().then(() => {
                    if (localStreamRef.current) handleCallJoined(data);
                }).catch(err => logError('Reinitialization failed:', err));
            } else {
                handleCallJoined(data);
            }
        });

        socket.on('user_joined_call', (data: CallData & { user: User; peerId: string }) => {
            log('User joined call:', data.user, 'with peerId:', data.peerId);
            toast.success((data.user.name || 'Ai đó') + ' đã tham gia cuộc gọi');
            if (!localStreamRef.current) {
                logError('No local stream available for user_joined_call, attempting to reinitialize');
                initializeStream().then(() => {
                    if (localStreamRef.current) {
                        log('Reinitialized stream for user_joined_call, tracks:', localStreamRef.current.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
                        handleUserJoinedCall(data);
                    }
                }).catch(err => logError('Reinitialization failed for user_joined_call:', (err as Error).name, (err as Error).message));
            } else {
                handleUserJoinedCall(data);
            }
        });

        socket.on('user_left_call', (data: CallData & { user: User }) => {
            log('User left call:', data.user);
            toast((data.user.name || 'Ai đó') + ' đã rời khỏi cuộc gọi', {
                icon: '👋',
            });
            if (data.user.id) {
                removeVideoStream(data.user.id);
            }
        });

        socket.on('call_ended', (data: CallData) => {
            log('Call ended:', data);
            // toast.success("Cuộc gọi đã kết thúc");
            clearAllVideos();
            setCurrentCallId(null);
            navigate('/messages');
            setTimeout(() => {
                toast.success("Cuộc gọi đã kết thúc");
            }, 100);
        });

        socket.on('call_declined', (data: CallData) => {
            log('Call declined by:', data.declinedBy);
            toast.error((data.declinedBy?.name || 'Người dùng') + ' đã từ chối cuộc gọi');
        });

        socket.on('call_error', (error: { message: string }) => {
            logError('Call error from server:', error.message);
            toast.error('Lỗi cuộc gọi: ' + error.message);
        });

        socket.on('connect_error', (err) => {
            logError('Socket connect error:', err.message);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason) => {
            log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (peerRef.current) {
                peerRef.current.destroy();
            }
            clearAllVideos();
        };
    }, [serverUrl]);
    useEffect(() => {
        if (isConnected && peerRef.current?.id && localStreamRef.current && conversationId && callType && callId) {
            log('Auto-joining call with ID:', callId);
            setCurrentCallId(callId);
            setTimeout(() => {
                if (peerRef.current?.id) {
                    log('Joining call:', { callId, peerId: peerRef.current.id });
                    socketRef.current?.emit('join_call', { callId, peerId: peerRef.current.id });
                }
            }, 1000);
        }
    }, [isConnected, conversationId, callType, callId]);

    useEffect(() => {
        navigator.permissions.query({ name: 'microphone' as PermissionName })
            .then(result => {
                log('Microphone permission:', result.state);
            });

        interface ExtendedWindow extends Window {
            webkitAudioContext?: typeof AudioContext;
        }

        if (window.AudioContext || (window as ExtendedWindow).webkitAudioContext) {
            const AudioContextClass = window.AudioContext || (window as ExtendedWindow).webkitAudioContext!;
            const audioContext = new AudioContextClass();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }
    }, []);

    const addVideoStream = (stream: MediaStream, id: string, name: string = 'Không rõ', avatar: string = '/images/avatars/Avt-Default.png') => {
        log('Adding video stream for:', id, 'name:', name, 'audio tracks:', stream.getAudioTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));

        setParticipants(prev => {
            const existingIndex = prev.findIndex(p => p.id === id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], stream, name, avatar };
                return updated;
            } else {
                return [...prev, {
                    id,
                    name,
                    stream,
                    avatar,
                    isLocal: false
                }];
            }
        });
    };

    const removeVideoStream = (id: string) => {
        log('Removing video for peerId:', id);
        setParticipants(prev => prev.filter(p => p.id !== id));
    };

    const handleCallJoined = (data: CallData) => {
        log('Handling call joined with local stream for', callType, 'call:', localStreamRef.current?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted })));

        if (!localStreamRef.current) {
            logError('Local stream still unavailable after reinitialization');
            initializeStream().then(() => {
                if (localStreamRef.current) handleCallJoined(data);
            }).catch(err => logError('Reinitialization failed:', err));
            return;
        }

        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !isMuted;
            log('Set local audio track enabled to:', audioTrack.enabled, 'based on mute state:', isMuted);
        }

        setParticipants(prev => {
            const newParticipants = [...prev];
            if (!newParticipants.find(p => p.isLocal)) {
                const userInfo = JSON.parse(localStorage.getItem('vibeventure_user') || localStorage.getItem('user') || '{}');
                newParticipants.push({
                    id: 'local',
                    name: userInfo.name || 'Bạn',
                    stream: localStreamRef.current,
                    avatar: userInfo.avatar || '/images/avatars/Avt-Default.png',
                    isLocal: true
                });
            }
            return newParticipants;
        });

        data.participants?.forEach((p) => {
            const participantPeerId = p.peerId;
            if (participantPeerId && participantPeerId !== peerRef.current?.id) {
                log('Attempting to call peer:', p.name, 'with peerId:', participantPeerId);
                const call = peerRef.current?.call(participantPeerId, localStreamRef.current!);
                if (call) {
                    setActiveCalls((prev) => ({ ...prev, [participantPeerId]: call }));
                    call.on('stream', (remoteStream) => {
                        log('Received stream from joined user:', p.name, p.avatar, 'audio tracks:', remoteStream.getAudioTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
                        addVideoStream(remoteStream, participantPeerId, p.name, p.avatar);
                    });
                    call.on('close', () => removeVideoStream(participantPeerId));
                    call.on('error', (err) => {
                        logError('Call error to peer:', p.name, err);
                    });
                } else {
                    logError('Failed to initiate call to:', p.name, 'PeerJS state:', peerRef.current?.disconnected, peerRef.current?.destroyed);
                }
            }
        });
    };

    const handleUserJoinedCall = (data: CallData & { user: User; peerId: string }) => {
        log('Handling user joined call with local stream for', callType, 'call:', localStreamRef.current?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted })));
        if (!localStreamRef.current) {
            logError('Local stream still unavailable after reinitialization for user_joined_call');
            initializeStream().then(() => {
                if (localStreamRef.current) handleUserJoinedCall(data);
            }).catch(err => logError('Reinitialization failed for user_joined_call:', err.name, err.message));
            return;
        }
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !isMuted;
            log('Set outgoing call audio track enabled to:', audioTrack.enabled, 'based on mute state:', isMuted);
        }
        const userPeerId = data.peerId;
        if (userPeerId !== peerRef.current?.id) {
            log('Attempting to call new user:', data.user.name, 'with peerId:', userPeerId, 'for', callType, 'call');
            const call = peerRef.current?.call(userPeerId, localStreamRef.current!);
            if (call) {
                setActiveCalls((prev) => ({ ...prev, [userPeerId]: call }));
                call.on('stream', (remoteStream) => {
                    log('Received stream from new user:', data.user.name, 'audio tracks:', remoteStream.getAudioTracks().map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted })));
                    addVideoStream(remoteStream, userPeerId, data.user.name, data.user.avatar);
                });
                call.on('close', () => removeVideoStream(userPeerId));
                call.on('error', (err) => {
                    logError('Call error to new user:', data.user.name, err);
                });
            } else {
                logError('Failed to initiate call to new user:', data.user.name, 'PeerJS state:', peerRef.current?.disconnected, peerRef.current?.destroyed);
            }
        }
    };

    const endCall = () => {
        if (!currentCallId) {
            console.error('No current call ID to end');
            toast.error('Không thể kết thúc cuộc gọi');
            return;
        }
        // console.log('Ending call:', currentCallId);
        socketRef.current?.emit('end_call', { callId: currentCallId });
        clearAllVideos();
        Object.values(activeCalls).forEach((call) => call.close());
        setActiveCalls({});
        if (peerRef.current) peerRef.current.disconnect();
        // toast.success('Đã kết thúc cuộc gọi');
        // Reset call state
        setCurrentCallId(null);
        setIsMuted(false);
        setIsVideoOff(false);
        setParticipants([]);
        navigate("/messages");
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                const newMutedState = !isMuted;
                audioTrack.enabled = !newMutedState;
                setIsMuted(newMutedState);
                //console.log('Toggled mute for', callType, 'call - new muted state:', newMutedState, 'audio track enabled:', audioTrack.enabled, 'track state:', audioTrack.readyState);

                if (newMutedState) {
                    toast('Đã tắt mic', { icon: '🔇' });
                } else {
                    toast('Đã bật mic', { icon: '🎤' });
                }
                Object.values(activeCalls).forEach((call) => {
                    if (call.peerConnection && call.peerConnection.getSenders) {
                        const audioSender = call.peerConnection.getSenders().find(sender =>
                            sender.track && sender.track.kind === 'audio'
                        );
                        if (audioSender && audioSender.track) {
                            audioSender.track.enabled = !newMutedState;
                            //console.log('Updated audio track for peer connection:', audioSender.track.enabled);
                        }
                    }
                });
            } else {
                console.error('No audio track found in local stream for', callType, 'call');
                //console.log('Available tracks:', localStreamRef.current.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
                toast.error('Không thể điều khiển mic');
            }
        } else {
            console.error('No local stream available for toggle mute in', callType, 'call');
            toast.error('Không có kết nối mic');
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                const newVideoOffState = !isVideoOff;
                videoTrack.enabled = !newVideoOffState;
                setIsVideoOff(newVideoOffState);
                //console.log('Toggled video, new video off state:', newVideoOffState, 'video enabled:', videoTrack.enabled);
                if (newVideoOffState) {
                    toast('Đã tắt camera', { icon: '📹' });
                } else {
                    toast('Đã bật camera', { icon: '📷' });
                }
            } else {
                toast.error('Không thể điều khiển camera');
            }
        } else {
            toast.error('Không có kết nối camera');
        }
    };

    const clearAllVideos = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
            localStreamRef.current = null;
        }
        setParticipants([]);
    };
    const getGridLayout = (count: number) => {
        if (count <= 1) return "grid-cols-1 grid-rows-1"; // 1 người: full
        if (count === 2) return "grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1"; // 2 người: dọc mobile, ngang desktop
        if (count === 3)
            return "grid-cols-1 grid-rows-3 sm:grid-cols-2 sm:grid-rows-[1fr_1fr] md:grid-cols-3 md:grid-rows-1"; // 3 người: ngang desktop
        if (count === 4) return "grid-cols-2 grid-rows-2"; // 4 người: 2x2
        if (count <= 6)
            return "grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2"; // 5–6 người: gallery view
        if (count <= 9)
            return "grid-cols-3 grid-rows-3"; // 7–9 người: 3x3 view
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"; // >9 người: 3–4 cột
    };

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            try {
                const v = localVideoRef.current;
                v.muted = true; // mute local preview so autoplay is allowed
                v.playsInline = true;
                v.autoplay = true;
                v.srcObject = localStream;
                const p = v.play();
                if (p) {
                    p.catch((err) => {
                        log('Local video play() rejected (autoplay?):', err);
                        // optional: show small hint to user
                        // toast.error('Nhấn vào trang để bật camera (autoplay bị chặn).');
                    });
                }
            } catch (err) {
                logError('Error attaching local stream to video element:', err);
            }
        }
    }, [localStream]);

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        border: '1px solid #374151',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="h-screen bg-gray-900 flex flex-col">
                <div className="flex-1 overflow-y-auto p-2 md:p-4">
                    {participants.length === 0 && !localStream ? (
                        <div className="flex flex-col items-center justify-center h-full text-white">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Phòng chờ...</h3>
                            <p className="text-gray-400 text-center">Đang thiết lập kết nối của bạn...</p>
                        </div>
                    ) : (
                        <div className="relative h-full w-full bg-black overflow-hidden">
                            {participants.length <= 2 ? (
                                <>
                                    {/* Người kia (full màn hình) */}
                                    {participants
                                        .filter((p) => !p.isLocal)
                                        .map((participant) => (
                                            <div key={participant.id} className="absolute inset-0">
                                                {participant.stream ? (
                                                    <video
                                                        autoPlay
                                                        playsInline
                                                        muted={false}
                                                        className="w-full h-full object-cover rounded-xl transform -scale-x-100"
                                                        ref={(videoEl) => {
                                                            if (videoEl && participant.stream) {
                                                                videoEl.srcObject = participant.stream;
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                        {participant.avatar ? (
                                                            <img
                                                                src={participant.avatar}
                                                                alt={participant.name}
                                                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                                                            />
                                                        ) : (
                                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                                                                {participant.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg">
                                                    <span className="text-white text-lg font-semibold">{participant.name}</span>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Video của bạn (nổi góc phải dưới) */}
                                    {participants
                                        .filter((p) => p.isLocal)
                                        .map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="absolute bottom-4 right-4 w-32 h-48 md:w-44 md:h-64 rounded-xl overflow-hidden shadow-lg border border-white/20 cursor-pointer hover:scale-105 transition-transform"
                                            >
                                                {isVideoOff ? (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                        <VideoOff className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                ) : participant.stream ? (
                                                    <video
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className="w-full h-full object-cover rounded-xl transform -scale-x-100"
                                                        ref={(videoEl) => {
                                                            if (videoEl && participant.stream) {
                                                                videoEl.srcObject = participant.stream;
                                                                localVideoRef.current = videoEl;
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                        <span className="text-white text-3xl font-bold">
                                                            {participant.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </>
                            ) : (
                                <div
                                    className={`grid gap-2 w-full h-full p-2 ${getGridLayout(participants.length)}`}
                                >
                                    {participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="relative bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center"
                                        >
                                            {participant.stream ? (
                                                <video
                                                    autoPlay
                                                    playsInline
                                                    muted={participant.isLocal}
                                                    className={`w-full h-full object-cover transform -scale-x-100 ${participant.isLocal ? 'border-4 border-white/20' : ''
                                                        }`}
                                                    ref={(videoEl) => {
                                                        if (videoEl && participant.stream) {
                                                            videoEl.srcObject = participant.stream;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                    {participant.avatar ? (
                                                        <img
                                                            src={participant.avatar}
                                                            alt={participant.name}
                                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
                                                        />
                                                    ) : (
                                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                                            {participant.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                                                <span className="text-white text-sm font-medium">{participant.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {currentCallId && (
                    <div className="bg-black/80 backdrop-blur-sm border-t border-gray-700">
                        <div className="flex items-center justify-center space-x-4 md:space-x-6 py-3 md:py-4 px-4 md:px-6">
                            <button
                                onClick={toggleMute}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                                title={isMuted ? 'Bật mic' : 'Tắt mic'}
                            >
                                {isMuted ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                            </button>
                            {callType === 'video' && (
                                <button
                                    onClick={toggleVideo}
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isVideoOff
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                    title={isVideoOff ? 'Bật camera' : 'Tắt camera'}
                                >
                                    {isVideoOff ? <VideoOff className="w-4 h-4 md:w-5 md:h-5" /> : <Video className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            )}

                            {/* End Call */}
                            <button
                                onClick={endCall}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                                title="Kết thúc cuộc gọi"
                            >
                                <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default VideoCall;