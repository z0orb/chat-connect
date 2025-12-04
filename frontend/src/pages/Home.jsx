import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MemberList from '../components/MemberList'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0f172a' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content: Sidebar + Content + MemberList */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Outlet />
        </div>

        {/* Right Member List */}
        <MemberList />
      </div>
    </div>
  )
}
