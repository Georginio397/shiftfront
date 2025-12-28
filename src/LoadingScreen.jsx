import "./loading.css";

export default function LoadingScreen() {
  return (
    <div className="loading-wrapper">
      <div className="loading-box">
        <div className="loading-spinner" />
        <p>Loading shift environment...</p>
      </div>
    </div>
  );
}
