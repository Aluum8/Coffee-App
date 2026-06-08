import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      nav('/staff') // Ensure this matches the path in App.jsx
    } catch (err) {
      console.error(err) // This helps you see the REAL error in the console
      alert('Login failed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Staff Login</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="name@cafe.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transform active:scale-95 transition-all shadow-lg mt-4"
          >
            Login to Dashboard
          </button>
        </div>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Authorized staff only. Contact admin for access.
        </p>
      </div>
    </div>
  )
}