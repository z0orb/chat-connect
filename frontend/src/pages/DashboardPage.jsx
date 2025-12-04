import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import RoomPage from './RoomPage'
import MemberList from '../components/MemberList'

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f172a' }}>
      {/* Left Sidebar - Always visible */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>Welcome to Chat Connect</h2>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>Select a room to start chatting</p>
              </div>
            </div>
          } />
          <Route path="/rooms/:roomId" element={<RoomPage />} />
        </Routes>
      </div>

      {/* Right Member List */}
      <MemberList />
    </div>
  )
}
