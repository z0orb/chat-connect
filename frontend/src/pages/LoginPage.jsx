import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as authService from '../services/auth.service'
import { validateUsername, validatePassword } from '../utils/validateForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
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

    try {
      setLoading(true)
      const response = await authService.login(formData.username, formData.password)
      login(response.user, response.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, 20px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Card */}
      <div style={{ 
        width: '100%', 
        maxWidth: '460px', 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', 
        borderRadius: '24px', 
        border: '1px solid rgba(71, 85, 105, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(20px)',
        zIndex: 1
      }}>
        {/* Gradient top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }}></div>
        
        {/* Content */}
        <div style={{ padding: '48px 40px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {/* Logo */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
              borderRadius: '20px', 
              marginBottom: '24px',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
            >
              <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            
            <h1 style={{ fontSize: '34px', fontWeight: '700', color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Chat Connect
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>
              Real-time messaging platform
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.15)', 
              border: '1px solid rgba(239, 68, 68, 0.4)', 
              borderRadius: '12px', 
              padding: '14px 16px', 
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#fca5a5', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p style={{ color: '#fca5a5', fontSize: '14px', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  opacity: focusedField === 'username' ? 0.8 : 0.5,
                  transition: 'opacity 0.2s'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: focusedField === 'username' ? '#3b82f6' : '#94a3b8' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  placeholder="Enter your username"
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '14px 20px 14px 48px',
                    backgroundColor: focusedField === 'username' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(51, 65, 85, 0.4)',
                    border: `2px solid ${focusedField === 'username' ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    boxShadow: focusedField === 'username' ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  opacity: focusedField === 'password' ? 0.8 : 0.5,
                  transition: 'opacity 0.2s'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: focusedField === 'password' ? '#3b82f6' : '#94a3b8' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  placeholder="Enter your password"
                  autoComplete="off"
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 48px',
                    backgroundColor: focusedField === 'password' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(51, 65, 85, 0.4)',
                    border: `2px solid ${focusedField === 'password' ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                  {showPassword ? (
                    <svg style={{ width: '20px', height: '20px', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg style={{ width: '20px', height: '20px', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.5)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(71, 85, 105, 0.5)' }}></div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(71, 85, 105, 0.5)' }}></div>
          </div>

          {/* Register link */}
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#60a5fa', 
                fontWeight: '600', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#93c5fd'}
              onMouseOut={(e) => e.target.style.color = '#60a5fa'}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
