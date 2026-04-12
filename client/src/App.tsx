import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState<string>('Checking...')

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(err => {
        console.error('Failed to fetch health status:', err)
        setHealth('Server Offline')
      })
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif' 
    }}>
      <h1>Helpdesk</h1>
      <p style={{ 
        color: health === 'ok' ? 'green' : 'red',
        fontWeight: 'bold'
      }}>
        Backend Status: {health}
      </p>
    </div>
  )
}

export default App
