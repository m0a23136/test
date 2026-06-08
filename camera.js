const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const gallery = document.getElementById('gallery');
const tagInput = document.getElementById('tagInput');
const searchInput = document.getElementById('searchInput');

// カメラ起動
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;
  } catch (error) {
    alert('カメラにアクセスできません');
    console.error(error);
  }
}
// LocalStorageから取得
function getPhotos() {
  return JSON.parse(localStorage.getItem('photos')) || [];
}

// LocalStorageへ保存
function savePhotos(photos) {
  localStorage.setItem('photos', JSON.stringify(photos));
}

// 写真表示
function renderPhotos(filterTag = '') {
  const photos = getPhotos();
  gallery.innerHTML = '';

  const filtered = photos.filter(photo => {
    if (!filterTag) return true;

    return photo.tags.some(tag =>
      tag.toLowerCase().includes(filterTag.toLowerCase())
    );
  });

  filtered.reverse().forEach(photo => {
    const card = document.createElement('div');
    card.className = 'photo-card';

   card.innerHTML = `
     <img src="${photo.image}" alt="photo">
     <div class="photo-info">
      <div class="tags">
       ${photo.tags.map(tag => `#${tag}`).join(' ')}
      </div>

     <div class="date">
      ${photo.date}
     </div>

     <button class="delete-btn" data-id="${photo.id}">
      削除
     </button>
     </div>
    `;

    gallery.appendChild(card);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {

   button.addEventListener('click', () => {
     const id = Number(button.dataset.id);
     const photos = getPhotos();
     const updatedPhotos = photos.filter(
      photo => photo.id !== id  
     );

     savePhotos(updatedPhotos);

     renderPhotos(searchInput.value);
     console.log("押された");
     console.log(button.dataset.id);
   });

  });
}

// 撮影
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL('image/png');

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

  renderPhotos(searchInput.value);
});

// タグ検索
searchInput.addEventListener('input', (e) => {
  renderPhotos(e.target.value);
});

// 初期化
startCamera();
renderPhotos();

