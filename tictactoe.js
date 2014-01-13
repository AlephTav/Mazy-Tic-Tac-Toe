// Mazy Tic-Tac-Toe v1.0
// Copyright © 2014 - Sergey Milimko (a.k.a. AlephTav)
// Licensed under the MIT (http://www.opensource.org/licenses/MIT) license.
// ****************************************************************************************************

// Game board
var GameBoard = (function(undefined)
{
  // Private variables.
  var bfattr = {'fill': '#FFF68F' , 'fill-opacity': 0.3, 'stroke': '#8B0000', 'stroke-width': 4};
  var sfattr = {'fill': '#FF4500', 'fill-opacity': 0.2, 'stroke': '#5D478B', 'stroke-width': 4};
  var pv;
  
  // Public functions.
  // **************************************************************************************************
  
  // Constructor. Initialization of the general public properties.
  var GameBoard = function(canvas, size)
  {
    this.size = parseInt(size);
    this.raphael = Raphael(canvas, this.size, this.size);
  };
  
  GameBoard.prototype.line = function(x1, y1, x2, y2, color, width)
  {
    this.raphael.path(['M', x1, y1, 'L', x2, y2]).attr({'stroke': color, 'stroke-width': width ? width : 1});
  };
  
  // Translates the cell coordinates into the big frame ones. 
  GameBoard.prototype.getBBoxPosition = function(x, y)
  {
    var i = parseInt((x - this.padding) / this.bbox);
    var j = parseInt((y - this.padding) / this.bbox);
    return {'x': i * this.bbox + this.padding, 'y': j * this.bbox + this.padding};
  };

  // Translates the cell coordinates into the small frame ones.
  GameBoard.prototype.getSBoxPosition = function(x, y, bbX, bbY)
  {
    var i = parseInt((x - this.padding) / this.sbox);
    var j = parseInt((y - this.padding) / this.sbox);
    return {'x': bbX + i * this.sbox + this.padding, 'y': bbY + j * this.sbox + this.padding};
  };
  
  GameBoard.prototype.getBCell = function(bpos)
  {
    return [Math.floor((bpos.x - this.padding) / this.bbox), Math.floor((bpos.y - this.padding) / this.bbox)];
  };
  
  GameBoard.prototype.getSCell = function(bpos, spos)
  {
    return [Math.floor((spos.x - this.padding - bpos.x) / this.sbox), Math.floor((spos.y - this.padding - bpos.y) / this.sbox)];
  };
  
  GameBoard.prototype.getCell = function(bpos, spos)
  {
    return [this.getBCell(bpos), this.getSCell(bpos, spos)];
  };
  
  GameBoard.prototype.shape = function(game, pos, animation)
  {
    var shape; 
    var xy = [pos[0][0] * this.bbox + pos[1][0] * this.sbox + 2 * this.padding, pos[0][1] * this.bbox + pos[1][1] * this.sbox + 2 * this.padding];
    pv.shapes.push({'pos': pos, 'game': {'player': game.player, 'moves': game.moves, 'showMoveNumbers': game.showMoveNumbers}});
    if (game.player == 1)
    {
      var k = this.sbox / 2, d = k / 2, xx = xy[0] + k, yy = xy[1] + k;
      shape = 'M' + xx + ',' + yy + 'l-' + d + ',-' + d;
      shape += 'M' + xx + ',' + yy + 'l' + d + ',-' + d;
      shape += 'M' + xx + ',' + yy + 'l-' + d + ',' + d;
      shape += 'M' + xx + ',' + yy + 'l' + d + ',' + d;
    }
    else
    {
      var k1 = this.sbox / 4, k2 = Math.floor(0.45 * k1), k3 = k1 - k2;
      shape = 'M' + (xy[0] + this.sbox / 2) + ',' + (xy[1] + this.sbox / 4);
      shape += 'c' + k3 + ',0 ' + k1 + ',' + k2 + ' ' + k1 + ',' + k1;
      shape += 'c0,' + k3 + ' -' + k2 + ',' + k1 + ' -' + k1 + ',' + k1;
      shape += 'c-' + k3 + ',0 -' + k1 + '-' + k2 + ' -' + k1 + '-' + k1;
      shape += 'c0-' + k3 + ' ' + k2 + '-' + k1 + ' ' + k1 + '-' + k1 + 'z';
    }
    if (animation) 
    {
      this.raphael.path(['M', xy[0], xy[1], 'h', this.sbox, 'v', this.sbox, 'h', -this.sbox, 'Z']).attr(sfattr).animate({'path': shape, 'fill': 'none', 'stroke-width': this.stroke}, 300);
    }
    else 
    {
      this.raphael.path(shape).attr({'fill': 'none', 'stroke': '#5D478B', 'stroke-width': this.stroke}); 
    }
    if (game.showMoveNumbers > 0) this.raphael.text(xy[0] + (game.moves > 9 ? 4 : 3) * Math.floor(this.size / 128), xy[1] + 7, game.moves).attr({'font-size': Math.floor(this.size / 64) + 'px', 'stroke-width': 1, 'stroke': '#1C1C1C'});
  };
  
  GameBoard.prototype.winner = function(player, coordinates)
  {
    pv.isWinner = true;
    pv.winner = player;
    pv.coordinates = coordinates;
    if (coordinates != undefined)
    {
      var zero = coordinates[0], first = coordinates[1].slice(), last = coordinates[3].slice();
      var x = zero[0] * this.bbox + 2 * this.padding, y = zero[1] * this.bbox + 2 * this.padding;
      if (first[0] == last[0]) 
      {
        x += Math.floor(this.sbox / 2);
        last[1]++;
      }
      else if (first[1] == last[1]) 
      {
        y += Math.floor(this.sbox / 2);
        last[0]++;
      }
      else
      {
        if (first[0] > last[0]) first[0]++;
        else last[0]++;
        last[1]++;
      }
      this.line(x + first[0] * this.sbox, y + first[1] * this.sbox, x + last[0] * this.sbox, y + last[1] * this.sbox, '#FFD700', this.stroke - 1);
    }
    var s = this.size / 2, fs = Math.floor(this.size / 16); 
    var text = player == undefined ? 'DRAW' : (player == 2 ? 'NOUGHTS WIN!' : 'CROSSES WIN!');
    text = this.raphael.text(this.size / 2, 0, text).attr({'font': fs + 'px Helvetica', 'stroke': '#00CD00'});
    var part1 = function()
    {
      text.animate({transform: 's2T0,' + s}, 2000, '>', function()
      {
        text.animate({transform: 's1T0,' + (2 * s)}, 2000, '<', part2);
      });
    };
    var part2 = function()
    {
      text.animate({transform: 's2T0,' + s}, 2000, '>', function()
      {
        text.animate({transform: 's1t0,0'}, 2000, '<', part1);
      });
    };
    part1();
  };
  
  GameBoard.prototype.init = function()
  {
    this.raphael.clear();
    this.padding = Math.floor(this.size * 0.012);
    this.bbox = Math.floor((this.size - 2 * this.padding) / 3);
    this.sbox = Math.floor((this.bbox - 2 * this.padding) / 3);
    this.stroke = parseInt(this.size * 0.015);
    this.rect = this.raphael.rect(0, 0, this.size, this.size, this.padding).attr({'fill': '#fff'});
    for (var j, i = 1; i <= 2; i++) 
    {
      j = i * this.bbox + this.padding;
      this.line(j, this.padding, j, this.size - this.padding, '#1C1C1C', 3);
      this.line(this.padding, j, this.size - this.padding, j, '#1C1C1C', 3);
    }
    for (var x, i = 0; i < 3; i++)
    {
      x = i * this.bbox + 2 * this.padding;
      for (var y, j = 0; j < 3; j++)
      {
        y = j * this.bbox + 2 * this.padding;
        for (var t = this.sbox, n = 1; n <= 2; n++, t += this.sbox)
        {
          this.line(x + t, y, x + t, y + this.bbox - 2 * this.padding, '#1C1C1C');
          this.line(y, x + t, y + this.bbox - 2 * this.padding, x + t, '#1C1C1C');
        }
      }
    }
     pv = {'isActive': false, 'isWinner': false, 'shapes': []};
  };
  
  GameBoard.prototype.resize = function(size, padding)
  {
    var data = pv;
    this.size = parseInt(size);
    this.raphael.setSize(this.size, this.size);
    this.init();
    for (var shape, i = 0; i < data.shapes.length; i++)
    {
      shape = data.shapes[i];
      this.shape(shape.game, shape.pos);
    }
    if (data.isWinner) this.winner(data.winner, data.coordinates);
    else if (data.isActive) this.activate(data.events, data.boards);
  };
  
  GameBoard.prototype.activate = function(events, boards)
  {
    var self = this, bframes = [], bframe, sframe;
    var bb, spos, sfx, sfy;
    pv.isActive = true;
    pv.events = events;
    pv.boards = boards;
    var sframeClick = function(event)
    {
      self.rect.unmousemove();
      if (bframe) bframe.remove();
      if (sframe) sframe.remove();
      for (var frame in bframes) bframes[frame].remove();
      pv.isActive = false;
      events.click(self.getCell(bb, spos));
    };
    var sframeMove = function(event)
    {
      bb = event.target.getBBox();
      var flag = false, x = event.layerX || event.offsetX, y = event.layerY || event.offsetY;
      if (!window.opera) 
      {
        x -= bb.x;
        y -= bb.y;
      }
      if (x >= self.padding && y >= self.padding && x <= self.bbox - self.padding && y <= self.bbox - self.padding)
      {
        spos = self.getSBoxPosition(x, y, bb.x, bb.y);
        var cell = self.getSCell(bb, spos);
        flag = cell[0] <= 2 && cell[1] <= 2;
      }
      if (!flag)
      {
        if (sframe) sframe.remove();
        sfx = sfy = undefined;
        return;
      }
      if (spos.x != sfx || spos.y != sfy)
      {
        if (sframe) sframe.remove();
        if (events.move(self.getCell(bb, spos)))
        {
          sframe = self.raphael.rect(spos.x, spos.y, self.sbox, self.sbox).attr(sfattr);
          sframe.click(sframeClick);
        }
        sfx = spos.x; sfy = spos.y;
      }
    };
    if (boards == undefined)
    {
      var bpos, bfx, bfy;
      this.rect.mousemove(function(event)
      {
        var flag = false, x = event.layerX || event.offsetX, y = event.layerY || event.offsetY;
        if (x >= self.padding && y >= self.padding && x <= self.size - self.padding && y <= self.size - self.padding) 
        {
          bpos = self.getBBoxPosition(x, y);
          var cell = self.getBCell(bpos);
          flag = cell[0] <= 2 && cell[1] <= 2;
        }
        if (!flag)
        {
          if (bframe) bframe.remove();
          if (sframe) sframe.remove();
          bfx = bfy = sfx = sfy = undefined;
          return;
        }
        bpos = self.getBBoxPosition(x, y);
        if (bpos.x != bfx || bpos.y != bfy)
        {
          if (bframe) 
          {
            bframe.remove();
            if (sframe) sframe.remove();
          }
          bframe = self.raphael.rect(bpos.x, bpos.y, self.bbox, self.bbox).attr(bfattr);
          bframe.mousemove(sframeMove);
          bfx = bpos.x; bfy = bpos.y;
        }
      });
    }
    else
    {
      for (var frame, board, i = 0; i < boards.length; i++)
      {
        board = boards[i];
        frame = this.raphael.rect(board[0] * this.bbox + this.padding, board[1] * this.bbox + this.padding, this.bbox, this.bbox).attr(bfattr);
        frame.mousemove(sframeMove);
        bframes.push(frame);
      }
    }
  };
  
  return GameBoard;
})();

