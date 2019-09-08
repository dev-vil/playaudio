// log start of loading playaudio.js
start = new Date();  // no 'let', variable already defined in generatesongs.js
console.log(`Start loading of playaudio.js at ${start.toLocaleTimeString()}.`);

// constant strings
const playIcon = 'fa-play';
const stopIcon = 'fa-stop';
const volumeUpIcon = 'fa-volume-up';
const volumeDownIcon = 'fa-volume-down';
const playingClass = 'playing';
const sliderClass = 'slider';

// get filename from path$
const getFilenameFromPath = (path, includeExtension = false) =>
{
    let lastSlash = path.lastIndexOf('/');
    let fileName = path.substring(lastSlash + 1);
    
    if(!includeExtension)
    {
        let lastDot = fileName.lastIndexOf('.');

        fileName = fileName.substring(0, lastDot);
    }

    return fileName;
}

// function to be executed when 'play' button is clicked
const clickPlay = event =>
{
    // shortcut to 'play' button
    let button = event.target;
    
    // log which file is played
    console.log(`Start playing ${button.id}`);

    // find the right song, take its audio part and play it
    songsToPlay.find(s => s.Key === button.id).Audio.play();

    // add css properties of .playing class to parent <li> of 'play' button
    button.parentNode.classList.add(playingClass);

    // change 'play' button into 'stop' button
    button.classList.remove(playIcon);
    button.classList.add(stopIcon);

    // make button react to 'stop' instead of 'play' when clicked
    button.removeEventListener('click', clickPlay);
    button.addEventListener('click', clickStop);
}

// function to be executed when 'stop' button is clicked
const clickStop = event =>
{
    // shortcut to 'stop' button
    let button;
    
    // link to 'stop' button depending on event that's calling clickStop
    switch(event.type)
    {
        // clickStop is called via mouse clicking the 'stop' button
        // in this case the event.target is the <i class="fas fa-stop" id="...">
        // and that's what we need
        case 'click':
            button = event.target;
            break;

        // clickStop is called via songHasEnded(event)
        // in this case the event.target is the Audio element, so we need to get
        // the <i class="fas fa-stop" id="..."> with the id corresponding the audio's src
        case 'ended':
            button = Array.from(document.getElementsByClassName(stopIcon)).find(e => e.id === getFilenameFromPath(event.target.src));
            break;
    }    

    // log which file is stopped
    console.log(`Stop playing ${button.id}`);

    // find the right song, take its audio part and stop+reload it
    songsToPlay.find(s => s.Key === button.id).Audio.load();

    // remove css properties of .playing class from parent <li> of 'stop' button
    button.parentNode.classList.remove(playingClass);

    // change 'stop' button into 'play' button
    button.classList.remove(stopIcon);
    button.classList.add(playIcon);

    // make button react to 'play' instead of 'stop' when clicked
    button.removeEventListener('click', clickStop);
    button.addEventListener('click', clickPlay);
}

// function te be executed when 'volume up' button is clicked
const clickVolumeUp = event =>
{
    // shortcut to 'volume up' button
    let button = event.target;

    // log which file's volume is increased
    console.log(`Increase volume of ${button.id}`);

    // find the right song, take its audio part, check the volume
    // and increase it if possible
    let audio = songsToPlay.find(s => s.Key === button.id).Audio;
    let volumeSlider = volumeSliders.find(v => v.id === button.id);

    if(audio.volume + 0.1 <= 1)
    {
        audio.volume += 0.1;
    }
    else
    {
        audio.volume = 1;
    }

    volumeSlider.value = audio.volume * 100;
}

