export async function toggleDeviceCamera(cameraActive, cameraRef, videoRef) {
  if (cameraActive) {
    cameraRef.current = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoRef.current.srcObject = cameraRef.current;
  } else {
    if (cameraRef.current) {
      cameraRef.current.getTracks().forEach((track) => {
        if (track.readyState == "live") track.stop();
      });
    }
  }
}
