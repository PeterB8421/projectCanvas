$(function() {
//$("#statButton").hide();
//Tvorba globálních proměnných
var inRow = 4;
//Pole pro uložení vytvořených obdélníků
var rects = [];
//Použité barvy
var colors = ["red", "green", "blue", "yellow", "gray", "darkorange", "blueviolet", "cyan"];
var lastColor = colors.length+1;
var colorsCZ = ["červenou", "zelenou", "modrou", "žlutou", "šedou", "oranžovou", "fialovou", "světle modrou"];
var usedColors = [];
var gameNr = 0;
var tries = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvProperties = canvas.getBoundingClientRect();
var player = new Circle(canvProperties.width/2,canvProperties.height/2,10);
var rounds = 1;
var time;
var started = false;
var maxSpeed;
var minTime;
var diff;
//var opened = false;
var fps = 60;
//Vyplnění canvasu obdélníky
fillRects();
//Vykreslení hráče
player.paint(ctx);
//Nastavení FPS (nevím, jestli funguje, asi ne)
setInterval(function(){
    rects.forEach(function(obj){
        obj.paint(ctx);
    });
    player.paint(ctx);
},1000/fps);

//Debugovací funkce pro zobrazení pole obdélníků, nějak nefunguje :/
function showRects(){
    rects.forEach(function(obj){
        console.log(rects[obj]);
    })
}
//Akce při kliknutí na (Re)Start, nastavení obtížnosti, znovu vykreslení obdélníku
document.getElementById('start').addEventListener('click', function(){
    if(document.getElementById('diffE').checked){
        diff = "lehkou";
        time = 15;
        inRow = 4;
        maxSpeed = 12;
        minTime = 4;
    }
    if (document.getElementById("diffM").checked) {
        diff = "střední";
        time = 10;
        inRow = 6;
        maxSpeed = 8;
        minTime = 3;
    }
    if (document.getElementById("diffH").checked) {
        diff = "těžkou";
        time = 5;
        inRow = 8;
        maxSpeed = 5;
        minTime = 2;
    }
    player.speed = 5;
    fillRects();
    rects.forEach(function(obj) {
        obj.paint(ctx);
    })
    player.paint(ctx);
    rounds = 1;
    startRound();
})
//Ovládání hráče
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

    //Work in progress...
/*document.getElementById('statButton').addEventListener('click', function(){
    if(opened){
        this.innerHTML = 'Sbalit';
    }
    else{
        this.innerHTML = 'Rozbalit';
    }
    for(i = 5; i <= gameNr; i++){
        $("#stat"+i).toggle(100);
    }
})*/
//Začátek kola
function startRound(){
    $("#diffForm").hide();
    document.getElementById('counter').innerHTML = '<br>';
    player.fillStyle = "white";
    document.getElementById('round').innerHTML = '<b>'+rounds+'.</b> kolo';
    started = true;
    var indexColor = Math.floor(Math.random() * colors.length);
    //Zajištění, aby se neopakovala dvakrát stejná barva
    if(indexColor == lastColor){
        if(indexColor >= colors.length-1){
            indexColor = 0;
        }
        else{
            indexColor++;
        }    
    }
    lastColor = indexColor;
    var chosenColor = colors[indexColor];
    document.getElementById('chosenColor').innerHTML = colorsCZ[indexColor];
    document.getElementById('chosenColor').style.backgroundColor = colors[indexColor];
    document.getElementById('message').innerHTML = "<br>";
    var timeleft = time;
    //Odpočet do konce kola
    var downloadTimer = setInterval(function(){
    document.getElementById('counter').style.color = "black";
    timeleft--;
    document.getElementById("counter").textContent = timeleft;
    if(timeleft > 0 && timeleft <= 2){
        document.getElementById('counter').style.color = "red";
    }
    else{
        document.getElementById('counter').style.color = "black";
    }
    //Po vypršení timeru ukončení kola
    if(timeleft <= 0){
        clearInterval(downloadTimer);
        setTimeout(endRound(chosenColor), time);
    }
    },1000);   
}

//Ukončení kola
function endRound(color){
    document.getElementById('counter').innerHTML = '<br>';
    document.getElementById('chosenColor').style.backgroundColor = "white";
    document.getElementById('chosenColor').innerHTML = '<br>';
    //Zrychlení pohybu hráče dle obtížnosti
    if(player.speed >= maxSpeed){
        player.speed = maxSpeed;
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
    //Kontrola, zda se hráč nachází ve správné barvě
    rects.forEach(function(obj){
        if(obj.fillStyle == color){
            if(obj.bound(player.x,player.y)){
                isIn = true;
            }
        }
    });
    //Pokud ne, ukonči hru
    if(!isIn){
        player.fillStyle = "darkred";
        rects.forEach(function(obj){
            obj.paint(ctx);
        })
        player.paint(ctx);
        document.getElementById('message').innerHTML = '<b>Konec hry!</b>';
        endGame();
    }
    //Pokud ano, pokračuj dalším kolem, po určitém časové limitu (2 sek.)
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
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                setTimeout(startRound(),time);
            }
        },1000);
    }
    return;
}

