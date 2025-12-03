import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as authService from '../services/auth.service'
import { validateUsername, validatePassword } from '../utils/validateForm'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const usernameError = validateUsername(formData.username)
    const passwordError = validatePassword(formData.password)

    if (usernameError || passwordError) {
      setError(usernameError || passwordError)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const response = await authService.register(formData.username, formData.password)
      login(response.user, response.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '14px 20px 14px 48px',
    backgroundColor: focusedField === field ? 'rgba(51, 65, 85, 0.6)' : 'rgba(51, 65, 85, 0.4)',
    border: `2px solid ${focusedField === field ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
  })

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '460px', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '24px', border: '1px solid rgba(71, 85, 105, 0.4)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }}></div>
        
        <div style={{ padding: '48px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)' }}>
              <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '34px', fontWeight: '700', color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>Create Account</h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>Join Chat Connect today</p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '14px 16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#fca5a5', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p style={{ color: '#fca5a5', fontSize: '14px', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg style={{ width: '20px', height: '20px', color: focusedField === 'username' ? '#3b82f6' : '#94a3b8' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input type="text" name="username" value={formData.username} onChange={handleChange} onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)} disabled={loading} placeholder="Choose a username" autoComplete="off" style={inputStyle('username')} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg style={{ width: '20px', height: '20px', color: focusedField === 'password' ? '#3b82f6' : '#94a3b8' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} disabled={loading} placeholder="Create a password" autoComplete="off" style={inputStyle('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.6 }}>
                  <svg style={{ width: '20px', height: '20px', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg style={{ width: '20px', height: '20px', color: focusedField === 'confirmPassword' ? '#3b82f6' : '#94a3b8' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} disabled={loading} placeholder="Confirm your password" autoComplete="off" style={inputStyle('confirmPassword')} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px 24px', background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(71, 85, 105, 0.5)' }}></div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(71, 85, 105, 0.5)' }}></div>
          </div>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
