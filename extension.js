'use strict';
(function(){
  var notified = {};
  var map = [].map
  var log = console.log.bind(console, '[transmission-watcher]');
  var options = {
    checkFreqInSeconds: 10,
    prefix: "Downloaded: "
  }

  function not(f){
    return function(){
      return !f.apply(null, arguments);
    }
  }

  function and(f1, f2){
    return function(){
      return f1.apply(null, arguments) && f2.apply(null, arguments);
    }
  }

  function say(text){
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }

  function torrents(){
    var torrentEls = document.querySelectorAll('.torrent');
    return map.call(torrentEls, function(el){
      return {
        name:     el.querySelector('.torrent_name').innerText,
        progress: parseInt(el.querySelector('.torrent_progress_bar').style.width)
      }
    });
  }

  function isFinished(torrent){
    return torrent.progress > 99;
  }

  function isNotified(torrent){
    return notified[torrent.name];
  }

  function notifyTorrentFinsihed(torrent){
    say(options.prefix + torrent.name);
    notified[torrent.name] = true;
  }

  function check(){
    torrents().
      filter(and(isFinished, not(isNotified))).
      forEach(notifyTorrentFinsihed)
  }

  setInterval(check, options.checkFreqInSeconds * 1000);

  log('running');
})();
