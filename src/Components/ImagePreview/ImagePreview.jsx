import "./ImagePreview.css";

export function ImagePreview({ image, setShowPreview }) {
  async function uploadImg(image) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ img: image }),
    };

    const result = await fetch("/api/image", options);
    console.log("Post image result: ", result);
  }
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
      <button onClick={() => uploadImg(image)}>Upload</button>
    </article>
  );
}