//Ukončení hry
function endGame(){
    var ending;
    //Zajištění korektního vypsání dle českého skloňování
    if(rounds == 1){
        ending = 'o';
    }
    else if(rounds > 1 && rounds < 5){
        ending = 'a';
    }
    else{
        ending = '';
    }
    $("#diffForm").show();
    started = false;
    //Zprávy po dokončení hry
    document.getElementById('message').innerHTML += '<br>Počet dokončených kol: '+rounds;
    document.getElementById('start').innerHTML = "Restart";
    tries.push(rounds);
    document.getElementById('stats').innerHTML += '<p id="stat'+gameNr+'">Na '+(++gameNr)+'. pokus jsi přežil '+rounds+' kol'+ending+'. Na obtížnost <b>'+diff+'.</b><br></p>'
    /*if(gameNr > 5){
        if(gameNr == 5){
            $("#statButton").show();
        }
        $("stat"+gameNr).hide();
    }*/
}

//Funkce pro vyplnění canvasu obdélníky
function fillRects(){
    var notIn = true;
    var current;
    var x = 0;
    var y = 0;
    var index = 0;
    rects = [];
    usedColors = [];
    if(usedColors.length == colors.length){
        allIn = true;
    }
    for(j = 0; j < inRow; j++){
        x = 0;
        for(i = 0; i < inRow; i++){
            //Generátor náhodných čísel (barev), snaha aby se barvy nevykreslovaly stejně do diagonály
            if(usedColors.length >= colors.length){
                index = Math.floor(Math.pow(Math.random() * colors.length) / colors.length);
            }
            else{
                index = Math.floor(Math.random() * colors.length);
            }
            //Zajištění, aby se vždy vykreslila alespoň jedna z každé barvy
            if (usedColors.length != colors.length) {
              for (k = 0; k < usedColors.length; k++) {
                if (usedColors[k] == colors[index]) {
                  index++;
                  if (index > colors.length) {
                    index = 0;
                  }
                }
              }
            }
            current = new Rectangle(x,y,canvProperties.width/inRow,canvProperties.height/inRow,colors[index]);
            rects.push(current);
            usedColors.forEach(function(obj){
                if(usedColors[obj] == colors[index]){
                    notIn = false;
                }
            })
            if(notIn){
                usedColors.push(colors[index]);
            }
            x += canvas.width/inRow;
        }
    y += canvas.height/inRow;
    }
    //Ošetření v případě chybně vybrané barvy
    rects.forEach(function(obj){
        if(obj.fillStyle == null){
            obj.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        }
    })
    //Vykreslení obdélníků
    for(i = 0; i < rects.length; i++){
        rects[i].paint(ctx);
    }
    return;
}
})