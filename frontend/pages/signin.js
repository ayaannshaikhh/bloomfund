import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/router'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setError('Account created. Check your email')
    }
  }

  async function handleLogin() {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/main')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(to bottom right, rgb(255,220,230), rgb(210,255,220))' }}
    >
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md"
        style={{ backgroundColor: 'rgb(255,245,250)' }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: 'black' }}>
          Bloomfund Sign In
        </h1>

        {error && (
          <div className="p-3 rounded mb-4 text-center"
            style={{ backgroundColor: 'rgb(255,180,180)', color: 'black' }}
          >
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-4"
          style={{ border: '2px solid rgb(200,200,200)', color: 'black' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded mb-6"
          style={{ border: '2px solid rgb(200,200,200)', color: 'black' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded mb-4"
          style={{ backgroundColor: 'rgb(150,255,180)', color: 'black' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded"
          style={{ backgroundColor: 'rgb(255,210,235)', color: 'black' }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </div>
  )
}