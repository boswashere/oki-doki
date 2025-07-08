import { useState, useEffect } from 'react'

export default function x1() {
  const [x2, x3] = useState(true)
  const [x4, x5] = useState('please kill me, Sarah')

  useEffect(() => {
    const x6 = setInterval(() => {
      const x7 = 'please kill me, Sarah'
      const x8 = x7.split('')
      for (let x9 = 0; x9 < x8.length; x9++) {
        if (Math.random() < 0.1) {
          const x10 = String.fromCharCode(33 + Math.floor(Math.random() * 94))
          x8[x9] = x10
        }
      }
      x5(x8.join(''))
    }, 150)
    return () => clearInterval(x6)
  }, [])

  return (
    <>
      <style>{`
        @keyframes x11 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        body, html, #__next {
          margin: 0; padding: 0; height: 100%;
          background: black;
          color: white;
          font-family: monospace, monospace;
          overflow: hidden;
        }
        .x12 {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 1rem;
        }
        .x13 {
          font-size: 2rem;
          animation: x11 3s ease-in-out infinite;
          user-select: none;
          white-space: nowrap;
        }
        .x14 {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #222;
          border: none;
          color: white;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          user-select: none;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .x14:hover {
          opacity: 1;
        }
      `}</style>
      <div className="x12">
        <span className="x13">{x4}</span>
      </div>
      <button className="x14" onClick={() => x3(x2 => !x2)}>
        {x2 ? 'unmute' : 'mute'}
      </button>
      <audio
        src="https://cdn.pixabay.com/download/audio/2022/08/28/audio_3f7a327786.mp3?filename=ambient-dark-cinematic-10894.mp3"
        autoPlay
        loop
        muted={x2}
      />
    </>
  )
}
