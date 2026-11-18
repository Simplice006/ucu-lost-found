import { LOCATION_GROUPS } from '../constants';

// <option>s grouped by type of place, so a long list stays easy to scan.
export default function LocationOptions() {
  return LOCATION_GROUPS.map((g) => (
    <optgroup key={g.label} label={g.label}>
      {g.places.map((p) => <option key={p}>{p}</option>)}
    </optgroup>
  ));
}
