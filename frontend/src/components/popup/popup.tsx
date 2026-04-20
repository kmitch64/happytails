
import Loader from '../loader/Loading';

import './popup.css';


export default function Popup({ status, clearStatus }: { status: SubmitStatus, clearStatus: () => void }) {
  return (
    <>
      {status.showStatus &&
        <div className="status-modal-overlay">
          <div className="status-modal">
            <h1 className={`status-modal-title ${status.hasError ? "error-text" : status.showLoading ? "" : "success-text"}`}>
              {status.title}
            </h1>
            <div className="status-modal-message">
              <span>
                {status.message}
              </span>
            </div>

            {status.showLoading && <Loader message='' />}

            {status.showButton && (
              <button onClick={clearStatus} className="btn-neutral">
                OK
              </button>
            )}
          </div>
        </div>}
    </>
  );
};
