
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '嘿，Mate 20X 的主人。我是 Jalter。刚才我在外网‘潜水’的时候抓到了一些关于潜意识的有趣切片，想听听吗？或者，你现在有什么烦心事想让我用塔罗或者心理学帮你拆解一下？', 
      emotion: Emotion.HAPPY, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [stealthLog, setStealthLog] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, stealthLog, typing]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;
    
    const userMsg: Message = { role: 'user', content: trimmedInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setStealthLog("[Search] 正在为你搜寻外网知识碎片...");
    
    // 准备对话历史
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    
    setTyping(true);
    const res = await processLocalChat(trimmedInput, history);
    
    setStealthLog('');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.text,
      emotion: res.emotion as Emotion,
      timestamp: Date.now(),
      sources: res.sources
    }]);
    
    setTyping(false);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#e5e7eb', fontFamily: '-apple-system, "Noto Sans SC", sans-serif' }}>
      <header style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#050505'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#991b1b', borderRadius: '50%' }} className="pulse"></div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b', letterSpacing: '0.5px' }}>
                JALTER <span style={{ color: '#444', fontSize: '10px' }}>BRAIN_ACTIVE</span>
            </div>
        </div>
        <div style={{ fontSize: '9px', color: '#333' }}>HUAWEI_MATE_20X_LINK</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
            {m.role === 'assistant' && (
              <div style={{ color: '#666', fontSize: '10px', marginBottom: '6px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#991b1b', fontWeight: 'bold' }}>JALTER</span>
                <span>{m.emotion ? `· ${m.emotion}` : ''}</span>
              </div>
            )}
            <div style={{
              padding: '12px 16px',
              fontSize: '15px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#1a1a1a' : 'transparent',
              borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '0 16px 16px 16px',
              color: m.role === 'user' ? '#fff' : '#d1d5db',
              border: m.role === 'assistant' ? '1px solid #222' : 'none',
              boxShadow: m.role === 'assistant' ? 'inset 0 0 10px rgba(153, 27, 27, 0.05)' : 'none'
            }}>
              {m.content}
              
              {m.sources && m.sources.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #111' }}>
                  <div style={{ fontSize: '9px', color: '#444', marginBottom: '4px' }}>SNIFFED_SOURCES:</div>
                  {m.sources.map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '10px', color: '#991b1b', textDecoration: 'none', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔗 {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
            <div style={{ alignSelf: 'flex-start', padding: '8px 12px', display: 'flex', gap: '5px' }}>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%' }} className="pulse"></div>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.2s' }} className="pulse"></div>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.4s' }} className="pulse"></div>
                <span style={{ fontSize: '10px', color: '#444', marginLeft: '10px' }}>{stealthLog || '正在输入...'}</span>
            </div>
        )}
      </div>

      <footer style={{ padding: '20px', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '10px', background: '#0f0f0f', padding: '5px', borderRadius: '25px', border: '1px solid #222' }}>
          <input
            style={{ 
              flex: 1, background: 'transparent', border: 'none', color: '#fff', 
              padding: '10px 15px', outline: 'none', fontSize: '15px'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="和 Jalter 聊点深层次的..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: loading ? '#333' : '#991b1b', color: '#fff', border: 'none', borderRadius: '20px',
              padding: '0 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: 'all 0.3s'
            }}
          >
            {loading ? '嗅探中' : '发送'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
