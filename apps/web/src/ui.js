export const page = {
  fontFamily: 'system-ui, sans-serif',
  padding: '2rem',
  maxWidth: 560,
  margin: '0 auto',
}

export const card = {
  display: 'inline-block',
  padding: '1rem 1.5rem',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

export const dot = (color) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: color,
  display: 'inline-block',
})

export const statusRow = {
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
}
