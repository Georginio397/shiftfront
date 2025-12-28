import "./loading.css";

export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="loading-root">
      <div className="loading-box">
        <div className="loading-title">Preparing your shift</div>

        <div className="loading-bar">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-percent">{progress}%</div>
      </div>
    </div>
  );
}
