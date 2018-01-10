var inRow = 4;
var rects = [];
var colors = ["red", "green", "blue", "yellow", "gray", "orange", "blueviolet", "cyan"];
var lastColor = '';
var colorsCZ = ["červenou", "zelenou", "modrou", "žlutou", "šedou", "oranžovou", "fialovou", "světle modrou"];
var usedColors = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvProperties = canvas.getBoundingClientRect();
var player = new Circle(canvProperties.width/2,canvProperties.height/2,10);
var rounds = 1;
var time = 15;
var started = false;
fillRects();
player.paint(ctx);

document.getElementById('start').addEventListener('click', function(){
    rounds = 1;
    time = 15;
    startRound();
})
document.addEventListener('keydown', function(key){
    if(started){
        switch(key.code){
            case 'ArrowUp':
                player.y -= player.speed;
                if(player.y < 0){
                    player.y += player.speed;
                    break;
                }
                break;
            case 'ArrowDown':
                player.y += player.speed;
                if(player.y > canvProperties.height){
                    player.y -= player.speed;
                    break;
                }
                break;
            case 'ArrowLeft':
                player.x -= player.speed;
                if(player.x < 0){
                    player.x += player.speed;
                    break;
                }
                break;
            case 'ArrowRight':
                player.x += player.speed;
                if(player.x > canvProperties.width){
                    player.x -= player.speed;
                    break;
                }
                break;
        }
        rects.forEach(function(obj){
            obj.paint(ctx);
        });
        player.paint(ctx);
    }
    })

function startRound(){
    player.fillStyle = "white";
    document.getElementById('round').innerHTML = '<b>'+rounds+'.</b> kolo';
    started = true;
    var indexColor = Math.floor(Math.random() * colors.length);
    if(colors[indexColor] == lastColor){
        if(indexColor >= colors.length){
            indexColor = 0;
        }
        else{
            indexColor++;
        }
    }
    var chosenColor = colors[indexColor];
    document.getElementById('chosenColor').innerHTML = colorsCZ[indexColor];
    document.getElementById('chosenColor').style.color = colors[indexColor];
    document.getElementById('message').innerHTML = "";
    var timeleft = time;
    var downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("counter").textContent = timeleft;
    if(timeleft <= 0){
        clearInterval(downloadTimer);
        setTimeout(endRound(chosenColor), time);
    }
    },1000);   
}

function endRound(color){
    if(player.speed >= 15){
        player.speed = 15;
    }
    else{
        player.speed++;
    }
    if(time <= 3){
        time = 3;
    }
    else{
        time --;
    }
    var isIn = false;
    rects.forEach(function(obj){
        if(obj.fillStyle == color){
            if(obj.bound(player.x,player.y)){
                isIn = true;
            }
        }
    });
    if(!isIn){
        player.fillStyle = "darkred";
        rects.forEach(function(obj){
            obj.paint(ctx);
        })
        player.paint(ctx);
        document.getElementById('message').innerHTML = '<b>Konec hry!</b>';
        endGame();
    }
    else{
        player.fillStyle = "chartreuse";
        rects.forEach(function(obj){
            obj.paint(ctx);
        })
        player.paint(ctx);
        document.getElementById('message').innerHTML = "Kolo dokončeno!";
        rounds++;
        var timeleft = 2;
        var downloadTimer = setInterval(function(){
            timeleft--;
            document.getElementById("counter").textContent = timeleft;
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                setTimeout(startRound(),time);
            }
        },1000);
    }
    return;
}

function endGame(){
    started = false;
    document.getElementById('message').innerHTML += '<br>Počet dokončených kol: '+rounds;
    document.getElementById('start').innerHTML = "Restart";
}

function fillRects(){
    var current;
    var x = 0;
    var y = 0;
    var index = 0;
    for(j = 0; j < inRow; j++){
        x = 0;
        for(i = 0; i < inRow; i++){
            index = Math.floor(Math.random() * colors.length);
            if(usedColors.length != colors.length){
                for(k = 0; k < usedColors.length; k++){
                    if(usedColors[k] == colors[index]){
                        index++;
                        if(index > colors.length){
                            index = 0;
                        }
                    }
                }
            }
            current = new Rectangle(x,y,canvProperties.width/inRow,canvProperties.height/inRow,colors[index]);
            rects.push(current);
            usedColors.push(colors[index]);
            x += canvas.width/inRow;
        }
    y += canvas.height/inRow;
    }
    for(i = 0; i < rects.length; i++){
        rects[i].paint(ctx);
    }
    return;
}