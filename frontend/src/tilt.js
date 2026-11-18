// 3D "tilt" effect: the element leans toward the mouse and a light follows the cursor.
// Only for a real mouse, and never when the person asked their system for reduced motion.
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function tiltHandlers(max = 7) {
  return {
    onPointerMove(e) {
      if (e.pointerType !== 'mouse' || reduced()) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
    },
    onPointerLeave(e) {
      const el = e.currentTarget;
      ['--rx', '--ry', '--gx', '--gy'].forEach((p) => el.style.removeProperty(p));
    },
  };
}

// Parallax for the hero: layers at different depths move with the mouse (values from -1 to 1 on CSS variables).
export function parallaxHandlers() {
  return {
    onPointerMove(e) {
      if (e.pointerType !== 'mouse' || reduced()) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    },
    onPointerLeave(e) {
      e.currentTarget.style.removeProperty('--mx');
      e.currentTarget.style.removeProperty('--my');
    },
  };
}
