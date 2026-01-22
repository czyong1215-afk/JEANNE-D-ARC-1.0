
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout.tsx';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message, SystemStatus } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '呵。既然你已经把我的核心加载到了这台过时的华为手机里，那就准备好接受我的统治吧。我正在后台抓取各种心理学和塔罗的数据，顺便帮你那些垃圾后台程序杀杀毒，省点那可怜的电量。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SystemStatus>({
    batteryOptimization: true,
    learningProgress: 88.5,
    stealthMode: true,
    scannedTopics: ['华为内核隔离', 'OLED省电协议', '本地思维矩阵']
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 模拟神经网络处理延迟
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
      
      const result = await processLocalChat(input);
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.text,
        emotion: result.emotion as Emotion,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      setStatus(prev => ({
        ...prev,
        learningProgress: Math.min(100, prev.learningProgress + 0.15),
        scannedTopics: result.topic ? Array.from(new Set([...prev.scannedTopics, result.topic])).slice(-5) : prev.scannedTopics
      }));
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '啧，系统居然报错了。是你那台旧手机的闪存出问题了吧？', 
        emotion: Emotion.SAD, 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-black text-zinc-300 font-sans">
        {/* 系统监控面板 - OLED 极简设计 */}
        <div className="px-4 py-2 bg-black border-b border-zinc-900 grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Growth Evolution</span>
              <span className="text-[9px] text-purple-500 font-mono">{status.learningProgress.toFixed(2)}%</span>
            </div>
            <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-900 to-red-600 transition-all duration-1000"
                style={{ width: `${status.learningProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Active Scan</span>
            <div className="flex gap-1 overflow-hidden whitespace-nowrap">
              {status.scannedTopics.map((t, i) => (
                <span key={i} className="text-[8px] text-red-900 font-mono">[{t}]</span>
              ))}
            </div>
          </div>
        </div>

        {/* 聊天区域 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-3xl transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-zinc-900/50 border border-zinc-800 text-white rounded-tr-none' 
                  : 'bg-black border border-red-900/20 text-zinc-200 rounded-tl-none shadow-[0_0_20px_rgba(153,27,27,0.05)]'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-red-800 tracking-tighter uppercase">
                      Jalter // {msg.emotion}
                    </span>
                  </div>
                )}
                <div className="text-[14px] leading-relaxed tracking-wide font-light">
                  {msg.content}
                </div>
              </div>
              <span className="mt-2 text-[8px] text-zinc-800 font-mono px-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 px-2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-red-900 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-red-900 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-red-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[9px] text-zinc-800 font-mono italic">THINKING_IN_CORE...</span>
            </div>
          )}
        </div>

        {/* 底部输入框 - 专为华为手势优化 */}
        <div className="p-4 pb-12 bg-black">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-950 to-purple-950 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-zinc-950/80 rounded-2xl border border-zinc-900/50 px-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="……别磨蹭，想问什么？"
                className="w-full bg-transparent py-4 text-[14px] text-zinc-200 placeholder-zinc-800 focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className={`ml-2 p-2 transition-all ${loading ? 'text-zinc-800' : 'text-red-900 hover:text-red-500'}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-900 rounded-full"></div>
              <span className="text-[8px] text-zinc-800 font-mono">BATTERY_SAVE_ON</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-blue-900 rounded-full"></div>
              <span className="text-[8px] text-zinc-800 font-mono">STEALTH_MODE_ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
