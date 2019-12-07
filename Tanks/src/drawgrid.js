export function drawGrid(gameWidth, gameHeight)  {
    let pox = 0;
    let poy = 0;
    console.log(gameHeight, gameWidth)
    var c = document.getElementById("gameScreen");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "white"
    ctx.beginPath();
    ctx.moveTo(pox, poy);
    
    while(pox<gameWidth && poy<gameHeight)  {
        poy += gameHeight;
        ctx.lineTo(pox, poy);
        ctx.stroke();
        pox += 40;
    }    
}