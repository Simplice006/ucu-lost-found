// Small inline icon set (no extra dependency). All icons are decorative: the text next to them carries the meaning.
const base = {
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false',
};
const make = (paths) => function Icon({ size, className, ...rest }) {
  const props = { ...base, ...rest };
  if (size) { props.width = size; props.height = size; }
  return <svg {...props} className={className}>{paths}</svg>;
};

export const IconHome = make(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>);
export const IconGrid = make(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
export const IconEdit = make(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
export const IconCheckCircle = make(<><circle cx="12" cy="12" r="9.5" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></>);
export const IconInfo = make(<><circle cx="12" cy="12" r="9.5" /><path d="M12 11v5.5" /><path d="M12 7.6v.1" /></>);
export const IconAlert = make(<><circle cx="12" cy="12" r="9.5" /><path d="M12 7.5v5.5" /><path d="M12 16.4v.1" /></>);
export const IconUser = make(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const IconUserPlus = make(<><circle cx="10" cy="8" r="4" /><path d="M2.5 21a7.5 7.5 0 0 1 12-6" /><path d="M19 14v6M16 17h6" /></>);
export const IconSearch = make(<><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-4.3-4.3" /></>);
export const IconPin = make(<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const IconCalendar = make(<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
export const IconClock = make(<><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5.2l3.4 2" /></>);
export const IconTag = make(<><path d="M3 12.2V4a1 1 0 0 1 1-1h8.2a1 1 0 0 1 .7.3l7.8 7.8a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0L3.3 12.9a1 1 0 0 1-.3-.7Z" /><path d="M7.8 7.8v.1" /></>);
export const IconList = make(<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.1M3.5 12h.1M3.5 18h.1" /></>);
export const IconKeyboard = make(<><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M6.5 10h.1M10 10h.1M13.5 10h.1M17 10h.1M7 14.5h10" /></>);
export const IconReset = make(<><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3.5 4v4.5H8" /></>);
export const IconArrowRight = make(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const IconChevronDown = make(<path d="m6 9 6 6 6-6" />);
export const IconBox = make(<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z" /><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" /></>);
export const IconLogout = make(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>);
export const IconInbox = make(<><path d="M3 13.5 6 5h12l3 8.5" /><path d="M3 13.5V19a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5.5h-5.5a3.5 3.5 0 0 1-7 0Z" /></>);
export const IconShield = make(<path d="M12 3 4.5 6v5.5c0 4.5 3.1 8 7.5 9.5 4.4-1.5 7.5-5 7.5-9.5V6Z" />);
export const IconMail = make(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>);
export const IconLock = make(<><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const IconFile = make(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>);
export const IconArrowLeft = make(<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>);

// Shield logo drawn for this project (not the official university crest).
export function Logo({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 56" aria-hidden="true" focusable="false" className="logo-mark">
      <defs>
        <linearGradient id="logoFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" /><stop offset="1" stopColor="#3b1180" />
        </linearGradient>
      </defs>
      <path d="M24 2 5 8.5v17C5 38.5 13 49 24 54c11-5 19-15.500 19-28.500v-17Z" fill="url(#logoFill)" stroke="#d8c4ff" strokeWidth="2" />
      <circle cx="24" cy="23" r="7.500" fill="none" stroke="#fff" strokeWidth="2.600" />
      <path d="m29.500 28.500 6 6" stroke="#fff" strokeWidth="2.600" strokeLinecap="round" />
      <path d="M14 40c3 2.500 6.500 4 10 4s7-1.500 10-4" stroke="#f5c451" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
