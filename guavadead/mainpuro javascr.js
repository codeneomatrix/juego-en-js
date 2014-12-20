// JavaScript Document
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");	
var escala=((canvas.height)*1)/720;
var personaje = {
    x:100,
    y:canvas.height-139,
    width:(73*0.5)*escala,
    height:(113*0.5)*escala,
    estado: "vivo"
}
var fondoancho=0;
var velocidadg=0; 
var guavaspisadas=0;
var velocidadp=0
var juego = {
    estado:"iniciando"
}
var texto = {
    contador: -1,
    titulo: "",
    subtitulo: ""
}
var teclado = {};
var guavastotales=10;
var guavasmuerte = 3;
var guavas = [];
var fondo,imgpersonaje,imgguava;
var desplazamientoFon=0,limitemovfondo=-2050;
var imagenes = ["personaje.png","guava.png","fondo.jpg"];
var limite = canvas.width - personaje.width;
var avance = canvas.width + desplazamientoFon;
var angulo=0,velocidad=0,g=9.81,sentido,velocidadfon=2;
var preloader;

function loadMedia(){
preloader = new PreloadJS();    
preloader.onProgress = progresoCarga;
cargar();
}

function cargar(){
    while(imagenes.length > 0){
        var imagen = imagenes.shift();
        preloader.loadFile(imagen);
    }
}

function progresoCarga(){
    console.log(parseInt(preloader.progress * 100)+ "%");
    if(preloader.progress == 1){
        var interval = window.setInterval(frameLoop, 1000/15 );
        fondo = new Image();
        fondo.src = "fondo.jpg";
        fondoancho = fondo.width;
        var fondoalto = fondo.height;
        imgpersonaje = new Image();
        imgpersonaje.src = "personaje.png";
        imgguava = new Image();
        imgguava.src = "guava.png";
    }
}



function dibujafondo(){
ctx.drawImage(fondo,desplazamientoFon,0);
}

function dibujapersonaje(){
  
    ctx.drawImage(imgpersonaje,personaje.x,personaje.y,personaje.width,personaje.height);
   
}



function  dibujaGuavas(){
    for( var i in guavas){
    var guava = guavas[i];
    if(guava.estado=="activo"){
         ctx.drawImage(imgguava,guava.x,guava.y,guava.width,guava.height);      
}
}    
}


function eventosteclado(){
    agregarEvento(document,"keydown",function(e){
        teclado[e.keyCode] = true;
        
    });
    agregarEvento(document,"keyup",function(e){
        teclado[e.keyCode] = false;
    });
    function agregarEvento(elemento,nombreEvento,funcion){
        if(elemento.addEventListener){
            elemento.addEventListener(nombreEvento,funcion,false);
        }
        else if(elemento.attachEvent){
            elemento.attachEvent(nombreEvento,funcion);
        }
    }
}

function moverpersonaje(){
   if(personaje.estado == "vivo"){ 
    if(teclado[37] && teclado.salta == false ){
       caminaatras();
    }
     if(teclado[39]&& teclado.salta == false){
       caminaadelante(); 
    }
    if(teclado[68] && teclado.salta == false){//tecla d
       caminaadelante();
   }
    if(teclado[65]&& teclado.salta == false){//tecla a
       caminaatras(); 
       }
    if((teclado[83]&&teclado[68])&& teclado.salta == false){//tecla a
       correadelante(); 
       }
    if((teclado[83]&&teclado[65])&& teclado.salta == false){//tecla a
       correatras(); 
        }
    if(teclado[32] && teclado.salta == false){
          salta();
            teclado.salta = true;
     }
    
    
    if(!teclado[65]&& !teclado[68]){
            if(!teclado[39]&&!teclado[37]){
                    if(!teclado[83]&&!teclado[32]){
                      
                  if(!teclado.detenido){
        detenido();
        teclado.detenido = true;
                  
                       }
    }
            }
            
    }
    else {teclado.detenido = false; }
    
}
}



