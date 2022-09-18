const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const audio = document.querySelector(".container #audio");
const currentTime = document.querySelector("#current-time")
const duration = document.querySelector("#duration")
const progressBar = document.querySelector("#progress-bar")
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const playerMusicList = document.querySelector("#player-music-list");

const musicList = [
    new Music("Boşver", "Nilüfer", "1.jpeg", "1.mp3"),
    new Music("Bu da Geçer mi Sevgilim", "Yalın", "2.jpeg", "2.mp3"),
    new Music("Aramızda Uçurumlar", "Suat Suna", "3.jpeg", "3.mp3")
];
const player = new MusicPlayer(musicList);


window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

const displayMusic = (music) => {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;

};
/** previous functions */
prev.addEventListener("click", () => { prevMusic(); });

const prevMusic = () => {
    player.previous();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
};

/** playing functions */
play.addEventListener("click", () => {
    const isMusicPlayer = container.classList.contains("playing");
    isMusicPlayer ? pauseMusic() : playMusic();
});
const pauseMusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();

};
const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
};

/** next functions */
next.addEventListener("click", () => { nextMusic(); });

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();

};

/** times progress  */
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration)
    progressBar.max = Math.floor(audio.duration);
});
const calculateTime = (seconds) => {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    const currentSecond = second < 10 ? `0${second}` : `${second}`;
    const result = `${minute}:${currentSecond}`;
    return result;

};

/**progress bar add value with time*/
audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

/**progress chance value to auto current time  */
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

/** muted auto  */
volumeBar.addEventListener("input", (e) => {
    const currentVolume = e.target.value;
    audio.volume = currentVolume / 100;
    if (currentVolume == 0) {
        isMutedState = false;
        audio.muted = true;
        volume.querySelector("i").classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    } else {
        isMutedState = true;
        audio.muted = false;
        volume.querySelector("i").classList = "fa-solid fa-volume-high";
        volumeBar.value = currentVolume;
    }

});
let isMutedState = true;
volume.addEventListener("click", () => {

    if (isMutedState) {
        isMutedState = false;
        audio.muted = true;
        volume.querySelector("i").classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    } else {
        isMutedState = true;
        audio.muted = false;
        volume.querySelector("i").classList = "fa-solid fa-volume-high";
        volumeBar.value = 50;
    }
});
const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag = `
         <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()}</span>
            <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
            <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
        `;
        playerMusicList.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = playerMusicList.querySelector(`#music-${i}`);
        let liAudioTag = playerMusicList.querySelector(`.music-${i}`);
        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration)
        });
    }
};
const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
};

const isPlayingNow = () => {
    for (let li of playerMusicList.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
};
audio.addEventListener("ended", () => {
    nextMusic();
});