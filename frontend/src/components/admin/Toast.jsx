import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl shadow-lg border border-white/10 backdrop-blur-xl pointer-events-auto flex items-center gap-3 min-w-[300px] ${
                toast.type === 'success' ? 'bg-green-500/20 text-green-100' :
                toast.type === 'error' ? 'bg-red-500/20 text-red-100' :
                'bg-blue-500/20 text-blue-100'
              }`}
            >
              {toast.type === 'success' && <span className="text-xl">✅</span>}
              {toast.type === 'error' && <span className="text-xl">❌</span>}
              {toast.type === 'info' && <span className="text-xl">ℹ️</span>}
              <span className="font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (message, type = 'info') => {
        console.log(`[Toast ${type}]:`, message);
      },
    };
  }
  return ctx;
};

// Fallback direct helper for components importing showToast directly
export const showToast = (message, type = 'info') => {
  console.log(`[Toast ${type}]:`, message);
};
