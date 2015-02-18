'use strict';
(function(){
  var notified = {};
  var map = [].map
  var log = console.log.bind(console, '[bt-watcher]');

  var options = {
    prefix: "Downloaded: "
  }

  function say(text){
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }

  function torrents(){
    var torrentEls = document.querySelectorAll('.torrent');
    return map.call(torrentEls, function(el){
      var torrent = {
        name: el.querySelector('.torrent_name').innerText,
        progress: parseInt(el.querySelector('.torrent_progress_bar').style.width)
      }
      return torrent;
    });
  }

  function finsished(torrents){
    return torrents.filter(function(t){
      return t.progress > 99;
    });
  }

  function notNotified(torrents){
    return torrents.filter(function(t){
      return !notified[t.name];
    });
  }

  function notify(n){
    say(options.prefix + n);
    notified[n] = true;
  }

  function check(){
    notNotified(finsished(torrents())).forEach(function(t){
      notify(t.name);
    })
  }

  setInterval(check, 10 * 1000);

  log('watch installed');
})();
