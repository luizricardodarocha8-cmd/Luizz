const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function converter() {
  const input = document.getElementById("videoInput");
  const status = document.getElementById("status");
  const link = document.getElementById("downloadLink");

  if (!input.files.length) {
    alert("Selecione um vídeo MP4");
    return;
  }

  status.innerText = "Carregando FFmpeg...";
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const videoFile = input.files[0];

  status.innerText = "Convertendo vídeo para áudio...";

  ffmpeg.FS("writeFile", "video.mp4", await fetchFile(videoFile));

  await ffmpeg.run(
    "-i", "video.mp4",
    "-vn",
    "-ab", "192k",
    "-ar", "44100",
    "-y",
    "audio.mp3"
  );

  const data = ffmpeg.FS("readFile", "audio.mp3");

  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );

  link.href = url;
  link.style.display = "inline";
  status.innerText = "Conversão concluída ✔️";
}
