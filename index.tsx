
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("无法找到根节点，你这白痴是不是把 index.html 改坏了？");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // 标记加载成功
    console.log("Jalter Core mounted successfully.");
  } catch (e) {
    console.error("Mounting error:", e);
  }
}
