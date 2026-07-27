'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está instalada (Standalone Mode)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMedia || isIOSStandalone);
    };

    checkStandalone();

    // 2. Detectar plataforma (iOS y Android)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // 3. Capturar el evento `beforeinstallprompt` (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Escuchar si la app es instalada
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    // Si es iPhone / iPad -> Abre modal personalizado
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Si es Android o Desktop y capturó el evento de Chrome
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else if (isAndroid) {
      // Fallback si la carga asíncrona del Dashboard retrasó el evento nativo
      alert(
        "Para instalar CatalagoX: abre el menú de los 3 puntos (⋮) en Chrome y presiona 'Añadir a la pantalla de inicio'."
      );
    }
  };

  const dismissBanner = () => {
    setIsDismissed(true);
  };

  // El banner se muestra si NO está instalada, NO fue cerrado, y estamos en iOS, Android o hay evento capturado
  const canShowBanner = !isStandalone && !isDismissed && (!!deferredPrompt || isIOS || isAndroid);

  return {
    canShowBanner,
    installApp,
    dismissBanner,
    isIOS,
    showIOSModal,
    setShowIOSModal,
  };
}