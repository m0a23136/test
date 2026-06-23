// LocalStorageから写真データを取得
function getPhotos() {
  return JSON.parse(localStorage.getItem("photos")) || [];
}

// LocalStorageへ写真データを保存
function savePhotos(photos) {
  localStorage.setItem("photos", JSON.stringify(photos));
}