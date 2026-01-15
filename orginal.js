        async function getVideoIds() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Check for list parameter first
            const listUrl = urlParams.get('list');
            if (listUrl) {
                try {
                    const response = await fetch(listUrl);
                    const data = await response.json();
                    // Flatten the array of arrays and filter out any empty or invalid entries
                    console.log(data);
                    return data.flatMap(item => item).filter(id => id);
                } catch (error) {
                    console.error('Error fetching video list:', error);
                    return [];
                }
            }
            
            // Fall back to videos parameter if list is not present
            const videos = urlParams.get('videos');
            return videos ? videos.split(',') : [];
        }

        function getGridClass(totalVideos) {
            // Define grid classes based on number of videos
            switch (totalVideos) {
                case 1:
                    return 'col-12 col-lg-8 col-xl-6';
                case 2:
                    return 'col-12 col-md-6 col-lg-6';
                case 3:
                    return 'col-12 col-md-6 col-lg-4';
                case 4:
                    return 'col-12 col-md-6 col-lg-6 col-xl-3';
                case 5:
                case 6:
                    return 'col-12 col-md-6 col-lg-4';
                case 7:
                case 8:
                    return 'col-12 col-md-6 col-lg-4 col-xl-3';
                default:
                    return 'col-12 col-md-6 col-lg-4 col-xl-3';
            }
        }

        function createVideoEmbed(videoId, gridClass) {
            const colWrapper = document.createElement('div');
            colWrapper.className = gridClass;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'card shadow-sm h-100';
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body p-0';
            
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'ratio ratio-16x9';
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1`;
            iframe.className = 'border-0 youtube-player';
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            videoWrapper.appendChild(iframe);
            cardBody.appendChild(videoWrapper);
            wrapper.appendChild(cardBody);
            colWrapper.appendChild(wrapper);
            return colWrapper;
        }

        async function initialize() {
            const container = document.getElementById('videoContainer');
            const unmuteAllBtn = document.getElementById('unmuteAllBtn');
            const shareBtn = document.getElementById('shareBtn');
            
            // Get video IDs asynchronously
            const videoIds = await getVideoIds();
            
            // Create videos section
            if (videoIds.length > 0) {
                const gridClass = getGridClass(videoIds.length);
                videoIds.forEach(videoId => {
                    container.appendChild(createVideoEmbed(videoId, gridClass));
                });
            } else {
                // If no videos, add spacing and hide share button
                const videoArea = document.createElement('div');
                videoArea.style.minHeight = '60vh';
                container.appendChild(videoArea);
                shareBtn.classList.add('d-none');
            }

            // Always add the description at the bottom
            const alert = document.createElement('div');
            alert.className = 'alert alert-info text-center mt-4';
            alert.innerHTML = `
                <h5 class="mb-0 text-dark">Add videos using either:</h5>
                <hr>
                <p class="mb-0 text-dark">1. URL parameter "videos" with comma-separated YouTube IDs:<br>
                <code>?videos=dQw4w9WgXcQ,jNQXAC9IVRw</code></p>
                <p class="mt-2 mb-0 text-dark">2. URL parameter "list" pointing to an API that returns video IDs:<br>
                <code>?list=https://api.example.com/videos</code></p>
            `;
            container.appendChild(alert);
        }

        // Load YouTube IFrame API
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        let players = [];

        // This function will be called by YouTube API when it's ready
        function onYouTubeIframeAPIReady() {
            // Initialize players for all iframes
            document.querySelectorAll('.youtube-player').forEach((iframe, index) => {
                players[index] = new YT.Player(iframe, {
                    events: {
                        'onReady': onPlayerReady
                    }
                });
            });
        }

        function onPlayerReady(event) {
            // Start playing when ready (will be muted)
            event.target.playVideo();
        }

        document.getElementById('unmuteAllBtn').addEventListener('click', function() {
            players.forEach(player => {
                if (player.unMute) {
                    player.unMute();
                }
            });
            // Change button appearance after unmuting
            this.classList.replace('btn-success', 'btn-secondary');
            this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Muted
            `;
            this.disabled = true;
        });

        // Add share button functionality
        document.getElementById('shareBtn').addEventListener('click', async function() {
            const tooltip = this.querySelector('.tooltip-text');
            
            try {
                await navigator.clipboard.writeText(window.location.href);
                
                // Show tooltip
                tooltip.classList.add('show');
                
                // Hide tooltip after 2 seconds
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy URL:', err);
                tooltip.textContent = 'Failed to copy link';
                tooltip.classList.add('show');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    tooltip.textContent = 'Link copied!';
                }, 2000);
            }
        });

        // Add video modal functionality
        const addVideoModal = new bootstrap.Modal(document.getElementById('addVideoModal'));
        const urlInput = document.getElementById('youtubeUrl');
        const urlError = document.getElementById('urlError');

        document.getElementById('addVideoBtn').addEventListener('click', () => {
            urlInput.value = '';
            urlError.classList.add('d-none');
            addVideoModal.show();
        });

        document.getElementById('addVideoConfirm').addEventListener('click', () => {
            const url = urlInput.value.trim();
            let videoId = '';

            // Try to extract video ID from various YouTube URL formats
            try {
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    if (url.includes('youtube.com/watch?v=')) {
                        videoId = new URL(url).searchParams.get('v');
                    } else if (url.includes('youtu.be/')) {
                        videoId = url.split('youtu.be/')[1].split('?')[0];
                    }
                }
            } catch (e) {
                console.error('Error parsing URL:', e);
            }

            if (!videoId) {
                urlError.classList.remove('d-none');
                return;
            }

            // Add the video to the current URL
            const currentUrl = new URL(window.location.href);
            const currentVideos = currentUrl.searchParams.get('videos');
            
            if (currentVideos) {
                currentUrl.searchParams.set('videos', currentVideos + ',' + videoId);
            } else {
                currentUrl.searchParams.set('videos', videoId);
            }

            // Reload the page with the new video
            window.location.href = currentUrl.toString();
        });

        // Clear error when input changes
        urlInput.addEventListener('input', () => {
            urlError.classList.add('d-none');
        });

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            initialize().catch(error => {
                console.error('Error initializing application:', error);
            });
        });