const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiUrl = 'https://api.lyrics.ovh';

//Search by song or artists
async function searchSongs(term){//get song, term is search word
    // fetch(`${apiUrl}/suggest/${term}`).then(res => res.json()).then(data => console.log(data));

    const res = await fetch(`${apiUrl}/suggest/${term}`);
    const data = await res.json();

    console.log(data);
    showData(data);
}

//Show song and artist in DOM
function showData(data){
    let output = '';

    // data.data.forEach(song =>{
    //     output += `
    //         <li>
    //             <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //             <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</button>
    //         </li>
    //     `;
    // });

    
    
    // result.innerHTML = `
    //     <ul class="songs">
    //         ${output}
    //     </ul>
    // `;

    result.innerHTML =`
        <ul class="songs">
            ${data.data.map(song => `
                    <li>
                      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                       <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</button>
                    </li>
            `).join('')}
        </ul>
    `;

    if(data.prev || data.next){
        more.innerHTML =`
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`: ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`: ''}
        `;
    }else{
        more.innerHTML = '';
    }
}

//Get prev and next songs
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`); //workaround heroku url, for cors console error
    const data = await res.json();
  
    showData(data);
}

//Get lyrics for song
async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`); //workaround heroku url, for cors console error
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>'); //returns or new line

    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    `;

    more.innerHTML = '';
}

//Ev listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();
    if(!searchTerm){
        alert('Please type in a search term');
    }else{
        searchSongs(searchTerm) 
    }
  
});



//Get lyrics button click
result.addEventListener('click', e=> {
   const clickedEl = e.target;
   if(clickedEl.tagName === 'BUTTON'){
       const artist = clickedEl.getAttribute('data-artist');
       const songTitle = clickedEl.getAttribute('data-songtitle');

       getLyrics(artist, songTitle);
   }
});