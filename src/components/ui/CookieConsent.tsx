import { useEffect, useState } from 'react';
import { Button } from './Button';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(localStorage.getItem('rovik-cookie-consent') !== 'yes'), []);
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-3xl border border-soft bg-card p-4 shadow-glass md:flex md:items-center md:justify-between md:gap-4">
      <p className="text-sm text-muted">ROVIK uses essential cookies for security and preferences. Analytics events can be connected through your chosen provider.</p>
      <div className="mt-3 flex gap-2 md:mt-0">
        <Button variant="secondary" onClick={() => { localStorage.setItem('rovik-cookie-consent', 'yes'); setShow(false); }}>Accept</Button>
      </div>
    </div>
  );
}
