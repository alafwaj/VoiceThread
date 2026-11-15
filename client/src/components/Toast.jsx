// A short message at the bottom of the screen, read out by screen readers.
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const show = useCallback((text) => {
    setMessage(text);
    clearTimeout(window.__vtToast);
    window.__vtToast = setTimeout(() => setMessage(''), 2600);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-show={message ? 'yes' : 'no'}>
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
