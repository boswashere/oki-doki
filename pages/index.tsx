import { useState } from 'react'

export default function page() {
  const [script, set_script] = useState('')
  const [output, set_output] = useState('')
  const [error, set_error] = useState('')
  const [loading, set_loading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    set_loading(true)
    set_output('')
    set_error('')

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-2xl space-y-4">
        <textarea
          value={script}
          onChange={(e) => set_script(e.target.value)}
          rows={10}
          className="w-full p-4 bg-neutral-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          placeholder="paste script here(can be urls)"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition"
        >
          {loading ? 'uploading...' : 'upload'}
        </button>
        {output && (
          <div className="bg-neutral-800 p-3 rounded-lg break-words text-xs">{output}</div>
        )}
        {error && (
          <div className="bg-red-800 p-3 rounded-lg text-sm">{error}</div>
        )}
      </form>
    </div>
  )
}
