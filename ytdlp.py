# -*- coding: utf-8 -*-
"""
將 YouTube 頻道所有影片轉換成 index.html 播放器可用的 playlist.json 格式
需要先安裝 yt-dlp:  pip install yt-dlp
"""

import yt_dlp
import json
from pathlib import Path
import re

def get_channel_videos(channel_url, max_videos=None):
    """
    使用 yt-dlp 獲取頻道所有影片的標題與 video_id
    """
    ydl_opts = {
        'extract_flat': True,           # 只提取清單，不下載
        'quiet': True,
        'no_warnings': True,
        'playlistend': max_videos,      # 限制最大影片數量 (None = 全部)
        'ignoreerrors': True,           # 跳過錯誤影片
    }

    videos = []

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"正在掃描頻道: {channel_url}")
            info = ydl.extract_info(channel_url, download=False)

            if 'entries' not in info:
                print("無法找到影片清單，可能不是有效的頻道或播放清單網址")
                return []

            for entry in info['entries']:
                if not entry:
                    continue

                video_id = entry.get('id')
                title = entry.get('title', '未知標題')

                # 清理標題中可能影響 json 的控制字元
                title = re.sub(r'[\x00-\x1F\x7F]', '', title).strip()

                if video_id and len(video_id) == 11:
                    videos.append({
                        "title": title,
                        "id": video_id
                    })

            print(f"共找到 {len(videos)} 部影片")

    except Exception as e:
        print(f"發生錯誤: {e}")

    return videos


def save_to_playlist_json(videos, playlist_name="我的YouTube頻道", output_file="playlist.json"):
    """
    儲存成單一播放清單格式 (目前播放器最常用)
    """
    data = [
        {
            "playlist": playlist_name,
            "items": videos
        }
    ]

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"已成功儲存到 {output_file}")
        print(f"總共 {len(videos)} 部影片")
    except Exception as e:
        print(f"儲存失敗: {e}")


# ==================== 使用範例 ====================

if __name__ == "__main__":

    # 方法1：使用頻道首頁網址 (推薦)
    # channel_url = "https://www.youtube.com/@頻道handle"           # 例如 @PewDiePie
    # channel_url = "https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx"  # 舊式 channel id
    # channel_url = "https://www.youtube.com/c/舊頻道名稱"             # 舊式自訂網址

    # 方法2：使用「影片」分頁網址 (通常最穩定)
    channel_url = "https://www.youtube.com/@Deletedenergyworkvideos-zb8ck/videos"      # ← 建議使用這個

    # 可選：限制只抓前多少部影片 (測試用，避免一次抓幾千部)
    max_videos = None   # None = 全部   或輸入數字如 300

    # 自訂播放清單名稱
    playlist_name = "我的收藏頻道 - 2026"

    # 執行
    videos = get_channel_videos(channel_url, max_videos)

    if videos:
        save_to_playlist_json(
            videos,
            playlist_name=playlist_name,
            output_file="playlist.json"
        )
    else:
        print("沒有找到任何影片")