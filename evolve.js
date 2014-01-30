addEventListener('message', function(e)
{
  importScripts('tictactoe.js');  
  var res = [], game;
  for (var i = 0; i < 10; i++) res[i] = {'bot': e.data[i], 'wins': 0};
  for (var i = 0; i < 9; i++)
  {
    for (var j = i + 1; j < 10; j++)
    {
      game = new Game();
      game.addPlayer(Bot);
      game.addOpposer(Bot);
      game.player1.logic = e.data[i];
      game.player1._noWorker = true;
      game.player2.logic = e.data[j];
      game.player2._noWorker = true;
      game.init({'mode': 3, 'difficulty': 0, 'delay': -1});
      game.move();
      res[game.player == 1 ? i : j].wins++;
    }
  }
  res.sort(function(a, b){return b.wins - a.wins;});
  postMessage({'parent1': res[0].bot, 'parent2': res[1].bot});
}, false);