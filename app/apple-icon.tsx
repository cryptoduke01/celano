import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

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
          background: '#0a0a0b',
          borderRadius: 36,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="3" width="4" height="3" fill="#e4e4e7" />
          <rect x="12" y="3" width="4" height="3" fill="#e4e4e7" />
          <rect x="20" y="3" width="4" height="3" fill="#e4e4e7" />
          <path
            d="M7 8 Q7 20 14 20 Q21 20 21 12"
            stroke="#f4f4f5"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="10" y="11" width="3" height="3" fill="#0a0a0b" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
