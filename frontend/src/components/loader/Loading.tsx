
export default function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className='loader' />
        <p style={{ color: '#4b5563' }}>{message}</p>
      </div>
    </div>
  );
};
