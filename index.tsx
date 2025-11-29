import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LucideProps } from 'lucide-react';

// Fix for Lucide icons sometimes complaining about default imports in certain strict environments
// This is a safety measure for the generated environment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconWrapper: React.FC<LucideProps> = (props) => <svg {...props} />;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
