import { ImageResponse } from 'next/og';

/**
 * Generated Open Graph share card (file-based metadata — overrides config images).
 * Design echoes the site's "late-night dev studio" art direction:
 * deep indigo base, teal code accents, warm amber lamp glow.
 */
export const alt = 'Allen Diaz — Full-Stack & AI Engineer who builds with agentic AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BINARY_ROW = '01001000 01101001 00100000 01001001 00100111 01101101 00100000';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0a0a14',
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 75% 20%, rgba(251, 191, 36, 0.10), transparent), radial-gradient(ellipse 70% 70% at 15% 90%, rgba(45, 212, 191, 0.10), transparent), linear-gradient(160deg, #0d0d1f 0%, #0a0a14 60%, #06060c 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* faint binary texture, top */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 28,
            left: 80,
            right: 80,
            color: 'rgba(45, 212, 191, 0.14)',
            fontSize: 18,
            letterSpacing: 4,
          }}
        >
          <span>{BINARY_ROW + BINARY_ROW}</span>
        </div>

        {/* header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            AD
          </div>
          <div
            style={{
              display: 'flex',
              color: '#94a3b8',
              fontSize: 26,
              letterSpacing: 2,
            }}
          >
            PORTFOLIO · INTERACTIVE 3D OFFICE
          </div>
        </div>

        {/* main block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 92,
              fontWeight: 800,
              color: 'white',
              letterSpacing: -2,
            }}
          >
            Allen Diaz
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 38,
              color: '#cbd5e1',
              fontWeight: 400,
            }}
          >
            Full-Stack &amp; AI Engineer · builds with agentic AI
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
            {['Claude Code', 'LLM Agents', 'RAG', 'MCP', 'Next.js', 'Python'].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    display: 'flex',
                    padding: '10px 22px',
                    borderRadius: 12,
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    backgroundColor: 'rgba(148, 163, 184, 0.08)',
                    color: '#e2e8f0',
                    fontSize: 24,
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                width: 12,
                height: 12,
                borderRadius: 12,
                backgroundColor: '#34d399',
              }}
            />
            <div style={{ display: 'flex', color: '#94a3b8', fontSize: 24 }}>
              Available for opportunities
            </div>
          </div>
          <div style={{ display: 'flex', color: '#fbbf24', fontSize: 24 }}>
            Explore the 3D office →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
