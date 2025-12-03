export function formatTime(date) {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  
  export function formatDate(date) {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  export function formatDateTime(date) {
    const d = new Date(date)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  export function isToday(date) {
    const today = new Date()
    const d = new Date(date)
    return d.toDateString() === today.toDateString()
  }
  