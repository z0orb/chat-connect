import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RoomProvider } from './context/RoomContext'
import { AblyProvider } from './hooks/useAbly'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './pages/Home'
import RoomPage from './pages/RoomPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <AblyProvider>
        <RoomProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Redirect /dashboard to / */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }>
                <Route index element={
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>Welcome to Chat Connect</h2>
                      <p style={{ color: '#94a3b8', fontSize: '16px' }}>Select a room from the sidebar to start chatting</p>
                    </div>
                  </div>
                } />
                <Route path="rooms/:roomId" element={<RoomPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RoomProvider>
      </AblyProvider>
    </AuthProvider>
  )
}

export default App
