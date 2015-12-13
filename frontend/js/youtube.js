var tag = document.createElement('script');
var button = $("#play")
var sound = $("#sound")

button.on("click", function(){
  var state = player.getPlayerState()
  if(state === 1) return player.pauseVideo()
  return player.playVideo()  
})

sound.on("click", function(){
  if(player.isMuted()) return player.unMute()
  return player.mute()
})

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'GBkoONZ_Hv4',
    playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'wmode' : 'transparent' },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}