function actualizaGuavas(){
    if (juego.estado=="iniciando"){
        
        for(var i=0; i<guavastotales;i++){
                guavas.push({
                width:(25)*escala,
                height:(26)*escala,
                x:(aleatorio(5,fondo.width)+(1000)),
                y:canvas.height-110,
                
                estado:"activo",
                contador:0
            });
        }
        juego.estado="jugando";
    }
    moverGuava();
        
}
function  moverGuava(){
    
  for(var i in guavas){
             var guava = guavas[i];
             if (!guava){continue;}
             if (guava && guava.estado=="activo"){
                 
                 if(sentido=="+"){
                 velocidadg = (1+(velocidadfon));
             }
                 if(sentido=="-"){
                 velocidadg = (1);
             }
                 console.log("velocidad personaje:",velocidad,"   velocidadg:",velocidadg);
                  entidad=guava;
                  var sentidog = "-";
                 mover(velocidadg,entidad,sentidog);    
             }
         }
         
        guavas=guavas.filter(function(guava){
            return guava.x > 0 ;
        });
         guavas=guavas.filter(function(guava){
            return guava.estado == "activo";
        });
    
}

function salta(){
  
    velocidad*=9;
    if(sentido=="+"){
    tiroparabolicopos(personaje,velocidad,angulo);
    teclado.salta = false;
    }
    if(sentido=="-"){
    tiroparaboliconeg(personaje,velocidad,angulo);
     teclado.salta = false;
    }
     
    }
function caminaadelante(){
      velocidad = 3;
      velocidadp=velocidad;
      sentido="+"
      angulo=30;
    mover((velocidad),personaje,"+");
}
function caminaatras(){
    velocidad = 3;
    velocidadp=velocidad;
    sentido="-"
    angulo=30;
    mover((velocidad),personaje,"-");
}
function correadelante(){
    velocidad = 5;
    velocidadp=velocidad;
    sentido="+"
    angulo=45;
    //5
    mover((velocidad),personaje,"+");
}
function correatras(){
    velocidad = 5;
    velocidadp=velocidad;
    sentido="-"
    angulo=45;
     mover((velocidad),personaje,"-");
}

function tiroparabolicopos(entidad,v,a){
  teclado.salta = true;
    var velocidadx = v*(Math.cos(a));
    var velocidady = v*(Math.sin(a));
    var tiempoaire = ((2*velocidady)/g);
    var alturamaxima = (((velocidady)*(velocidady))/(2*g));
    var distanciamaxima = velocidadx*tiempoaire;
   
    var dx= Math.abs( distanciamaxima);
    var dy= alturamaxima;
    var p = entidad.y;
    var yat= entidad.y-dy;
    
    console.log(dx,dy,"     ",entidad.y,yat);
     subirpositivo(yat);

 function subirpositivo(pos) {
     teclado.salta = true;
 
setTimeout(function(){ 
    if ( entidad.y >= pos ){
        
      
     entidad.x += 1;
                  
       
      if(entidad.x < limite && desplazamientoFon >= limitemovfondo) { desplazamientoFon -= (v/10)/8; }
      if(entidad.x >= limite && desplazamientoFon >= limitemovfondo) {
     entidad.x = limite/2;desplazamientoFon -= limite/2;
      }
      if (entidad.x >= limite && desplazamientoFon <= limitemovfondo){entidad.x = limite;desplazamientoFon -= 0;}
      entidad.y -= 0.4; 
      subirpositivo(yat);
    }else{
    bajarpositivo(p);
    }
   }); 
}
function bajarpositivo(p) {

teclado.salta = true;
setTimeout(function(){ 
   if ( entidad.y <= p ){
       
        
      entidad.x += 1;
                  
     
     if(entidad.x < limite && desplazamientoFon >= limitemovfondo) {
      desplazamientoFon -= (v/10)/8;
      }
      if(entidad.x >= limite && desplazamientoFon >= limitemovfondo) {
       entidad.x = limite/2;desplazamientoFon -= limite/2;
      }
      if (entidad.x > limite && desplazamientoFon <= limitemovfondo){entidad.x = limite;desplazamientoFon -= 0;}
     
     entidad.y += 0.4; 
      bajarpositivo(p);
    }
    else{  teclado.salta = false;}
   }); 
}



}