// function to be executed when 'volume down' button is clicked
const clickVolumeDown = event =>
{
    // shortcut to 'volume down' button
    let button = event.target;

    // log which file's volume is decreased
    console.log(`Decrease volume of ${button.id}`);

    // find the right song, take its audio part, check the volume
    // and decrease it if possible
    let audio = songsToPlay.find(s => s.Key === button.id).Audio;
    let volumeSlider = volumeSliders.find(v => v.id === button.id);

    if(audio.volume - 0.1 >= 0)
    {
        audio.volume -= 0.1;
    }
    else
    {
        audio.volume = 0;
    }

    volumeSlider.value = audio.volume * 100;
}

// function to be executed when song is playing
const updatePlayPosition = event =>
{
    // shortcuts to song object and its key
    let song = event.target;
    let key = getFilenameFromPath(song.src);

    // get current position in song and total duration
    let currentSeconds = Math.round(song.currentTime);
    let currentMinutes = 0;

    let totalSeconds = Math.round(song.duration);
    let totalMinutes = 0;

    if(currentSeconds >= 60)
    {
        currentMinutes = Math.floor(currentSeconds / 60);
        currentSeconds -= (currentMinutes * 60);
    }1

    if(totalSeconds >= 60)
    {
        totalMinutes = Math.floor(totalSeconds / 60);
        totalSeconds -= (totalMinutes * 60);
    }

    // get corresponding span to display position/duration
    let timePositionText = Array.from(document.getElementsByTagName('span')).find(e => e.id === key);

    // display position/duration
    timePositionText.innerHTML = `${currentMinutes.toString().padStart(2, '0')}:` + 
                                 `${currentSeconds.toString().padStart(2, '0')} / ` + 
                                 `${totalMinutes.toString().padStart(2, '0')}:` +
                                 `${totalSeconds.toString().padStart(2, '0')}`;
}

const songHasEnded = event =>
{
    clickStop(event);
}

const songHasLoaded = event =>
{
    updatePlayPosition(event);
}

// get all 'play', 'volume up' and 'volume down' buttons and volume sliders
// from html document and put them into arrays
let playButtons = Array.from(document.getElementsByClassName(playIcon));
let volumeUpButtons = Array.from(document.getElementsByClassName(volumeUpIcon));
let volumeDownButtons = Array.from(document.getElementsByClassName(volumeDownIcon));
let volumeSliders = Array.from(document.getElementsByClassName(sliderClass));

// prepare array for songs data
let songsToPlay = [];

// for each 'play' button
playButtons.forEach(button =>
{
    // create song data
    let song = 
    {
        Key: button.id,
        Audio: new Audio(`./audio/${button.id}.mp3`)
    };

    // set song volume to 50%
    song.Audio.volume = 0.5;

    // make song follow its play position
    song.Audio.addEventListener('timeupdate', updatePlayPosition);
    song.Audio.addEventListener('ended', songHasEnded);
    song.Audio.addEventListener('loadeddata', songHasLoaded);

    // add song data to array
    songsToPlay.push(song);

    // make button react to 'play' when clicked
    button.addEventListener('click', clickPlay);
});

// for each 'volume up' button
volumeUpButtons.forEach(button =>
{
    // make button react to 'volume up' when clicked
    button.addEventListener('click', clickVolumeUp);
});

// for each 'volume down' button
volumeDownButtons.forEach(button =>
{
    // make button react to 'volume down' when clicked
    button.addEventListener('click', clickVolumeDown);
});

// for each volume slider
volumeSliders.forEach(slider =>
{
    slider.min = 0;
    slider.max = 100;
    slider.value = songsToPlay.find(s => s.Key === slider.id).Audio.volume * 100;

    slider.addEventListener('input', event => 
    {
        let slider = volumeSliders.find(v => v.id === event.target.id);

        slider.value = songsToPlay.find(s => s.Key === slider.id).Audio.volume * 100;
    });
});

// log stop of loading playaudio.js + time elapsed
stop = new Date(); // no 'let', variable already defined in generatesongs.js
console.log(`Stop loading of playaudio.js at ${stop.toLocaleTimeString()}.`);
console.log(`${stop.getMilliseconds() - start.getMilliseconds()} milliseconds elapsed.`);