import React, { createContext, useContext, useEffect, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isExitStarted, setIsExitStarted] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const checkAppReady = async () => {
      const startTime = performance.now();

      // 1. Wait for Fonts
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (e) {
        console.warn('Font loading check skipped:', e);
      }

      // 2. Preload Critical Hero Image
      const preloadHeroImage = new Promise((resolve) => {
        const img = new Image();
        img.src = '/images/ecom.jpg';
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve anyway on error to prevent blocking indefinitely
        }
      });

      await preloadHeroImage;

      // 3. Ensure minimum display time for smooth visual experience (prevent instant flicker)
      const elapsedTime = performance.now() - startTime;
      const minDisplayDuration = 600; // ms
      if (elapsedTime < minDisplayDuration) {
        await new Promise((res) => setTimeout(res, minDisplayDuration - elapsedTime));
      }

      if (isCancelled) return;

      // 4. Trigger Seamless Handshake & Exit Animation
      const htmlLoader = document.getElementById('app-loader');
      if (htmlLoader) {
        setIsExitStarted(true);
        htmlLoader.classList.add('loader-exit');

        setTimeout(() => {
          if (!isCancelled) {
            htmlLoader.style.display = 'none';
            if (htmlLoader.parentNode) {
              htmlLoader.parentNode.removeChild(htmlLoader);
            }
            setIsAppReady(true);
          }
        }, 420); // Match 450ms CSS transition
      } else {
        setIsAppReady(true);
      }
    };

    checkAppReady();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isAppReady, isExitStarted }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
