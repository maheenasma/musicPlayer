console.log('Lets write js');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currFolder= folder;

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

      //show all the songs in the playlist...
      let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
      songUL.innerHTML=""
      for (const song of songs) {
          songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
              <div class="info">
                  <div> ${song.replaceAll("%20"," ")}</div>
                  <div></div>
              </div>
                <img class="invert" src="play.svg" alt="">
           </li>`;
          
      }
  
      //Attach an event listener to each song
      Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
         e.addEventListener("click", element=>{
          console.log(e.querySelector(".info").firstElementChild.innerHTML)
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         }) 
      
      })


   return songs
}

const playMusic = (track, pause=false)=>{
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
  }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    console.log(displayAlbums)
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder...
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div  class="play">
                <div
                  style="
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #1fdf64;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                  "
                >
                 <div
                    style="
                      display: inline-flex;
                      justify-content: center;
                      align-items: center;
                      background-color: #1fdf64;
                      border-radius: 50%;
                      width: 28px;
                      height: 28px;
                      padding: 10px;
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                    >
                      <path
                        fill="#000"
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <img src="/songs/${folder}/cover.jpeg"alt=""/>
              <h2>${response.title}</h2>
              <p style="font-size: 10px; color: rgb(179, 179, 179)">${response.description}</p>
                </div>`
        }
            
    }
     // Load the playlist whenever card is clicked...
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main(){
    await getsongs("songs/Aashiqui2")
    playMusic(songs[0],true)

    displayAlbums()

  

    //Attach an event listner to previous,play and next...
   // const playbtn = document.querySelector("#play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
            
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //time wala part...
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 +"%";
    })

    //Add an event listener to previous and next...
    previous.addEventListener("click", ()=>{
        console.log("previous clicked")
        console.log(currentSong)
        let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click", ()=>{
        console.log("next clicked")
        
        let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) >= length){
            playMusic(songs[index+1])
        }
    })
    //Add an event listener to hamburger...
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
     //Add an event listener to close...
     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%"
    })
}
main()


