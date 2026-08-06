'use client';
import { useState } from 'react';
import { WeddingConfig } from '@/lib/db';
import styles from './FloatingNav.module.css';
import RsvpPopup from '@/components/popups/RsvpPopup';
import CalendarPopup from '@/components/popups/CalendarPopup';
import ContactPopup from '@/components/popups/ContactPopup';
import LocationPopup from '@/components/popups/LocationPopup';
import MoneyPopup from '@/components/popups/MoneyPopup';
import GiftPopup from '@/components/popups/GiftPopup';
import { Gift } from '@/lib/db';

type PopupKey = 'rsvp' | 'calendar' | 'contact' | 'location' | 'money' | 'gift' | null;

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; coupleId: string; visible: boolean; onUpdateGifts?: (g: Gift[]) => void; lang?: Lang; textOverrides?: Record<string, string>; }

export default function FloatingNav({ config, coupleId, visible, onUpdateGifts, lang, textOverrides }: Props) {
  const [active, setActive] = useState<PopupKey>(null);
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);

  const ft = config.featureToggles || {};
  if (ft.enableFloatingNav === false) return null;

  const NAV_ITEMS = [
    { key: 'rsvp',     icon: <RsvpIcon />,     label: t.navRsvp,     enabled: ft.enableRsvp !== false },
    { key: 'calendar', icon: <CalIcon />,       label: t.navCalendar, enabled: ft.enableCalendar !== false },
    { key: 'contact',  icon: <PhoneIcon />,     label: t.navContact,  enabled: ft.enableContact !== false },
    { key: 'location', icon: <PinIcon />,       label: t.navLocation, enabled: ft.enableLocation !== false },
    { key: 'money',    icon: <MoneyIcon />,    label: t.navMoney,    enabled: ft.enableMoney !== false },
    { key: 'gift',     icon: <GiftIcon />,      label: t.navGift,     enabled: ft.enableGift !== false },
  ].filter(i => i.enabled);

  function open(key: PopupKey) { setActive(key); }
  function close() { setActive(null); }

  return (
    <>
      <nav className={`floating-nav ${!visible ? 'hidden' : ''}`} role="navigation" aria-label="Navigasi Jemputan">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`nav-btn ${active === item.key ? 'active' : ''}`}
            onClick={() => open(item.key as PopupKey)}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {active === 'rsvp'     && <RsvpPopup     config={config} coupleId={coupleId} onClose={close} lang={currentLang} textOverrides={textOverrides} />}
      {active === 'calendar' && <CalendarPopup config={config} onClose={close} lang={currentLang} textOverrides={textOverrides} />}
      {active === 'contact'  && <ContactPopup  config={config} onClose={close} lang={currentLang} textOverrides={textOverrides} />}
      {active === 'location' && <LocationPopup config={config} onClose={close} lang={currentLang} textOverrides={textOverrides} />}
      {active === 'money'    && <MoneyPopup    config={config} onClose={close} lang={currentLang} textOverrides={textOverrides} />}
      {active === 'gift'     && <GiftPopup     config={config} coupleId={coupleId} onClose={close} onUpdateGifts={onUpdateGifts} lang={currentLang} textOverrides={textOverrides} />}
    </>
  );
}

function RsvpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function CalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function MoneyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function GiftIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
}
