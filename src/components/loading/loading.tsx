interface Props {};
import "./loading.scss";
export default function Loading({}: Props) {
  return (
    <div className="loading-container">
      <p className="loading-title">loading...</p>
    </div>
  );
}