function tiroparaboliconeg(entidad,v,a){
  teclado.salta = true;
    var velocidadx = v*(Math.cos(a));
    var velocidady = v*(Math.sin(a));
    var tiempoaire = ((2*velocidady)/g);
    var alturamaxima = (((velocidady)*(velocidady))/(2*g));
    var distanciamaxima = velocidadx*tiempoaire;
   
    var dx= Math.abs( distanciamaxima);
    var dy= alturamaxima;
     var p = entidad.y;
    var yat= entidad.y-dy;
    
    console.log(dx,dy,"     ",entidad.y,yat);
    
  
     subirneg(yat);

 function subirneg(pos) {
     
 teclado.salta = true;
setTimeout(function(){ 
    if ( entidad.y >= pos ){
        
         entidad.x -= 2;
         
      
     desplazamientoFon += (v/10)/8;
      
      if(entidad.x < 0 && desplazamientoFon < 0 ) {
       entidad.x = limite-1;desplazamientoFon += limite-1;
      }
      if(entidad.x < 0 && desplazamientoFon >= 0 ) {entidad.x = 0;desplazamientoFon = 0;}
      if(desplazamientoFon >= 2000 ) {desplazamientoFon = 0;}
      
      entidad.y -= 0.4; 
      subirneg(yat);
    }else{
    bajarneg(p);
    }
   }); 
}
function bajarneg(p) {

teclado.salta = true;
setTimeout(function(){ 
   if ( entidad.y <= p ){
       
       
                    entidad.x -= 1;
                  
      desplazamientoFon += (v/10)/8;
      
      if(entidad.x < 0 && desplazamientoFon < 0 ) {
       entidad.x = limite-1;desplazamientoFon += limite-1;
      }
      if(entidad.x < 0 && desplazamientoFon >= 0 ) {entidad.x = 0;desplazamientoFon = 0;}
      if(desplazamientoFon >= 2000 ) {desplazamientoFon = 0;}
      
     entidad.y += 0.4; 
      bajarneg(p);
    }
    else{  teclado.salta = false;}
   }); 
}



}


function mover(v,entidad,sentido){
    velocidadfon = v-1;
    if(sentido == "+"){
       entidad.x += (v-velocidadfon);
     
        if(entidad.x > limite) {entidad.x = limite;}
       if (entidad == personaje  ){
            moverfondo(sentido,velocidadfon); 
           }
      }
    if(sentido == "-"){
       entidad.x -= v;
       
       if(entidad.x < 0) { entidad.x = 0;}
     
       if (entidad == personaje  ){
      moverfondo(sentido,velocidadfon); 
       }
     }
}
function moverfondo(sentido,velocidadfon){
    if(sentido == "+"){
      if (desplazamientoFon == limitemovfondo){desplazamientoFon -= 0;}
      if (desplazamientoFon > limitemovfondo ){ desplazamientoFon -= velocidadfon;} 
       }
       
       if(sentido == "-"){
           
       if (desplazamientoFon >= 0){desplazamientoFon = 0;}
       desplazamientoFon += velocidadfon;
     }
}



