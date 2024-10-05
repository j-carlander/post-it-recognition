import { useEffect, useRef } from "react";
import "./CameraViewer.css";

export function CameraViewer({
  videoRef,
  cameraActive,
  setCameraActive,
  cameraRef,
}) {
  useEffect(() => {
    (async () => {
      if (cameraActive) {
        cameraRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = cameraRef.current;
      } else {
        cameraRef.current.getTracks().forEach((track) => {
          if (track.readyState == "live") track.stop();
        });
      }
    })();

    return () => {
      cameraRef.current.getTracks().forEach((track) => {
        if (track.readyState == "live") track.stop();
      });
    };
  }, [cameraActive]);

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
      <video ref={videoRef} autoPlay width={640} height={480}></video>
    </article>
  );
}
