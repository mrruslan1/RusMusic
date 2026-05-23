const musicDatabase = [
    { id: 1, title: "Evolution", artist: "Bensound", genre: "Rock", rating: "4.8", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400", src: "https://www.bensound.com/bensound-music/bensound-evolution.mp3" },
    { id: 2, title: "All That", artist: "Bensound", genre: "Pop", rating: "4.5", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400", src: "https://www.bensound.com/bensound-music/bensound-allthat.mp3" },
    { id: 3, title: "Sci-Fi", artist: "Bensound", genre: "Electronic", rating: "4.9", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400", src: "https://www.bensound.com/bensound-music/bensound-scifi.mp3" },
    { id: 4, title: "Creative Minds", artist: "Corporate Beats", genre: "Pop", rating: "4.2", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400", src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" },
    { id: 5, title: "Actionable", artist: "Rock Engine", genre: "Rock", rating: "4.6", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", src: "https://www.bensound.com/bensound-music/bensound-actionable.mp3" },
    { id: 6, title: "Dreams", artist: "Chill Master", genre: "Electronic", rating: "4.7", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400", src: "https://www.bensound.com/bensound-music/bensound-dreams.mp3" },
    { id: 7, title: "Summer Day", artist: "Pop Band", genre: "Pop", rating: "4.4", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400", src: "https://www.bensound.com/bensound-music/bensound-summer.mp3" },
    { id: 8, title: "Retro Electro", artist: "Cyberpunk Tech", genre: "Electronic", rating: "4.9", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400", src: "https://www.bensound.com/bensound-music/bensound-theelevatorbossanova.mp3" }
];


let currentTracks = [musicDatabase];
let visibleCount = 4; 
let activeGenre = "all";
let searchQuery = "";
let currentTrackIndex = 0;


const catalogGrid = document.getElementById('catalogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterTags = document.getElementById('filterTags');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const heroCtaBtn = document.getElementById('heroCtaBtn');


const audioEngine = document.getElementById('audioEngine');
const globalPlayBtn = document.getElementById('globalPlayBtn');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progressCurrent = document.getElementById('progressCurrent');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');


const clipModal = document.getElementById('clipModal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');


const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема';

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
});


function renderCatalog() {
    catalogGrid.innerHTML = '';
    

    const filtered = musicDatabase.filter(track => {
        const matchesGenre = activeGenre === 'all' || track.genre === activeGenre;
        const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    currentTracks = filtered;

   
    if (visibleCount >= filtered.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }

    
    const sliceTracks = filtered.slice(0, visibleCount);

    if(sliceTracks.length === 0) {
        catalogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">По вашему запросу ничего не найдено.</p>`;
        return;
    }

  
    sliceTracks.forEach((track) => {
        const card = document.createElement('article');
        card.className = 'music-card';
        card.innerHTML = `
            <div class="card-cover-container">
                <img class="card-cover" src="${track.cover}" alt="${track.title}">
                <div class="play-overlay" data-id="${track.id}">
                    <div class="play-btn-icon">▶</div>
                </div>
            </div>
            <div class="card-content">
                <h3 class="track-title">${track.title}</h3>
                <p class="track-artist">${track.artist}</p>
                <div class="card-footer">
                    <span class="rating">★ ${track.rating}</span>
                    <button class="btn-clip" data-title="${track.title} — ${track.artist}">Клип</button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(card);
    });


    document.querySelectorAll('.play-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const trackId = parseInt(overlay.getAttribute('data-id'));
            initTrackPlayer(trackId);
        });
    });

  
    document.querySelectorAll('.btn-clip').forEach(btn => {
        btn.addEventListener('click', () => {
            const info = btn.getAttribute('data-title');
            openClip(info);
        });
    });
}


loadMoreBtn.addEventListener('click', () => {
    visibleCount += 4;
    renderCatalog();
});


filterTags.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        activeGenre = e.target.getAttribute('data-genre');
        visibleCount = 4; 
        renderCatalog();
    }
});


searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    visibleCount = 4; 
    renderCatalog();
});

heroCtaBtn.addEventListener('click', () => {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
});



function initTrackPlayer(trackId) {
    const trackIndex = musicDatabase.findIndex(t => t.id === trackId);
    if (trackIndex !== -1) {
        currentTrackIndex = trackIndex;
loadTrack(musicDatabase[currentTrackIndex]);
        playTrack();
    }
}

function loadTrack(track) {
    audioEngine.src = track.src;
    playerCover.src = track.cover;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
}

function playTrack() {
   
    audioEngine.play().catch(() => console.log("Интеракция с аудио одобрена пользователем."));
    globalPlayBtn.textContent = "⏸";
}

function pauseTrack() {
    audioEngine.pause();
    globalPlayBtn.textContent = "▶";
}


globalPlayBtn.addEventListener('click', () => {
    if (audioEngine.src === "" && musicDatabase.length > 0) {
        loadTrack(musicDatabase[0]);
    }
    if (audioEngine.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});


nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicDatabase.length;
    loadTrack(musicDatabase[currentTrackIndex]);
    playTrack();
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + musicDatabase.length) % musicDatabase.length;
    loadTrack(musicDatabase[currentTrackIndex]);
    playTrack();
});


audioEngine.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicDatabase.length;
    loadTrack(musicDatabase[currentTrackIndex]);
    playTrack();
});

audioEngine.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.target;
    if(!duration) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressCurrent.style.width = `${progressPercent}%`;


    let curMin = Math.floor(currentTime / 60);
    let curSec = Math.floor(currentTime % 60);
    if (curSec < 10) curSec = `0${curSec}`;
    currentTimeEl.textContent = `${curMin}:${curSec}`;


    let durMin = Math.floor(duration / 60);
    let durSec = Math.floor(duration % 60);
    if (durSec < 10) durSec = `0${durSec}`;
    totalTimeEl.textContent = `${durMin}:${durSec}`;
});

progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioEngine.duration;
    if(duration) {
        audioEngine.currentTime = (clickX / width) * duration;
    }
});


const feedbackForm = document.getElementById('feedbackForm');

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    let isValid = true;

    if(name.value.trim() === "") {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email.value.trim())) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else {

document.getElementById('emailError').style.display = 'none';
    }

    if(message.value.trim() === "") {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('messageError').style.display = 'none';
    }

    if(isValid) {
        console.log("=== Данные формы обратной связи ===");
        console.log("Имя пользователя:", name.value.trim());
        console.log("Email пользователя:", email.value.trim());
        console.log("Текст отзыва:", message.value.trim());
        
        alert("Отзыв успешно обработан! Результаты отправлены разработчику в console.log.");
        feedbackForm.reset();
    }
});

renderCatalog();