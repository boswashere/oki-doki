import { useState } from 'react'

export default function x1() {
  const [started, setStarted] = useState(false)

  return (
    <>
      <style>{`
        body, html, #__next {
          margin: 0; padding: 0; height: 100%;
          background: black;
          color: white;
          font-family: monospace, monospace;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          text-align: center;
          padding: 1rem;
        }
        .text {
          font-size: 2rem;
          user-select: none;
          margin-bottom: 1rem;
          white-space: nowrap;
        }
        iframe {
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
          width: 300px;
          height: 166px;
        }
        .overlay {
          position: fixed;
          inset: 0;
          background: black;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          user-select: none;
          font-size: 2rem;
          z-index: 9999;
        }
      `}</style>

      {!started && (
        <div className="overlay" onClick={() => setStarted(true)}>
          click to continue
        </div>
      )}

      <div className="container" style={{ filter: started ? 'none' : 'blur(3px)' }}>
        <div className="text">please kill me, Sarah</div>
        {started && (
          <iframe
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/keepsecrets/you-will-never-change&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            frameBorder="no"
            scrolling="no"
            allow="autoplay"
            title="You Will Never Change - KeepSecrets"
          />
        )}
      </div>
    </>
  )
}
