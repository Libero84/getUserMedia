let stream = null;
let recorder;
let audioChunks = [];

function start() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const video = document.querySelector("video");
      video.srcObject = stream;
      recorder = new MediaRecorder(stream);
      video.onloadedmetadata = (e) => {
        video.play();
      };
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.start();
    })
    .catch((error) => {
      console.error("Błąd dostępu do mikrofonu:", error);
    });
}

function stop() {
  const video = document.querySelector("video");
  video.srcObject.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
  recorder.stop();

  recorder.onstop = () => {
    let blob = new Blob(audioChunks, { type: "audio/wav" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };
}
