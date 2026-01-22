
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChatStream } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '嘿。刚才我在外网‘潜水’的时候，发现不少人都在讨论孤独。你说，这世界上真的有完全不孤独的人吗？嘛，想聊什么就说吧，我听着。', 
      emotion: Emotion.HAPPY, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
  }, [messages, stealthLog, loading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;
    
    const userMsg: Message = { role: 'user', content: trimmedInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStealthLog("[Sniffing] 正在建立高速数据隧道...");

    // 占位消息，用于流式追加内容
    const placeholderMsg: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      emotion: Emotion.HUMOROUS
    };
    
    setMessages(prev => [...prev, placeholderMsg]);
    
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    let accumulatedSources: string[] = [];

    try {
      const stream = processLocalChatStream(trimmedInput, history);
      setStealthLog(''); // 一旦开始流式传输就关闭日志

      for await (const chunk of stream) {
        if (chunk.sources && chunk.sources.length > 0) {
          accumulatedSources = [...new Set([...accumulatedSources, ...chunk.sources])];
        }

        if (chunk.fullText) {
          setMessages(prev => {
            const last = [...prev];
            const assistantMsg = last[last.length - 1];
            assistantMsg.content = chunk.fullText || '';
            assistantMsg.sources = accumulatedSources;
            return last;
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
                JALTER <span style={{ color: '#444', fontSize: '10px' }}>STREAM_BOOST</span>
            </div>
        </div>
        <div style={{ fontSize: '9px', color: '#333' }}>ULTRA_FAST_PROTOCOL</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
            {m.role === 'assistant' && (
              <div style={{ color: '#666', fontSize: '10px', marginBottom: '6px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#991b1b', fontWeight: 'bold' }}>JALTER</span>
                {m.content === '' && <span className="pulse">正在思考...</span>}
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
              minHeight: m.role === 'assistant' && m.content === '' ? '40px' : 'auto'
            }}>
              {m.content}
              
              {m.sources && m.sources.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #111' }}>
                  <div style={{ fontSize: '9px', color: '#444', marginBottom: '4px' }}>SNIFFED_DATA:</div>
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
        {loading && stealthLog && (
            <div style={{ color: '#444', fontSize: '10px', fontStyle: 'italic', paddingLeft: '10px' }}>
                {stealthLog}
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
            placeholder="和 Jalter 极速沟通..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: loading ? '#222' : '#991b1b', color: '#fff', border: 'none', borderRadius: '20px',
              padding: '0 22px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
            }}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
