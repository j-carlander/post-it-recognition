import "./App.css";
import { useRef, useState } from "react";
import { CameraViewer } from "./Components/CameraViewer/CameraViewer";
import { ImagePreview } from "./Components/ImagePreview/ImagePreview";

function App() {
  const videoRef = useRef();
  const cameraRef = useRef();
  const [cameraActive, setCameraActive] = useState(false);
  const [image, setImage] = useState();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {!showPreview ? (
        <CameraViewer
          {...{
            videoRef,
            cameraActive,
            setCameraActive,
            cameraRef,
            setImage,
            setShowPreview,
          }}
        />
      ) : (
        <ImagePreview {...{ image, setShowPreview }} />
      )}
    </>
  );
}

export default App;
