addEventListener('message', function(e)
{
  importScripts('tictactoe.js');  
  var bot = new Bot();
  bot.init();
  postMessage(bot.getOptimalMoves(e.data.boards, e.data.game));
}, false);