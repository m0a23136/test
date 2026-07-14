const cameraPage = document.getElementById("cameraPage");
const albumPage = document.getElementById("albumPage");

const openAlbum = document.getElementById("openAlbum");
const backCamera = document.getElementById("backCamera");

const shutterSound = new Audio("shutter.mp3");
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const tagInput = document.getElementById('tagInput');
const switchCameraBtn =
  document.getElementById('switchCameraBtn');

let currentCamera = "environment";
let currentStream = null;

// カメラ起動
async function startCamera() {

  try {

    // 既存カメラ停止
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        track.stop();
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentCamera
      },
      audio: false
    });

    currentStream = stream;
    video.srcObject = stream;

  } catch (error) {
    alert("カメラにアクセスできません");
    console.error(error);
  }
}

switchCameraBtn.addEventListener('click', () => {

  if (currentCamera === "environment") {
    currentCamera = "user";
  } else {
    currentCamera = "environment";
  }

  startCamera();

});


// 撮影
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');

 // 保存する画像サイズ
 const width = 640;
 const height = 480;

 canvas.width = width;
 canvas.height = height;

 // カメラ映像を縮小して描画
 context.drawImage(video, 0, 0, width, height);

 shutterSound.currentTime = 0;
 shutterSound.play(); 

 // JPEG形式
 const imageData = canvas.toDataURL('image/jpeg');

  const tags = tagInput.value
    .split(' ')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');

  const newPhoto = {
   id: Date.now(),
   image: imageData,
   tags: tags,
   date: new Date().toLocaleString('ja-JP')
  };

  const photos = getPhotos();
  photos.push(newPhoto);
  savePhotos(photos);

  tagInput.value = '';

  alert("保存しました")
});

//アルバムをひらく
openAlbum.addEventListener("click", () => {


    cameraPage.style.display = "none";

    albumPage.style.display = "block";

    renderPhotos();
});


//カメラに戻る
backCamera.addEventListener("click", () => {

    albumPage.style.display = "none";
    cameraPage.style.display = "block";

});

// 初期化
startCamera();



