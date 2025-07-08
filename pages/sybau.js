export default function x1() {
  return (
    <>
      <style>{`
        body, html, #__next {
          margin: 0; padding: 0; height: 100%;
          background: black;
          color: white;
          font-family: monospace, monospace;
          overflow: hidden;
        }
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 1rem;
        }
        .text {
          font-size: 2rem;
          user-select: none;
          white-space: nowrap;
          margin-bottom: 1rem;
        }
        iframe {
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div className="container">
        <div className="text">please kill me, Sarah</div>
        <iframe
          width="300"
          height="80"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1429412885&color=%23ffffff&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"
          title="You Will Never Change - KeepSecrets"
        />
      </div>
    </>
  )
}
