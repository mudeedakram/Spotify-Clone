console.log("Lets write JavaScript");

let currentSong = new Audio();
let songs = [];
let currFolder = "songs";

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

// ======================
// Load Songs
// ======================

async function getSongs(folder) {

    currFolder = folder;

    let response = await fetch(`/${folder}/songs.json`);
    songs = await response.json();

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {

        songUL.innerHTML += `
        <li>

            <img class="invert" width="34" src="img/music.svg">

            <div class="info">
                <div>${decodeURIComponent(song)}</div>
                <div>Mudeed Playlist</div>
            </div>

            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg">
            </div>

        </li>`;
    }

    Array.from(songUL.getElementsByTagName("li")).forEach((e) => {

        e.addEventListener("click", () => {

            playMusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            );

        });

    });

    return songs;

}

// ======================
// Play Music
// ======================

const playMusic = (track, pause = false) => {

    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

};

// ======================
// Album
// ======================

async function displayAlbums() {

    let info = await fetch("/songs/info.json");
    let response = await info.json();

    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = `

        <div class="card" data-folder="songs">

            <div class="play">

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">

                    <path
                    d="M5 20V4L19 12L5 20Z"
                    stroke="#141B34"
                    fill="#000"
                    stroke-width="1.5"
                    stroke-linejoin="round"/>

                </svg>

            </div>

            <img src="/songs/cover.png" alt="Album Cover">

            <h2>${response.title}</h2>

            <p>${response.description}</p>

        </div>

    `;

    document.querySelector(".card").addEventListener("click", async () => {

        songs = await getSongs("songs");

        playMusic(songs[0]);

    });

}
// ======================
// Main
// ======================

async function main() {

    await getSongs("songs");
    playMusic(songs[0], true);

    await displayAlbums();

    // Play / Pause

    play.addEventListener("click", () => {

        if (currentSong.paused) {

            currentSong.play();
            play.src = "img/pause.svg";

        } else {

            currentSong.pause();
            play.src = "img/play.svg";

        }

    });

    // Song Time

    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";

    });

    // Seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent =
            (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime =
            (currentSong.duration * percent) / 100;

    });

    // Hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0";

    });

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-120%";

    });

    // Previous

    previous.addEventListener("click", () => {

        let index =
            songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));

        if (index > 0) {

            playMusic(songs[index - 1]);

        }

    });

    // Next

    next.addEventListener("click", () => {

        let index =
            songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));

        if (index < songs.length - 1) {

            playMusic(songs[index + 1]);

        }

    });
        // Volume Slider

    document
        .querySelector(".range input")
        .addEventListener("change", (e) => {

            currentSong.volume = parseInt(e.target.value) / 100;

            if (currentSong.volume > 0) {

                document.querySelector(".volume>img").src =
                    "img/volume.svg";

            }

        });

    // Mute / Unmute

    document
        .querySelector(".volume>img")
        .addEventListener("click", (e) => {

            if (currentSong.volume > 0) {

                currentSong.volume = 0;

                document.querySelector(".range input").value = 0;

                e.target.src = "img/mute.svg";

            } else {

                currentSong.volume = 0.1;

                document.querySelector(".range input").value = 10;

                e.target.src = "img/volume.svg";

            }

        });

}

// ======================
// Start App
// ======================

main();