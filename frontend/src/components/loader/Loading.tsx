
import './loading.css';

export default function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className='loading-animation' />
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};
