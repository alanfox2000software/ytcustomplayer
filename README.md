# YT 多格播放器 (YTCustomPlayer)

一個強大、輕量、支援多分頁與網址分享的 YouTube 多格同步播放器。

可同時播放多個 YouTube 影片，支援自訂播放清單、線上載入、匯出/匯入、網址參數快速分享等功能。


## 特色功能

- 多格同步播放（可同時播放多個 YouTube 影片）
- 支援多分頁播放清單管理
- 從 GitHub 線上動態載入播放清單（支援原版與所有 Fork）
- 支援網址參數快速載入影片組合  
  範例：`?videos=dQw4w9WgXcQ,jNQXAC9IVRw,abc123xyz`
- 一鍵「複製目前影片設定」分享連結
- 支援本地 JSON 匯入/匯出
- 深色現代化介面 + 美觀捲軸
- 支援靜音/播放/暫停全域控制

## 線上體驗

- 原版：https://alanfox2000software.github.io/ytcustomplayer/
- 你的 Fork：https://{username}.github.io/ytcustomplayer/

（Fork 後自動部署到 GitHub Pages 即可擁有自己的版本，所有功能都會自動適配你的儲存庫）

## 快速開始

1. **直接使用**  
   前往下列任一連結即可開始使用：
   - https://alanfox2000software.github.io/ytcustomplayer/
   - 或你自己 Fork 後的 GitHub Pages 網址

2. **加入你自己的影片清單**  
   - 點擊右下角「+」按鈕
   - 選擇「從線上加入」 → 會自動載入目前儲存庫的 `playlist/` 資料夾內所有 `.json` 檔案
   - 或「從本地加入」 → 上傳你自己的 JSON 播放清單

3. **分享目前播放組合**  
   - 播放你想要的影片組合
   - 點擊「複製目前影片設定」
   - 將連結傳給朋友，對方開啟即可看到完全相同的多格畫面！

## 網址參數格式

支援直接在網址後加上影片 ID 清單：

https://{username}.github.io/ytcustomplayer/?videos=VIDEO_ID1,VIDEO_ID2,VIDEO_ID3

範例：
https://alanfox2000software.github.io/ytcustomplayer/?videos=dQw4w9WgXcQ,jNQXAC9IVRw,9bZkp7q19f0

## 播放清單 JSON 格式（自訂清單用）

```json
[
  {
    "playlist": "我的最愛 2025",
    "items": [
      {
        "title": "Rick Astley - Never Gonna Give You Up",
        "id": "dQw4w9WgXcQ"
      },
      {
        "title": "Charlie bit my finger - again !",
        "id": "_OBlgSz8sSM"
      }
    ]
  }
]

可放置在儲存庫的 playlist/ 資料夾內，檔名任意（建議用英文或數字），副檔名必須是 .json。