/* Objekt Kruh
** x, y - souřadnice středu
** radius - poloměr
*/
function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.type = "circle";         // typ objektu
  this.label = "Label";         // popisek
  this.radius = radius;
  this.drag = {                 // vlastnosti přesouvaného objektu
    dx: 0,                      // relativní posun souřadnice x
    dy: 0,                      // relativní posun souřadnice y
    enabled: false              // přesunutí povoleno
  };
  this.speed = 4;               // rychlost pohybu objektu
  this.fillStyle = "white";      // barva výplně
  this.strokeStyle = "black";   // barva obrysu
  this.lineWidth = 5;           // tloušťka obrysu
  this.lineDash = [];           // vzor obrysové čáry

  /* Metoda detekující kurzor v oblasti objektu; 
  ** cx, cy - souřadnice kurzoru
  ** return boolean - true (kurzor) 
  */
  this.bound = function(cx, cy) {
    // absolutní vzdálenost kurzoru vůči středu kruhu  
    var dx = Math.abs(cx - this.x);
    var dy = Math.abs(cy - this.y);
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    // je-li vzdálenost menší nebo rovna poloměru = true
    return distance <= this.radius;
  };

  /* Metoda vykreslující objekt; 
  ** ctx - grafický kontext
  */  
  this.paint = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.setLineDash(this.lineDash);
    ctx.arc(this.x, this.y, this.radius, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    ctx.clip();
    // Jestliže je vytvořen obrázek, bude vykreslen v objektu
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
      // Ořez obrázku podle tvaru kruhu
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, this.radius, 0, 2 * Math.PI, true);
      ctx.clip();
      ctx.closePath();
    }
    // Jestliže je nastavena cesta k obrázku, bude vytvořen a načten obrázek
    if (this.image == null && this.urlImage) {
      this.image = new Image();
      this.image.src = this.urlImage;
      var par = {
        image: this.image,
        x: this.x,
        y: this.y,
        radius: this.radius
      };
      // Po načtení obrázku dojde k jeho vykreslení
      this.image.onload = function() {
        ctx.drawImage(
          par.image,
          par.x - par.radius,
          par.y - par.radius,
          par.radius * 2,
          par.radius * 2
        );
      };
    }
    ctx.restore();
  };

  /* Metoda zobrazující popisek pod objektem; 
  ** ctx - grafický kontext
  */   
  this.showLabel = function(ctx) {
    ctx.font = "16px sans";
    var wLabel = Math.ceil(ctx.measureText(this.label).width / 2 + 5);
    ctx.fillStyle = "#ccc";
    ctx.fillRect(this.x - wLabel, this.y + this.radius, wLabel * 2, 20);
    ctx.fillStyle = "#333";
    ctx.fillText(this.label, this.x - wLabel + 5, this.y + this.radius + 16);
  };

  /* Metoda zajišťuje pohyb objektu v rámci canvasu; 
  ** dx, dy - posun v ose x a y
  ** canvas - odkaz na objekt plátna
  */   
  this.move = function(dx, dy, canvas) {
    this.x += dx;
    if (this.x >= canvas.width - this.radius)
      this.x = canvas.width - this.radius;
    if (this.x <= this.radius) this.x = this.radius;
    this.y += dy;
    if (this.y >= canvas.height - this.radius)
      this.y = canvas.height - this.radius;
    if (this.y <= this.radius) this.y = this.radius;
  };

  /* Metoda mění velikost objektu; 
  ** dsize - hodnota kladná, nebo záporná
  */   
  this.size = function(dsize) {
    this.radius += dsize;
    if(this.radius < 10){
      this.radius = 10;  
    }
    if(this.radius > 100){
      this.radius = 100;
    }
  };

  /* Metoda provádí animaci objektu; 
  ** canvas - odkaz na objekt plátna
  */   
  this.animate = function(canvas) {
    if (this.y <= canvas.height - this.radius && this.y >= 0)
      this.y += 0.2;
  };
}
