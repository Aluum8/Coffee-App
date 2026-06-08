import { useRole } from '../authcontext.jsx'

export default function RoleSwitcher() {
  const { role, setRole } = useRole()

  return (
    <div style={{ padding: 10, background: '#111', color: 'white' }}>
      <p>current role: {role}</p>

      <button onClick={() => setRole('customer')}>customer</button>
      <button onClick={() => setRole('staff')}>staff</button>
      <button onClick={() => setRole('admin')}>admin</button>
    </div>
  )
}