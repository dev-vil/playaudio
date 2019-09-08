// log start of loading generatesongs.js
let start = new Date();
console.log(`Start loading of generatesongs.js at ${start.toLocaleTimeString()}.`);

// song list
let songs =
            [{
                ID: 'atemlos',
                Title: 'Atemlos durch die Nacht'
             },
             {
                ID: 'joana',
                Title: 'Joana'
             },
             {
                ID: 'stern',
                Title: 'Ein Stern'
             },
             {
                ID: 'tausendmal',
                Title: 'Du hast mich tausendmal belogen'
             }];

// get entry point for html insertion
let list = document.getElementById('list');
let html = '';

// generate for each song, generate html
// <li>
//     <i class="fa fa-play" id="..."></i>
//     <i class="fa fa-volume-down" id="..."></i>
//     <input type="range" class="slider" id="...">
//     <i class="fa fa-volume-up" id="..."></i>
//     <span id="..."></span>
// </li>
songs.forEach(song =>
{
    html += `<li>\r\n`;
    html += `   ${song.Title}\r\n`;
    html += `   <i class="fas fa-play" id="${song.ID}"></i>\r\n`;
    html += `   <i class="fas fa-volume-down" id="${song.ID}"></i>\r\n`;
    html += `   <input type="range" class="slider" id="${song.ID}">\r\n`;
    html += `   <i class="fas fa-volume-up" id="${song.ID}"></i>\r\n`;
    html += `   <span id="${song.ID}"></span>\r\n`;
    html += `</li>\r\n`;    
});

// set generated html
list.innerHTML = html;  

// log stop of loading generatesongs.js + time elapsed
let stop = new Date();
console.log(`Stop loading of generatesongs.js at ${stop.toLocaleTimeString()}.`);
console.log(`${stop.getMilliseconds() - start.getMilliseconds()} milliseconds elapsed.`);