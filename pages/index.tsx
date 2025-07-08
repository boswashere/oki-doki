import { useState, useRef } from 'react'

export default function Home() {
  const [text, set_text] = useState('')
  const [result, set_result] = useState('')
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState('')
  const [copied, set_copied] = useState(false)
  const textarea_ref = useRef<HTMLTextAreaElement>(null)
  const result_ref = useRef<HTMLInputElement>(null)

  const handle_submit = async () => {
    if (!text.trim()) {
      set_error('script cannot be empty')
      return
    }
    
    set_error('')
    set_loading(true)
    set_result('')
    set_copied(false)

    try {
      const res = await fetch('/api/save_script', {
        method: 'POST',
        body: JSON.stringify({ script: text }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!res.ok) throw new Error('upload failed')
      
      const data = await res.json()
      const id = data.url.split('/').pop()
      const domain = window.location.origin
      
      set_result(`loadstring(game:GetService("HttpService"):HttpGet("${domain}/api/scripts/${id}"))()`)
      
      if (textarea_ref.current) {
        textarea_ref.current.value = ''
        set_text('')
      }
    } catch {
      set_error('upload failed')
    } finally {
      set_loading(false)
    }
  }

  const copy_to_clipboard = () => {
    if (result_ref.current) {
      result_ref.current.select()
      document.execCommand('copy')
      set_copied(true)
      setTimeout(() => set_copied(false), 2000)
    }
  }

  const container_style = {
    maxWidth: '700px',
    margin: '2rem auto',
    fontFamily: 'Arial, sans-serif',
    padding: '0 1rem',
    background: '#1a1a1a',
    minHeight: '100vh',
    color: '#f0f0f0'
  }

  const title_style = {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontWeight: 600,
    fontSize: '2.5rem',
    textTransform: 'lowercase' as const,
    userSelect: 'none' as const,
    color: '#ff6b6b',
    textShadow: '0 0 10px rgba(255,107,107,0.7)'
  }

  const textarea_style = {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #444',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    fontFamily: 'monospace',
    background: '#222',
    color: '#f0f0f0',
    minHeight: '250px',
    outline: 'none',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)'
  }

  const button_style = {
    marginTop: '1rem',
    padding: '0.75rem',
    fontSize: '1.1rem',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(45deg, #ff6b6b, #7873f5)',
    color: '#fff',
    cursor: loading ? 'not-allowed' : 'pointer',
    textTransform: 'lowercase' as const,
    userSelect: 'none' as const,
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    fontWeight: 'bold'
  }

  const result_container_style = {
    position: 'relative' as const,
    marginTop: '1.5rem'
  }

  const input_style = {
    width: '100%',
    padding: '0.75rem 3.5rem 0.75rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #444',
    background: '#222',
    userSelect: 'all' as const,
    fontFamily: 'monospace',
    color: '#f0f0f0',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
  }

  const copy_button_style = {
    position: 'absolute' as const,
    right: '0.5rem',
    top: '0.5rem',
    background: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const error_style = {
    color: '#ff6b6b',
    marginTop: '0.5rem',
    padding: '0.5rem',
    background: 'rgba(255,107,107,0.1)',
    borderRadius: '4px',
    textAlign: 'center' as const
  }

  const character_count_style = {
    textAlign: 'right' as const,
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '0.25rem'
  }

  return (
    <main style={container_style}>
      <h1 style={title_style}>sybau loader</h1>
      
      <textarea
        ref={textarea_ref}
        value={text}
        onChange={e => set_text(e.target.value)}
        rows={12}
        style={textarea_style}
        disabled={loading}
        spellCheck={false}
        placeholder="paste your script here..."
      />
      
      <div style={character_count_style}>
        {text.length} characters
      </div>
      
      {error && <div style={error_style}>{error}</div>}
      
      <button 
        onClick={handle_submit} 
        disabled={loading} 
        style={{ 
          ...button_style, 
          opacity: loading ? 0.7 : 1,
          background: loading 
            ? '#444' 
            : 'linear-gradient(45deg, #ff6b6b, #7873f5)'
        }}
      >
        {loading ? '...uploading' : 'generate loader'}
      </button>
      
      {result && (
        <div style={result_container_style}>
          <input
            ref={result_ref}
            type="text"
            value={result}
            readOnly
            onFocus={e => e.target.select()}
            style={input_style}
          />
          <button 
            onClick={copy_to_clipboard} 
            style={{
              ...copy_button_style,
              background: copied ? '#4CAF50' : '#444'
            }}
          >
            {copied ? '✓' : 'copy'}
          </button>
        </div>
      )}
    </main>
  )
}
