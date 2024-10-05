import { useEffect, useRef } from "react";
import "./CameraViewer.css";
import { toggleDeviceCamera } from "../../Util/toggleDeviceCamera";

export function CameraViewer({
  videoRef,
  cameraActive,
  setCameraActive,
  cameraRef,
  setImage,
  setShowPreview,
}) {
  const imgWidth = 640;
  const imgHeight = 480;
  const canvasRef = useRef();

  useEffect(() => {
    toggleDeviceCamera(cameraActive, cameraRef, videoRef);

    return () => {
      if (cameraRef.current) {
        cameraRef.current.getTracks().forEach((track) => {
          if (track.readyState == "live") track.stop();
        });
      }
    };
  }, [cameraActive]);

  function captureImage() {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, imgWidth, imgHeight);
    setImage(canvasRef.current.toDataURL("image/png"));
    setShowPreview(true);
  }

  return (
    <article className="viewer-container">
      {!cameraActive ? (
        <button
          className="toggle-camera-btn"
          onClick={() => {
            setCameraActive(true);
          }}>
          Start camera
        </button>
      ) : (
        <button
          className="toggle-camera-btn"
          onClick={() => {
            setCameraActive(false);
          }}>
          Stop camera
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        width={imgWidth}
        height={imgHeight}></video>
      <button className="capture-btn" onClick={captureImage}>
        <div></div>
      </button>
      <canvas
        ref={canvasRef}
        width={imgWidth}
        height={imgHeight}
        style={{ display: "none" }}></canvas>
    </article>
  );
}
