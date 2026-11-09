import { ImageResponse } from 'next/og'

export const alt = 'TailFlow — AI-ready team communication'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
          padding: '68px 76px',
          color: '#f6efe2',
          background: 'linear-gradient(135deg, #201b16 0%, #3b2c1d 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 13,
              background: '#c76a1a',
              color: '#fffaf2',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.6 }}>
            TailFlow
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 680 }}>
            <p
              style={{
                margin: 0,
                color: '#e5a56e',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              Team communication, in sync
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 66,
                lineHeight: 1.05,
                letterSpacing: -3,
                fontWeight: 650,
              }}
            >
              Keep the work moving.
            </h1>
            <p style={{ margin: 0, color: '#d4c9ba', fontSize: 23, lineHeight: 1.45 }}>
              Channels, threads and AI summaries for focused teams.
            </p>
          </div>

          <div
            style={{
              width: 280,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 18,
              border: '1px solid #6c5948',
              borderRadius: 20,
              background: '#2b241d',
            }}
          >
            <div style={{ color: '#e5a56e', fontSize: 14, fontWeight: 700 }}>
              # product-launch
            </div>
            <div
              style={{
                height: 58,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                borderRadius: 12,
                background: '#3b3025',
                color: '#f6efe2',
                fontSize: 14,
              }}
            >
              One clear place for the next step.
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#493420',
                color: '#f3c18f',
                fontSize: 13,
              }}
            >
              Thread summary ready
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#db8b48' }} />
          <span style={{ color: '#cbbcac', fontSize: 16 }}>
            A calmer workspace for product teams
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
