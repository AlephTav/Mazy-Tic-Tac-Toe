function $(a){return document.getElementById(a)}function hide(a){$(a).style.display="none"}function show(b,a){$(b).style.display=a!=undefined?a:"block"}function calculateHeight(){var a;if(window.opera||typeof navigator.taintEnabled=="undefined"){a=window.innerHeight}else{a=(!document.compatMode||document.compatMode=="CSS1Compat"?document.documentElement:document.body).clientHeight}a*=0.8299;$("canvas").style.height=a+"px";$("canvas").style.width=a+"px";return a}function evolve(a,b){$("population").innerHTML=a}function interrupt(a){Bot.prototype.evolve(false);show("shadow");hide("evolution");if(ttt.game.inGame()){show("dialog");$("yes").focus();$("no").onclick=function(){hide("dialog");hide("shadow")};$("yes").onclick=function(){hide("stop");hide("dialog");show("popup");ttt.stop()}}else{show("popup");hide("stop");ttt.stop()}}$("stop").onclick=interrupt;document.getElementById("help").onmouseover=function(){var b;if(window.opera||typeof navigator.taintEnabled=="undefined"){b=window.innerWidth}else{b=(!document.compatMode||document.compatMode=="CSS1Compat"?document.documentElement:document.body).clientWidth}b-=65;var a=$("manual");a.style.display="block";a.style.width=(b/2)+"px";a.style.left=(b/4)+"px"};$("help").onmouseout=function(){hide("manual")};$("start").onclick=function(){var a=$("mode").value;hide("shadow");hide("popup");show("stop");if(a==4){show("evolution");Bot.prototype.evolve(evolve)}else{ttt.start({mode:a,difficulty:$("difficulty").value,showMoveNumbers:$("moveNumbers").value})}};$("apply").onclick=function(){Bot.prototype.applyLogic();var a=$("apply");a.innerHTML="Bot logic has been successfully applied";a.className="success";setTimeout(function(){a.innerHTML="Apply the last evolved bot logic";a.className=""},3000)};$("restore").onclick=function(){Bot.prototype.restoreLogic();var a=$("restore");a.innerHTML="Bot logic has been successfully restored";a.className="success";setTimeout(function(){a.innerHTML="Restore the default bot logic";a.className=""},3000)};$("reset").onclick=function(){hide("reset");hide("restore");hide("apply");hide("msg1");show("resetYes","");show("resetNo","");show("msg2")};$("resetNo").onclick=function(){hide("resetYes");hide("resetNo");hide("msg2");show("reset","");show("restore","");show("apply","");show("msg1")};$("resetYes").onclick=function(){Bot.prototype.resetLogic();Bot.prototype.evolve(false);Bot.prototype.evolve(evolve);$("resetNo").onclick()};window.onresize=function(){ttt.game.board.resize(calculateHeight())};document.body.onkeyup=function(a){if((a||event).keyCode==27&&$("shadow").style.display=="none"){interrupt()}};var ttt=new TicTacToe("canvas",calculateHeight());ttt.game.board.init();