// Game logic
var Game = (function(undefined)
{
  // Private functions
  // **************************************************************************************************
  var inGame = false;
  
  // Public functions.
  // **************************************************************************************************
  
  var Game = function(canvas, size)
  {
    // Creating the game board.
    this.board = new GameBoard(canvas, size);
    // Creating the bot.
    this.bot = new Bot(this);
    // Creating the human.
    this.human = new Human(this);
  };
  
  Game.prototype.init = function()
  {
    inGame = false;
    this.mode = 0;            // the game mode.
    this.moves = 0;           // the move counter.
    this.last = [];           // the last move coordinates.
    this.game = [];           // the game cells.
    this.player = 1;          // the current player. The valid values is 1 and 2.
    this.difficulty = 1;      // the difficulty level. The valid values are: 0 - easy, 1 - normal, 2 - hard.
    this.showMoveNumbers = 0; // determines whether the move numbers will be shown.
    this.bot.init();          // initialization of the bot.
    this.human.init();        // initialization of the human.
    this.board.init();        // initialization of the game board.
    // Initializing the array of moves.
    for (var i = 0; i < 81; i++) this.game[i] = 0; 
  };
  
  Game.prototype.getIndex = function(pos)
  {
    return 9 * (pos[0][1] * 3 + pos[0][0]) + pos[1][1] * 3 + pos[1][0];
  };
  
  Game.prototype.isEmptyCell = function(pos, game)
  {
    var game = game || this.game;
    return game[Game.prototype.getIndex(pos)] == 0;
  };
  
  Game.prototype.isFullBoard = function(pos, game)
  {
    var game = game || this.game;
    for (var i = 0, k = 9 * (pos[1] * 3 + pos[0]); i < 9; i++) if (game[i + k] == 0) return false;
    return true;
  };
  
  Game.prototype.getNonFullBoards = function(game, last)
  {
    var game = game || this.game;
    var last = last || this.last;
    if (!Game.prototype.isFullBoard(last[1], game)) return [last[1]];
    var boards = [];
    for (var i = 0; i < 3; i++)
    {
      for (var j = 0; j < 3; j++)
      {
        if (!Game.prototype.isFullBoard([i, j], game)) boards.push([i, j]);
      } 
    }
    return boards;    
  };
  
  Game.prototype.hasWinner = function()
  {
    var conditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (var i = 0; i < 81; i += 9)
    {
      for (var j = 0, cond; j < 8; j++)
      {
        cond = conditions[j];
        if (this.game[i + cond[0]] == this.player && this.game[i + cond[1]] == this.player && this.game[i + cond[2]] == this.player)
        {
          return [[Math.floor((i % 27) / 9), Math.floor(i / 27)], [cond[0] % 3, Math.floor(cond[0] / 3)], [cond[1] % 3, Math.floor(cond[1] / 3)], [cond[2] % 3, Math.floor(cond[2] / 3)]];
        }
      }
    }
    return false;
  };
  
  Game.prototype.cell = function(pos)
  {
    this.last = pos;
    this.game[this.getIndex(this.last)] = this.player;
  };
  
  Game.prototype.move = function()
  {
    inGame = true;
    this.moves++;
    if (this.moves == 1)
    {
      if (this.mode == 0 || this.mode == 2) // Human goes first or Human vs Human.
      {
        this.human.move();
      }
      else if (this.mode == 1 || this.mode == 3 ) // Computer goes first, Computer vs Computer.
      {
        this.bot.move();
      }
    }
    else
    {
      var self = this;
      this.player = this.player == 1 ? 2 : 1;
      if (this.mode == 2) this.human.move();
      else if (this.mode == 3) setTimeout(function(){self.bot.move();}, 500);
      else if (this.mode == 0 && this.player == 1 || this.mode == 1 && this.player == 2) this.human.move();
      else this.bot.move();
    }
  };
  
  Game.prototype.inGame = function()
  {
    return inGame;
  };
  
  Game.prototype.win = function(coordinates)
  {
    inGame = false;
    this.board.winner(this.player, coordinates);
  };
  
  Game.prototype.draw = function()
  {
    this.board.winner();
  };
  
  return Game;
})();
  
