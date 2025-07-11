import { useState } from 'react'

export default function page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    set_loading(true)
    set_error('')
    set_output('')
    try {
      const res = await fetch('/api/smthg', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      const data = await res.json()
      if (!res.ok || !data.loader) throw new Error(data.error || 'fail')
      set_output(data.loader)
    } catch (err: any) {
      set_error(err.message || 'fail')
    } finally {
      set_loading(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-4xl mb-8 text-pink text-center">sybau uploader</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <textarea
          value={script}
          onChange={(e) => set_script(e.target.value)}
          rows={12}
          placeholder="paste script here(can be urls aswellg)"
          className="bg-darkgray rounded-lg p-4 resize-y text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink transition"
          disabled={loading}
          spellCheck={false}
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-pink text-white py-3 rounded-lg font-semibold hover:bg-pink/90 transition disabled:opacity-60"
        >
          {loading ? 'uploading...' : 'upload'}
        </button>
      </form>
      {output && (
        <input
          readOnly
          onFocus={(e) => e.target.select()}
          value={output}
          className="mt-8 w-full bg-black text-green-400 p-3 rounded-lg font-mono select-all"
        />
      )}
    </main>
  )
}
