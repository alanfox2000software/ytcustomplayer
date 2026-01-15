// 全域變數
let currentPlaylist = [];
let player = null;           // YouTube Player 實例
let currentPlayingId = null;

// 從 localStorage 載入上次儲存的清單
function loadSavedPlaylist() {
  const saved = localStorage.getItem('ytCustomPlaylist');
  if (saved) {
    try {
      currentPlaylist = JSON.parse(saved);
      renderPlaylist();
    } catch (e) {
      console.error('無法解析儲存的播放清單', e);
    }
  }
}

// 渲染側邊欄播放清單
function renderPlaylist() {
  const container = document.getElementById('playlist-items');
  container.innerHTML = '';

  currentPlaylist.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'playlist-item';
    div.textContent = item.title || `未命名影片 ${index + 1}`;
    div.dataset.id = item.id;

    div.addEventListener('click', () => {
      playVideo(item.id, div);
    });

    container.appendChild(div);
  });

  // 高亮目前播放項目
  if (currentPlayingId) {
    document.querySelectorAll('.playlist-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === currentPlayingId);
    });
  }
}

// 播放指定影片
function playVideo(videoId, element) {
  if (!videoId) return;

  // 隱藏「請選擇影片」訊息
  document.getElementById('no-video-message').style.display = 'none';

  // 高亮
  document.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  currentPlayingId = videoId;

  // 如果已經有 player，先銷毀
  if (player) {
    player.destroy();
    player = null;
  }

  // 建立新的 YouTube Player
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1
    },
    events: {
      onReady: (event) => {
        event.target.playVideo();
      },
      onError: (event) => {
        console.error('YouTube Player 錯誤:', event.data);
      }
    }
  });
}

// 從 JSON 檔案載入播放清單
document.getElementById('load-json').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);

      if (!Array.isArray(data)) {
        throw new Error("JSON 必須是陣列格式");
      }

      currentPlaylist = data
        .map(item => ({
          title: item.title || "未命名",
          id: item.id || extractVideoId(item.url || ''),
          url: item.url || ''
        }))
        .filter(item => item.id); // 過濾掉沒有 id 的項目

      renderPlaylist();
      alert(`成功載入 ${currentPlaylist.length} 個影片`);
    } catch (err) {
      alert('載入失敗：' + err.message);
    }
  };
  reader.readAsText(file);
});

// 儲存到 localStorage
function savePlaylist() {
  if (currentPlaylist.length === 0) {
    alert('目前沒有清單可以儲存');
    return;
  }
  localStorage.setItem('ytCustomPlaylist', JSON.stringify(currentPlaylist));
  alert('播放清單已儲存至瀏覽器');
}

// 清除清單
function clearPlaylist() {
  if (!confirm('確定要清除目前播放清單？')) return;

  currentPlaylist = [];
  localStorage.removeItem('ytCustomPlaylist');
  renderPlaylist();

  // 銷毀播放器並顯示提示
  if (player) {
    player.destroy();
    player = null;
  }
  currentPlayingId = null;
  document.getElementById('no-video-message').style.display = 'block';
  document.getElementById('player').innerHTML = '';
}

// 從 url 抽出 video id 的輔助函式
function extractVideoId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : '';
}

// YouTube IFrame API 準備完成
function onYouTubeIframeAPIReady() {
  // 這裡只是確保 API 已載入
  // 實際 player 會在點擊時才建立
  console.log('YouTube IFrame API 已準備好');
}

// 頁面載入時執行
window.addEventListener('load', () => {
  loadSavedPlaylist();
});