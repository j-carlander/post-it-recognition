import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CameraViewer } from "./Components/CameraViewer/CameraViewer";

function App() {
  const videoRef = useRef();
  const cameraRef = useRef();
  const [cameraActive, setCameraActive] = useState(false);

  return (
    <>
      <CameraViewer
        {...{ videoRef, cameraActive, setCameraActive, cameraRef }}
      />
    </>
  );
}

export default App;