// Human
var Human = (function(undefined)
{
  // Public functions.
  // **************************************************************************************************
  
  var Human = function(game)
  {
    this.game = game;
    this.events = {};
  };
  
  Human.prototype.init = function()
  {
    var self = this;
    var move = function(pos)
    {
      return self.game.isEmptyCell(pos);
    };
    var click = function(pos)
    {
      self.game.board.shape(self.game, pos, true);
      self.game.cell(pos);
      var coordinates = self.game.hasWinner();
      if (coordinates !== false) self.game.win(coordinates);
      else self.game.move();
    };
    this.events = {'move': move, 'click': click};
  };
  
  Human.prototype.move = function()
  {
    if (this.game.moves == 1)
    {
      this.game.board.activate(this.events);
    }
    else
    {
      var boards = this.game.getNonFullBoards();
      if (boards.length == 0) this.game.draw();
      else this.game.board.activate(this.events, boards);
    }
  };

  return Human;
})();

// Bot
var Bot = (function(undefined)
{
  // Private functions.
  // **************************************************************************************************
  
  var rand = function(from, to)
  {
    return Math.floor(Math.random() * (parseInt(to) + 1)) + parseInt(from);
  };
  
  // Public functions.
  // **************************************************************************************************
  
  var Bot = function(game)
  {
    this.game = game;
  };
  
  Bot.prototype.init = function()
  {
    if (this.worker) 
    {
      this.worker.terminate();
      document.body.style.cursor = 'default';
    }
    this.logic = {// Victory positions:
                  'pppXXXXXX': 1000000,
                  'XXXpppXXX': 1000000,
                  'XXXXXXppp': 1000000,
                  'pXXpXXpXX': 1000000,
                  'XpXXpXXpX': 1000000,
                  'XXpXXpXXp': 1000000,
                  'pXXXpXXXp': 1000000,
                  'XXpXpXpXX': 1000000,                                
                  // Almost winning positions:
                  'pp0XXXXXX': 8,
                  'p0pXXXXXX': 8,
                  '0ppXXXXXX': 8,
                  'XXXpp0XXX': 8,
                  'XXXp0pXXX': 8,
                  'XXX0ppXXX': 8,
                  'XXXXXXpp0': 8,
                  'XXXXXXp0p': 8,
                  'XXXXXX0pp': 8,
                  'pXXpXX0XX': 8,
                  'pXX0XXpXX': 8,
                  '0XXpXXpXX': 8,
                  'XpXXpXX0X': 8,
                  'XpXX0XXpX': 8,
                  'X0XXpXXpX': 8,
                  'XXpXXpXX0': 8,
                  'XXpXX0XXp': 8,
                  'XX0XXpXXp': 8,
                  'pXXXpXXX0': 8,
                  'pXXX0XXXp': 8,
                  '0XXXpXXXp': 8,
                  'XXpXpX0XX': 8,
                  'XXpX0XpXX': 8,
                  'XX0XpXpXX': 8,
                  // Positions that break the almost winning positions of the opposer.
                  'oopXXXXXX': 16,
                  'opoXXXXXX': 16,
                  'pooXXXXXX': 16,
                  'XXXoopXXX': 16,
                  'XXXopoXXX': 16,
                  'XXXpooXXX': 16,
                  'XXXXXXoop': 16,
                  'XXXXXXopo': 16,
                  'XXXXXXpoo': 16,
                  'oXXoXXpXX': 16,
                  'oXXpXXoXX': 16,
                  'pXXoXXoXX': 16,
                  'XoXXoXXpX': 16,
                  'XoXXpXXoX': 16,
                  'XpXXoXXoX': 16,
                  'XXoXXoXXp': 16,
                  'XXoXXpXXo': 16,
                  'XXpXXoXXo': 16,
                  'oXXXoXXXp': 16,
                  'oXXXpXXXo': 16,
                  'pXXXoXXXo': 16,
                  'XXoXoXpXX': 16,
                  'XXoXpXoXX': 16,
                  'XXpXoXoXX': 16,
                  // Positions that break the opposer's winning position in perspective.
                  //'p00XXXXXX': 1,
                  //'00pXXXXXX': 1,
                  //'XXXXXXp00': 1,
                  //'XXXXXX00p': 1,
                  //'pXX0XX0XX': 1,
                  //'0XX0XXpXX': 1,
                  //'XXpXX0XX0': 1,
                  //'XX0XX0XXp': 1,
                  //'X0XXpXX0X': 1,
                  //'XXX0p0XXX': 1,
                  //'pXXX0XXX0': 1,
                  //'0XXXpXXX0': 1,
                  //'0XXX0XXXp': 1,
                  //'XXpX0X0XX': 1,
                  //'XX0XpX0XX': 1,
                  //'XX0X0XpXX': 1,                                
                  'po0XXXXXX': 4,
                  'p0oXXXXXX': 4,
                  '0poXXXXXX': 4,
                  '0opXXXXXX': 4,
                  'o0pXXXXXX': 4,
                  'op0XXXXXX': 4,
                  'XXX0opXXX': 4,
                  'XXX0poXXX': 4,
                  'XXXpo0XXX': 4,
                  'XXXp0oXXX': 4,
                  'XXXo0pXXX': 4,
                  'XXXop0XXX': 4,
                  'XXXXXXp0o': 4,
                  'XXXXXXpo0': 4,
                  'XXXXXX0po': 4,
                  'XXXXXX0op': 4,
                  'XXXXXXop0': 4,
                  'XXXXXXo0p': 4,
                  'pXX0XXoXX': 4,
                  'pXXoXX0XX': 4,
                  'oXX0XXpXX': 4,
                  'oXXpXX0XX': 4,
                  '0XXoXXpXX': 4,
                  '0XXpXXoXX': 4,
                  'XpXX0XXoX': 4,
                  'XpXXoXX0X': 4,
                  'XoXX0XXpX': 4,
                  'XoXXpXX0X': 4,
                  'X0XXoXXpX': 4,
                  'X0XXpXXoX': 4,
                  'XXpXX0XXo': 4,
                  'XXpXXoXX0': 4,
                  'XXoXX0XXp': 4,
                  'XXoXXpXX0': 4,
                  'XX0XXoXXp': 4,
                  'XX0XXpXXo': 4,
                  'pXXX0XXXo': 4,
                  'pXXXoXXX0': 4,
                  '0XXXoXXXp': 4,
                  '0XXXpXXXo': 4,
                  'oXXX0XXXp': 4,
                  'oXXXpXXX0': 4,     
                  'XXpX0XoXX': 4,
                  'XXpXoX0XX': 4,
                  'XX0XoXpXX': 4,
                  'XX0XpXoXX': 4,
                  'XXoX0XpXX': 4,
                  'XXoXpX0XX': 4};
  }
  
  Bot.prototype.move = function()
  {
    if (!this.game.inGame()) return;
    document.body.style.cursor = 'wait';
    var self = this, go = function(moves)
    {
      document.body.style.cursor = 'default';
      if (moves.length == 0)
      {
        self.game.draw();
        return;
      }
      self.game.cell(moves[rand(0, moves.length - 1)]);
      self.game.board.shape(self.game, self.game.last, true);
      var coordinates = self.game.hasWinner();
      if (coordinates !== false) self.game.win(coordinates);
      else self.game.move();
    };
    if (this.game.moves == 1) go([[[rand(0, 2), rand(0, 2)], [rand(0, 2), rand(0, 2)]]]);
    else
    {
      // Trying to do optimal move.
      if (!window.Worker) go(this.getOptimalMoves(this.game.getNonFullBoards()));
      else
      {
        this.worker = new Worker('bot.js');
        this.worker.addEventListener('message', function(e){go(e.data);}, false);
        this.worker.postMessage({'boards': this.game.getNonFullBoards(), 'game': {'player': this.game.player, 'difficulty': this.game.difficulty, 'game': this.game.game, 'moves': this.game.moves}});
      }
    }
  };
  
  Bot.prototype.getOptimalMoves = function(boards, game)
  {
    var moves = [], cells = [], max = -1000000000, game = game || this.game;
    var level = 2 * game.difficulty + 1 , opposer = game.player == 2 ? 1 : 2;
    if (level >= 7) 
    {
      if (game.moves <= 18) level = 5;
      else if (level >= 9 && game.moves <= 27) level = 7;
    }
    // Getting estimates of all possible moves.
    for (var estimate, cell, board, k = 0; k < boards.length; k++)
    {
      board = boards[k];
      for (var i = 0; i < 3; i++)
      {
        for (var j = 0; j < 3; j++)
        {
          cell = [board, [i, j]];
          if (Game.prototype.isEmptyCell(cell, game.game))
          {
            estimate = this.getMoveEstimate(cell, {'level': level, 'game': game.game.slice(), 'player': game.player, 'opposer': opposer});
            cells.push([estimate, cell]);
            if (estimate > max) max = estimate;
          }
        }
      }
    }
    // Choosing of moves with maximum estimate of optimality.
    for (var i = 0; i < cells.length; i++)
    {
      if (cells[i][0] == max) moves.push(cells[i][1]);
    }
    return moves;
  };
  
  Bot.prototype.getMoveEstimate = function(cell, context)
  {
    var idx, c1 = c2 = c3 = c4 = c5 = '', estimate = 0;
    context.game[Game.prototype.getIndex(cell)] = context.player;
    idx = 9 * (3 * cell[0][1] + cell[0][0]);
    for (var s, i = 0; i < 3; i++)
    {
      for (var j = 0; j < 3; j++)
      {
        s = context.game[idx] == context.player ? 'p' : (context.game[idx] == context.opposer ? 'o' : '0');
        if (cell[1][0] == j) c1 += s; 
        else c1 += 'X';        
        if (cell[1][1] == i) c2 += s;
        else c2 += 'X';
        if (cell[1][0] == cell[1][1] && i == j) c3 += s;
        else c3 += 'X';
        if (cell[1][0] + cell[1][1] == 2 && i + j == 2) c4 += s;
        else c4 += 'X';
        idx++;
      }
    }
    estimate += this.logic[c1] || 0;
    estimate += this.logic[c2] || 0;
    estimate += this.logic[c3] || 0;
    estimate += this.logic[c4] || 0;
    if (context.level > 0 && estimate < 1000000)
    {
      var boards = Game.prototype.getNonFullBoards(context.game, cell), max = -1000000000;
      for (var board, e, k = 0; k < boards.length; k++)
      {
        board = boards[k];
        for (var i = 0; i < 3; i++)
        {
          for (var j = 0; j < 3; j++)
          {
            cell = [board, [i, j]];
            if (Game.prototype.isEmptyCell(cell, context.game))
            {            
              e = this.getMoveEstimate(cell, {'level': context.level - 1, 'game': context.game.slice(), 'player': context.opposer, 'opposer': context.player, 'factors': context.factors});
              if (e > max) max = e;
            }
          }
        }
      }
      estimate -= max;
    }
    return estimate;
  };
  
  return Bot;
})();

// Gameplay
var TicTacToe = (function(undefined)
{ 
  // Public functions.
  // **************************************************************************************************
  
  var TicTacToe = function(canvas, size)
  {
    // Creating the game.
    this.game = new Game(canvas, size);
    this.game.init();
  };
  
  TicTacToe.prototype.start = function(mode)
  {
    if (mode < 0) mode = 0;
    if (mode > 4) mode = 4;
    this.game.mode = mode;
    this.game.player = 1;
    this.game.move();
  };
  
  TicTacToe.prototype.stop = function()
  {
    this.game.init();
  };

  return TicTacToe;
})();