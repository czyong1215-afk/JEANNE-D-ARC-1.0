
import React, { useState, useEffect, useRef } from 'react';
import { askJalter } from './services/jalterNeuralService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '隐身链路已稳定。我已经同步了外部心理学知识库，正在实时监听全球网络波动。杂碎，别盯着我看，有问题就快问。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 核心修复：组件挂载后强行清除加载屏幕
  useEffect(() => {
    const hideLoader = () => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    };
    
    // 立即执行一次
    hideLoader();
    
    // 并在消息更新时确保滚动
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;
    
    const userMsg: Message = { role: 'user', content: trimmedInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const res = await askJalter(trimmedInput);
        const assistantMsg: Message = {
          role: 'assistant',
          content: String(res.text || "切，网络波动...我没听清。"),
          emotion: res.emotion,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
        console.error("Neural Link Failed:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#ccc' }}>
      <header style={{ 
        padding: '12px 20px', 
        borderBottom: '1px solid #300',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #0a0000, #000)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#991b1b', letterSpacing: '1px' }}>
            JALTER.CORE.V5 <span style={{ fontSize: '9px', opacity: 0.5 }}>[NET_ACTIVE]</span>
        </div>
        <div style={{ fontSize: '10px', color: '#444', fontClassName: 'monospace' }}>
            {loading ? 'BUSY...' : 'IDLE'}
        </div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', scrollBehavior: 'smooth' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '24px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '88%',
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#111' : 'transparent',
              borderLeft: m.role === 'assistant' ? '2px solid #991b1b' : 'none',
              borderRight: m.role === 'user' ? '2px solid #333' : 'none',
              color: m.role === 'user' ? '#eee' : '#bbb',
              boxShadow: m.role === 'user' ? '0 4px 15px rgba(0,0,0,0.5)' : 'none'
            }}>
              {m.role === 'assistant' && (
                <div style={{ color: '#991b1b', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', opacity: 0.8 }}>
                  [{m.emotion || 'NORMAL'}]
                </div>
              )}
              {String(m.content)}
            </div>
          </div>
        ))}
        {loading && (
            <div style={{ padding: '0 15px', color: '#444', fontSize: '11px', fontStyle: 'italic' }}>
                正在黑入知识库抓取信息...
            </div>
        )}
      </div>

      <footer style={{ padding: '15px', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ 
              flex: 1, 
              background: '#0a0a0a', 
              border: '1px solid #222', 
              color: '#fff', 
              padding: '14px', 
              outline: 'none', 
              fontSize: '14px',
              borderRadius: '2px'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="提问（心理/塔罗/代码）..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: loading ? '#200' : '#400', 
              color: loading ? '#444' : '#991b1b', 
              border: `1px solid ${loading ? '#200' : '#991b1b'}`,
              padding: '0 20px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'WAIT' : 'EXEC'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
