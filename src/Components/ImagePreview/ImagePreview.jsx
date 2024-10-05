import "./ImagePreview.css";

export function ImagePreview({ image, setShowPreview }) {
  return (
    <article className="viewer-container">
      <button
        className="retake-img"
        onClick={() => {
          setShowPreview(false);
        }}>
        New picture
      </button>
      <img src={image}></img>
      <button>Upload</button>
    </article>
  );
}
