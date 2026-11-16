// Shared lists used by the forms and the search filters.
export const CATEGORIES = [
  'Keys', 'Phone', 'Laptop or tablet', 'Charger or cable', 'Wallet or purse',
  'ID or student card', 'Bag', 'Books or notebooks', 'Clothing', 'Water bottle', 'Other',
];
export const LOCATIONS = [
  'N5B lecture room', 'Hamu Mukasa Library', 'Touch of Class Restaurant', 'Premium Hostel',
  'Main Chapel', 'Sports ground', 'Administration block', 'Parking area', 'Other campus location',
];
export const todayISO = () => new Date().toISOString().slice(0, 10);
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
