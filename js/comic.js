//Definierar globala variabler för nuvarande och största comic nummer
let maxComic = -1;
let currentComic = -1;

window.onload = function(){
    //hämta senaste comic
    getComic('latest');
    //sätter funktionalitet för nav knappar
    document.getElementById('first').addEventListener('click', function() {
        if (currentComic != 1) {
            getComic(1);
        }
    });
    document.getElementById('prev').addEventListener('click', function() {
        if (currentComic > 1) {
            getComic(currentComic - 1);
        }
    });
    document.getElementById('random').addEventListener('click', function() {
        let randomComic = Math.floor(Math.random() * maxComic) + 1;
        getComic(randomComic);
    });    
    document.getElementById('next').addEventListener('click', function() {
        if (currentComic < maxComic) {
            getComic(currentComic + 1);
        }
    });
    document.getElementById('last').addEventListener('click', function() {
        getComic('latest');
    });

}

function getComic(which){
    //Hämta(fetch) data från xkcd api
    fetch('https://xkcd.vercel.app/?comic='+which)
        .then(function(response){
            //Kolla om svaret är ok(200)
            if(response.status === 200){
                return response.json();
            } else {
                //Kastar ett felmeddelande om status inte är ok
                throw new Error('Failed to load comic');
            }
        })
        .then(function(data){
            //Uppdatera maxComic värde
            if(maxComic < data.num){
                maxComic=data.num;
            }
            //Skicka json data för behandling till DOM
            appendComic(data);
        })
        .catch(function(error){
            //logga eventuella errors
            console.log('Error: ', error);
        })
}

function appendComic(data){
    //Hämtar och tömmer main comic div
    let comic = document.getElementById('comic');
    comic.innerHTML="";

    //Skapar och lägger till titeln till dokumentet
    let titel = document.createElement('H3');
    titel.innerHTML = data.title;
    comic.appendChild(titel);

    //Skapar och lägger till datumet till dokumentet
    let datum = new Date(data.year,data.month-1,data.day);
    let datumtag = document.createElement('time');
    datumtag.innerHTML = datum.toLocaleDateString();
    comic.appendChild(datumtag);

    //Skapar och lägger till bilden samt en caption
    // till dokumentet inom ett figure element
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    img.src=data.img;
    let cap = document.createElement('figcaption');
    cap.innerHTML = "Nummer: "+data.num;
    figure.appendChild(img);
    figure.appendChild(cap);
    comic.appendChild(figure);

    //Uppdaterar nuvarande comic nummer
    currentComic=data.num;
}