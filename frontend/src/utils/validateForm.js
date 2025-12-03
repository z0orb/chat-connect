export function validateUsername(username) {
    if (!username || username.length < 3) {
      return 'Username must be at least 3 characters'
    }
    return null
  }
  
  export function validatePassword(password) {
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return null
  }
  
  export function validateRoomName(name) {
    if (!name || name.length < 3) {
      return 'Room name must be at least 3 characters'
    }
    return null
  }
  