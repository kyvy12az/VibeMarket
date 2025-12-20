import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessageToGroq } from "../services/groqService";
import { useUIStore } from "../store/uiStore";
type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const ChatBot = () => {
  const isCommentModalOpen = useUIStore((state) => state.isCommentModalOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isCommentModalOpen) return null;

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content:
          "Xin chào! Tôi là VibeBot 🎯 - trợ lý mua sắm thông minh của VibeMarket. Tôi có thể giúp bạn:\n\n✨ Tìm kiếm sản phẩm phù hợp\n💡 Tư vấn mua sắm\n🎁 Giới thiệu ưu đãi hot\n📦 Theo dõi đơn hàng\n\nHãy hỏi tôi bất cứ điều gì về mua sắm nhé!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageToGroq(inputValue);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Có lỗi khi gọi api chat bot:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "VibeBot đang bị lỗi, bạn quay lại sau nhé!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && !isCommentModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-background dark:bg-card rounded-2xl shadow-2xl overflow-hidden border border-border backdrop-blur-xl"
          >
            <div className="p-4 bg-gradient-to-r from-primary via-purple-600 to-accent text-white flex justify-between items-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              />
              <div className="flex items-center space-x-2 relative z-10">
                <motion.div 
                  className="bg-white p-1 rounded-full shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <img 
                    src="/images/vibebot/logo.png" 
                    alt="VibeMarket Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">VibeBot</h3>
                  <p className="text-xs text-white/80">Trợ lý AI mua sắm</p>
                </div>
              </div>
              <motion.button
                onClick={closeChat}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200 relative z-20"
                aria-label="Close chat"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div
              className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-secondary/30 to-background dark:from-secondary/10 dark:to-card"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--primary)) transparent",
              }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`inline-block p-3.5 rounded-2xl max-w-[85%] shadow-md ${message.sender === "user"
                      ? "bg-gradient-to-br from-primary via-purple-600 to-accent text-white"
                      : "bg-card dark:bg-secondary/50 text-foreground border border-border backdrop-blur-sm"
                      }`}
                    style={{
                      borderTopLeftRadius:
                        message.sender === "bot" ? "0" : undefined,
                      borderTopRightRadius:
                        message.sender === "user" ? "0" : undefined,
                    }}
                  >
                    <p className="whitespace-pre-wrap text-sm md:text-base font-medium leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1.5 ${message.sender === "user"
                        ? "text-white/80"
                        : "text-muted-foreground"
                        }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="text-left mb-4">
                  <div
                    className="inline-block p-4 rounded-2xl bg-card dark:bg-secondary/50 text-foreground shadow-md border border-border backdrop-blur-sm"
                    style={{ borderTopLeftRadius: 0 }}
                  >
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          repeatDelay: 0.1,
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-primary"
                      ></motion.div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          delay: 0.2,
                          repeatDelay: 0.1,
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-purple-500"
                      ></motion.div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          delay: 0.4,
                          repeatDelay: 0.1,
                        }}
                        className="w-2.5 h-2.5 rounded-full bg-accent"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-background dark:bg-card border-t border-border"
            >
              <div className="flex items-center bg-secondary/30 dark:bg-secondary/20 rounded-xl overflow-hidden p-1 border-2 border-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2.5 bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${isLoading || !inputValue.trim()
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-primary via-purple-600 to-accent text-white shadow-lg"
                    }`}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        transition={{ duration: 0.2 }}
        className="p-3 rounded-full shadow-lg text-white flex items-center justify-center relative bg-white border border-gray-100"
      >
        <img 
          src="/images/vibebot/logo.png" 
          alt="VibeMarket Logo" 
          className="relative z-10"
          style={{ width: "22px", height: "22px" }}
        />
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
