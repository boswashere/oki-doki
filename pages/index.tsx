import { useState } from 'react'

async function uploadScript(script: string) {
  const res = await fetch('/api/smthg', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ script }),
  })
  const data = await res.json()
  if (!res.ok || !data.loader) throw new Error(data.error || 'fail')
  return data.loader
}

function ScriptInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      placeholder="paste script here"
      className="w-full p-4 bg-darkgray rounded-2xl text-textLight placeholder-lightgray focus:ring-2 focus:ring-accent transition resize-none"
      disabled={disabled}
    />
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-primary text-white rounded-2xl font-semibold hover:shadow-neon-pink active:scale-95 transition"
    >
      {loading ? 'uploading...' : 'upload'}
    </button>
  )
}

function OutputDisplay({ output }: { output: string }) {
  return (
    <input
      readOnly
      onFocus={(e) => e.target.select()}
      value={output}
      className="mt-6 w-full p-4 bg-darkgray rounded-2xl font-mono text-textLight break-words select-all"
    />
  )
}

export default function Page() {
  const [script, setScript] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOutput('')
    try {
      const result = await uploadScript(script)
      setOutput(result)
    } catch (err: any) {
      setError(err.message || 'fail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkbg via-darkgray to-black">
      <div className="w-full max-w-3xl p-8 glass shadow-soft animate-fade">
        <h1 className="text-4xl md:text-5xl font-sans text-primary text-center mb-6 animate-pulse-neon">
          sybau uploader
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <ScriptInput value={script} onChange={setScript} disabled={loading} />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <SubmitButton loading={loading} />
        </form>
        {output && <OutputDisplay output={output} />}
      </div>
    </div>
  )
}
