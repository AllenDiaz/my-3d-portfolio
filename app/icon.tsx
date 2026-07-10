import { ImageResponse } from 'next/og';

/** Generated favicon — the "AD" gradient mark used in the navbar. */
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 14,
          color: 'white',
          fontSize: 30,
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
