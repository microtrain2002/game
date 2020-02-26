var game = (function(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
  
    var player = {
      x:0,
      y:475,
      h: 25,
      w: 25,
      fill: '#ff0',
      dir: 'right',
      speed: 5
    }
  
    var spawn = {
      x: 50,
      y: 0,
      h: 10,
      w: 10,
      fill: '#fff',
      speed: 5
    }
  
    var spawns = {}
  
    var spawner = null;
  
    //1. Add the animation frames to a variable
    //that we can kill later
    var animation  = null;
  
    //2. Track the state of game-over
    var gameOver = false;
  
    //1. Create a variable to hold the score
    var score = 0;
  
    function launchSpawns(){
      spawner = setInterval(()=>{
  
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";
  
        for (var i = 0; i < 10; i++){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
  
        spawns[text] = {
          x:Math.floor(Math.random()*this.canvas.width),
          y:spawn.y,
          h:spawn.h,
          w:spawn.w,
          fill:spawn.fill,
          speed:Math.floor(Math.random() * 7),
        }
  
      },400);
    }
  
  
  
    return {
      //Note: For collision detection to work, spawns and players need a common scope. 
      //For now, we are focused on a proof of concept so we will move the moveSpawns() method
      //to within the return object. We will refactor this later.
      moveSpawns: function(){
  
        if(Object.keys(spawns).length>0){
          for(let spawn in spawns){
  
            if(spawns[spawn].y<=canvas.height){
  
  
              ctx.fillStyle = spawns[spawn].fill;
  
  
              ctx.save();
  
              ctx.clearRect(
                spawns[spawn].x-1,
                spawns[spawn].y-spawns[spawn].speed,
                spawns[spawn].w+2,
                spawns[spawn].h+2
              );
  
              ctx.fillRect(
                spawns[spawn].x,
                spawns[spawn].y = (spawns[spawn].y+spawns[spawn].speed),
                spawns[spawn].w,
                spawns[spawn].h
              );
  
              ctx.restore();
  
              //3. When each spawn moves detect if that spawn shares common pixels
              //with the player. If so this is a collision.
              //@see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
              if (
                player.x < spawns[spawn].x + spawns[spawn].w &&
                spawns[spawn].x > player.x && spawns[spawn].x < (player.x + player.w) &&
                player.y < spawns[spawn].y + spawns[spawn].h &&
                player.y + player.h > spawns[spawn].y
              ){
                //4. If there is a collision set gameOver to true
                gameOver = true;
                //5. ...kill the animation frames
                cancelAnimationFrame(animation);
                //6. ...kill the spawner
                clearInterval(spawner);
              }
  
            }else{
            //2. Increment the score when any time
            //an enemy sprite move off screen
            score = score + 10;
            //3. Write the score to a separate div
            document.getElementById('score').innerHTML = score;
            delete spawns[spawn];
            }
          }
        }
  
      },
  
      player: function(){
        ctx.fillStyle=player.fill;
  
        if(player.dir === 'right'){
  
          ctx.clearRect(
            player.x-player.speed,
            player.y-1,
            player.w+2,
            player.h+2
          );
  
          ctx.fillRect(
            player.x = (player.x + player.speed),
            player.y,
            player.w,
            player.h
          );
  
          if((player.x + player.w) >= canvas.width){
            player.dir = 'left';
          }
  
        }else{
  
          ctx.clearRect(
            player.x+player.speed,
            player.y-1,
            player.w+2,
            player.h+2
          );
  
          ctx.fillRect(
            player.x = (player.x - player.speed),
            player.y,
            player.w,
            player.h
          );
  
          if(player.x <= 0){
            player.dir = 'right';
          }
        }
      },
  
      changeDirection: function(){
        if(player.dir === 'left'){
          player.dir = 'right';
        }else if(player.dir === 'right'){
          player.dir = 'left';
        }
      },
  
      animate: function(){
        this.player();
        this.moveSpawns();
        //7. Only animate if the game is not over.
        if(gameOver===false){
          animation = window.requestAnimationFrame(this.animate.bind(this));
        }
  
      },
  
      init: function(){
        canvas.height = 600;
        canvas.width = 800;
  
        launchSpawns();
        this.animate();
      }
    }
  })();
  
  game.init();
  
  window.addEventListener('keyup', function(){
    game.changeDirection();
  });