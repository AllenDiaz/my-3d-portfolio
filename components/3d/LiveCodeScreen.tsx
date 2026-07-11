import type { Project } from '@/data/projects';

/**
 * Painter for the hero monitor's "live terminal" screen texture: pre-baked
 * pseudo-code themed to the project types out character by character with a
 * blinking block cursor, scrolls when full, holds briefly, then loops.
 *
 * Deliberately deterministic in `timeSec` (no internal mutable state) so the
 * redraw cadence can be tier-gated (screenAnimationHz) without drift. Kept
 * separate from Computer.tsx so the material can change without touching the
 * terminal content.
 */

const CANVAS_W = 512;
const CANVAS_H = 320;
const HEADER_H = 44;
const LINE_H = 22;
const CHARS_PER_SEC = 18;
const HOLD_SEC = 3.5;
const VISIBLE_ROWS = Math.floor((CANVAS_H - HEADER_H - 16) / LINE_H);

const BG = '#0a1420';
const HEADER_BG = '#0e1c2e';
const TEXT = '#22d3a0';
const DIM = '#178f6e';
const ACCENT = '#6ab0f3';

export function createTerminalPainter(project: Project): (ctx: CanvasRenderingContext2D, timeSec: number) => void {
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const techs = project.technologies.slice(0, 4);
  const lines = [
    `$ npm run dev`,
    `▸ compiling ${slug} ...`,
    ``,
    `const stack = [${techs.map((t) => `'${t}'`).join(', ')}];`,
    ``,
    `export async function ship(idea: Idea) {`,
    `  const feature = await build(idea, { stack });`,
    `  await test(feature);      // ✓ 42 passing`,
    `  return deploy(feature, { target: 'prod' });`,
    `}`,
    ``,
    `▸ ready in 312ms — watching for changes`,
  ];

  const totalChars = lines.reduce((sum, l) => sum + Math.max(l.length, 1), 0);
  const cycleSec = totalChars / CHARS_PER_SEC + HOLD_SEC;

  return function paint(ctx: CanvasRenderingContext2D, timeSec: number) {
    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Header bar: project title as the "editor tab"
    ctx.fillStyle = HEADER_BG;
    ctx.fillRect(0, 0, CANVAS_W, HEADER_H);
    ctx.fillStyle = ACCENT;
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`● ${project.title}`, 16, 28);
    if (project.featured) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('★ FEATURED', CANVAS_W - 16, 28);
    }

    // How many characters have been "typed" this cycle
    const t = timeSec % cycleSec;
    const typed = Math.min(Math.floor(t * CHARS_PER_SEC), totalChars);

    // Materialize typed lines (empty lines count as one typed char)
    const done: string[] = [];
    let remaining = typed;
    for (const line of lines) {
      const cost = Math.max(line.length, 1);
      if (remaining >= cost) {
        done.push(line);
        remaining -= cost;
      } else {
        done.push(line.slice(0, remaining));
        break;
      }
    }

    // Scroll: keep the last VISIBLE_ROWS lines
    const visible = done.slice(-VISIBLE_ROWS);
    const cursorOn = Math.floor(timeSec * 2) % 2 === 0;

    ctx.textAlign = 'left';
    ctx.font = '14px monospace';
    visible.forEach((line, i) => {
      const y = HEADER_H + 24 + i * LINE_H;
      ctx.fillStyle = line.startsWith('▸') || line.startsWith('$') ? DIM : TEXT;
      ctx.fillText(line, 16, y);
      // Blinking block cursor at the end of the last line
      if (i === visible.length - 1 && cursorOn) {
        const w = ctx.measureText(line).width;
        ctx.fillStyle = TEXT;
        ctx.fillRect(16 + w + 3, y - 12, 8, 15);
      }
    });
  };
}
