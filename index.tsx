
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
    try {
        const root = createRoot(rootElement);
        root.render(React.createElement(App));
        console.log("Jalter: 18.3.1 Linked.");
    } catch (e) {
        console.error("Critical Start Error:", e);
    }
}
