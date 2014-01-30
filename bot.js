addEventListener('message', function(e)
{
  importScripts('tictactoe.js');  
  postMessage(new Bot(null, e.data.logic).getOptimalMoves(e.data.boards, e.data.game));
}, false);