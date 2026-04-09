import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Swipe right from near the left edge to navigate back to home
export function useSwipeBack(target = '/') {
  const navigate = useNavigate();

  useEffect(() => {
    let startX = null;
    let startY = null;
    let startT = 0;

    function onStart(e) {
      const t = e.touches[0];
      if (t.clientX > 40) { startX = null; return; }
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
    }
    function onEnd(e) {
      if (startX == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      const dt = Date.now() - startT;
      if (dx > 80 && dy < 60 && dt < 600) {
        navigate(target);
      }
      startX = null;
    }

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [navigate, target]);
}
