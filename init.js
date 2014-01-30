function $(id)
{
  return document.getElementById(id);
}

function hide(id)
{
  $(id).style.display = 'none';
}

function show(id, display)
{
  $(id).style.display = display != undefined ? display : 'block';
}

function calculateHeight()
{
  var height;
  if (window.opera || typeof navigator.taintEnabled == 'undefined') height = window.innerHeight;
  else height = (!document.compatMode || document.compatMode == 'CSS1Compat' ? document.documentElement : document.body).clientHeight;
  height *= 0.8299;
  $('canvas').style.height = height + 'px';
  $('canvas').style.width = height + 'px';
  return height;
}

function evolve(population, bots)
{
  $('population').innerHTML = population;
}

function interrupt(e)
{
  Bot.prototype.evolve(false);
  show('shadow');
  hide('evolution');
  if (ttt.game.inGame())
  {
    show('dialog');
    $('yes').focus();
    $('no').onclick = function()
    {
      hide('dialog');
      hide('shadow');
    };
    $('yes').onclick = function()
    {
      hide('stop');
      hide('dialog');
      show('popup');
      ttt.stop();
    };
  }
  else
  {
    show('popup');
    hide('stop');
    ttt.stop();
  }
}

// UI events.
$('stop').onclick = interrupt;

document.getElementById('help').onmouseover = function()
{
  var width;
  if (window.opera || typeof navigator.taintEnabled == 'undefined') width = window.innerWidth;
  else width = (!document.compatMode || document.compatMode == 'CSS1Compat' ? document.documentElement : document.body).clientWidth;
  width -= 65;
  var el = $('manual');
  el.style.display = 'block';
  el.style.width = (width / 2) + 'px';
  el.style.left = (width / 4) + 'px';
};

$('help').onmouseout = function()
{
  hide('manual');
};

$('start').onclick = function()
{
  var mode = $('mode').value;
  hide('shadow');
  hide('popup');
  show('stop');
  if (mode == 4)
  {
    show('evolution');
    Bot.prototype.evolve(evolve);
  }
  else
  {
    ttt.start({'mode': mode, 'difficulty': $('difficulty').value, 'showMoveNumbers': $('moveNumbers').value});
  }
};

$('apply').onclick = function()
{
  Bot.prototype.applyLogic();
  var el = $('apply');
  el.innerHTML = 'Bot logic has been successfully applied';
  el.className = 'success';
  setTimeout(function()
  {
    el.innerHTML = 'Apply the last evolved bot logic';
    el.className = '';
  }, 3000);
};

$('restore').onclick = function()
{
  Bot.prototype.restoreLogic();
  var el = $('restore');
  el.innerHTML = 'Bot logic has been successfully restored';
  el.className = 'success';
  setTimeout(function()
  {
    el.innerHTML = 'Restore the default bot logic';
    el.className = '';
  }, 3000);
};

$('reset').onclick = function()
{
  hide('reset');
  hide('restore');
  hide('apply');
  hide('msg1');
  show('resetYes', '');
  show('resetNo', '');
  show('msg2');
};

$('resetNo').onclick = function()
{
  hide('resetYes');
  hide('resetNo');
  hide('msg2');
  show('reset', '');
  show('restore', '');
  show('apply', '');
  show('msg1');
};

$('resetYes').onclick = function()
{
  Bot.prototype.resetLogic();
  Bot.prototype.evolve(false);
  Bot.prototype.evolve(evolve);
  $('resetNo').onclick();
};

window.onresize = function()
{
  ttt.game.board.resize(calculateHeight());
}

document.body.onkeyup = function(e)
{
  if ((e || event).keyCode == 27 && $('shadow').style.display == 'none') interrupt();
};

var ttt = new TicTacToe('canvas', calculateHeight());
ttt.game.board.init();