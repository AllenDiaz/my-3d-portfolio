import { ImageResponse } from 'next/og';

/** Generated Apple touch icon — matches the favicon "AD" mark. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          fontSize: 84,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        AD
      </div>
    ),
    { ...size }
  );
}
