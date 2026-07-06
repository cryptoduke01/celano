import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  // Celano monogram — clean yellow "C" on near-black. Matches the nav mark.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: 40,
        }}
      >
        <svg width="118" height="118" viewBox="0 0 36 36" fill="none">
          <path
            d="M11 11 Q11 25 18 25 Q25 25 25 17.5"
            stroke="#eab308"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="15" y="16" width="3.5" height="3.5" rx="0.5" fill="#0a0a0a" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