function detenido(){
    console.log("detenido");
    velocidad=0;
    velocidadp=velocidad;
    angulo=90;
    guavaspisadas = guavaspisadas;
    teclado.salta = false;
   
}
function TamVentana() {
  var Tamanyo = [0, 0];
  if (typeof window.innerWidth != 'undefined')
  {
    Tamanyo = [
        window.innerWidth,
        window.innerHeight
    ];
  }
  else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0)
  {
 Tamanyo = [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
    ];
  }
  else   {
    Tamanyo = [
        document.getElementsByTagName('body')[0].clientWidth,
        document.getElementsByTagName('body')[0].clientHeight
    ];
  }
  return Tamanyo;
}
window.onresize = function() {
  var Tam = TamVentana();
  canvas.height=Tam[1];
      canvas.width =Tam[0];
      escala=((canvas.height)*1)/720;
  alert('La ventana mide: [' + Tam[0] + ', ' + Tam[1] + ']');
};
function dibujatexto(){
    if(texto.contador == -1){return;}
    var alpha = texto.contador/50.0;
    if(alpha>1){
        for(var i in guavas){
            delete guavas[i];
        }
    }
    ctx.globalAlpha = alpha;
    if(juego.estado == "perdiste"){
        ctx.fillStyle = "white";
        ctx.font = "Bold 40pt  Arial";
        ctx.fillText(texto.titulo,(140*escala),(200*escala));
        ctx.font = "15pt  Arial";
        ctx.fillText(texto.subtitulo,(190*escala),(250*escala));
    }
    if(juego.estado == "ganaste"){
        ctx.fillStyle = "white";
        ctx.font = "Bold 40pt  Arial";
        ctx.fillText(texto.titulo,(140*escala),(200*escala));
        ctx.font = "15pt  Arial";
        ctx.fillText(texto.subtitulo,(190*escala),(250*escala));
    }
} 

function actualizarjuego(){
    if(juego.estado == "jugando" && guavaspisadas >= guavasmuerte){
        personaje.estado = "muerto";
        juego.estado = "perdiste";
        texto.titulo = "Has perdido";
        texto.subtitulo = "Evita pisar tres guayavas";
        texto.contador=0;
    }
    if(juego.estado == "jugando" && desplazamientoFon <= limitemovfondo){
        personaje.estado = "muerto";
        juego.estado = "ganaste";
        texto.titulo = "Has GANADO";
        texto.subtitulo = "presiona R para reiniciar";
        texto.contador=0;
    }
    if(texto.contador >= 0){
        texto.contador++;
    }
    
    
    if((juego.estado== "perdiste" || juego.estado=="ganaste")&& teclado[82]){
        personaje.estado = "vivo";
        juego.estado = "iniciando";
        guavaspisadas = 0;
        desplazamientoFon = 0;
        personaje.x = 100;
        texto.contador = -1;
    }
}


function colision(a,b){
    var colision = false;
    
    if(b.x + b.width >= a.x && b.x < a.x + a.width){
        if(b.y + b.height >= a.y && b.y < a.y + a.height){
            colision = true;
        }
    }
    if(b.x<=a.x && b.x + b.width >= a.x + a.width){
        if(b.y <= a.y && b.y + b.height >= a.y + a.height){
            colision=true;
        }
    }
    
    if(a.x<=b.x && a.x + a.width >= b.x + b.width){
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
            colision=true;
        }
    }
    return colision;   
}

function verificarColision(){
    for(var i in guavas){
        var guava = guavas[i];
        if(colision(personaje,guava)){
            guava.estado = "inactivo";
            guavaspisadas += 1;
            console.log("Has pisado: ",guavaspisadas,"guavas");
        }
    }
}

function aleatorio(inferior,superior){
    var posibilidades = superior-inferior;
    var a = Math.random()*posibilidades;
    a= Math.floor(a);
    return parseInt(inferior)+a;
}

function frameLoop(){    
TamVentana();
actualizarjuego();
moverpersonaje();
actualizaGuavas();

dibujafondo();
verificarColision();
dibujaGuavas();
dibujatexto();
dibujapersonaje();


}


window.addEventListener("load", init);

function init(){
   eventosteclado();
   loadMedia(); 
} 