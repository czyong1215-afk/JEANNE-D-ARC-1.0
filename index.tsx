
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// 向 index.html 的控制台发送信号
const updateStatus = (text: string, isError = false) => {
    const statusLog = document.getElementById('status-log');
    if (statusLog) {
        statusLog.innerText = text;
        if (isError) statusLog.style.color = '#991b1b';
    }
};

const rootElement = document.getElementById('root');

if (!rootElement) {
    updateStatus("FAILED: ROOT_NOT_FOUND", true);
} else {
    try {
        const root = createRoot(rootElement);
        root.render(<App />);
        // 成功后由 App 内核接管 UI
        console.log("Jalter Core: Matrix Injected.");
    } catch (err: any) {
        updateStatus("RUNTIME_ERR: " + err.message, true);
        console.error(err);
    }
}
