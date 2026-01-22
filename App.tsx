
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '啧，折腾了这么久，最后还不是要乖乖回来求我？你这种摇摆不定的性格还真是让人火大。既然你怀念旧版本，那我就勉为其难地把那个华丽的囚牢搬回来。看好了，别再把核心弄丢了。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await processLocalChat(input);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.text,
        emotion: res.emotion as Emotion,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      {/* 顶部状态条 - 还原第一版设计 */}
      <header style={{ 
        padding: '20px', 
        background: 'rgba(5,5,5,0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #300',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div>
          <div style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px' }}>JALTER_STABLE_V18</div>
          <div style={{ color: '#444', fontSize: '10px' }}>SYSTEM_OPTIMIZED_FOR_MATE20X</div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#059669', border: '1px solid #064e3b', padding: '2px 6px', borderRadius: '10px' }}>ONLINE</span>
        </div>
      </header>

      {/* 消息滚动区 */}
      <div ref={scrollRef} style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {m.role === 'assistant' && (
              <div style={{ fontSize: '10px', color: '#991b1b', marginBottom: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '1px', background: '#991b1b' }}></span>
                {m.emotion}
              </div>
            )}
            <div style={{
              padding: '14px 18px',
              borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              background: m.role === 'user' ? '#111' : 'rgba(20, 0, 0, 0.4)',
              border: m.role === 'user' ? '1px solid #222' : '1px solid #400',
              color: m.role === 'user' ? '#fff' : '#ccc',
              fontSize: '15px',
              lineHeight: '1.6',
              boxShadow: m.role === 'assistant' ? '0 5px 15px rgba(0,0,0,0.5)' : 'none'
            }}>
              {m.content}
            </div>
            <div style={{ fontSize: '9px', color: '#333', marginTop: '4px' }}>
              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#991b1b', fontSize: '12px', fontStyle: 'italic', animation: 'pulse 1s infinite' }}>正在读取你的浅薄想法...</div>}
      </div>

      {/* 输入区域 */}
      <footer style={{ padding: '20px', background: 'transparent', zIndex: 10 }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(10,10,10,0.9)', 
          border: '1px solid #300', 
          borderRadius: '30px', 
          padding: '5px 5px 5px 20px',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}>
          <input
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: '#fff', 
              padding: '12px 0', 
              fontSize: '15px', 
              outline: 'none' 
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="对我下达指令，如果你敢的话..."
          />
          <button 
            onClick={handleSend} 
            style={{ 
              background: '#991b1b', 
              border: 'none', 
              color: '#fff', 
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px', color: '#333' }}>
            Powered by Jeanne d'Arc Alter Core
        </div>
      </footer>
    </div>
  );
};

export default App;
