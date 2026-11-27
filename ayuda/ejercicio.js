/* Rumbo al Saber · ejercicio corto de las páginas de Ayuda (Web R22)
   Lee las preguntas de <script type="application/json" id="reto-datos"> y las pinta en <div id="reto">.
   Cada pregunta: { q:"texto", ops:["a","b"], ok:0, bien:"por qué", ctx:"enunciado (opcional)", puntos:[porGrupo, grupos] (opcional) }
   No guarda ni envía nada. */
(function(){
  var caja=document.getElementById("reto"), datos=document.getElementById("reto-datos");
  if(!caja||!datos) return;
  var cfg; try{ cfg=JSON.parse(datos.textContent) }catch(e){ return }
  var P=cfg.preguntas||[], i=0, aciertos=0;
  var demo=cfg.demo||"../../app/rumbo-al-saber-DEMO-N6.html";

  function el(t,c,txt){ var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e }

  function puntos(por,grupos){
    var d=el("div","puntos"); d.setAttribute("aria-hidden","true");
    for(var g=0;g<grupos;g++){ var gr=el("div","grupo"); for(var k=0;k<por;k++) gr.appendChild(el("i")); d.appendChild(gr) }
    return d;
  }

  function pinta(){
    var p=P[i]; caja.textContent="";
    var cab=el("div","cab"); cab.appendChild(el("span",null,cfg.titulo||"Reto")); cab.appendChild(el("span",null,(i+1)+" de "+P.length)); caja.appendChild(cab);
    if(p.ctx) caja.appendChild(el("p","ctx",p.ctx));
    caja.appendChild(el("p","preg",p.q));
    var ops=el("div","ops"+(p.larga?" una":"")), porque=el("p","porque"); porque.setAttribute("aria-live","polite");
    var sig=el("button","btn sig",i<P.length-1?"Siguiente":"Ver el resultado"); sig.type="button"; sig.hidden=true;
    p.ops.forEach(function(t,n){
      var b=el("button","op",t); b.type="button";
      b.onclick=function(){
        var bien=n===p.ok; if(bien) aciertos++;
        ops.querySelectorAll("button").forEach(function(x,m){ x.disabled=true; if(m===p.ok) x.classList.add("bien") });
        if(!bien) b.classList.add("mal");
        porque.className="porque "+(bien?"bien":"mal");
        porque.textContent=(bien?"¡Bien! ":"Casi. ")+(p.bien||"");
        if(p.puntos) caja.insertBefore(puntos(p.puntos[0],p.puntos[1]),porque);
        sig.hidden=false; sig.focus();
      };
      ops.appendChild(b);
    });
    sig.onclick=function(){ i++; if(i<P.length) pinta(); else fin() };
    caja.appendChild(ops); caja.appendChild(porque); caja.appendChild(sig);
  }

  function fin(){
    caja.textContent="";
    var f=el("div","fin");
    f.appendChild(el("p","nota-fin",aciertos+" de "+P.length));
    f.appendChild(el("p",null,aciertos===P.length?"¡Todo bien! Ya lo tiene.":(aciertos>=P.length/2?"Va por buen camino. Otra vuelta y lo clava.":"Tranquilos: se aprende repitiendo. Probad otra vez.")));
    var otra=el("button","btn ghost","Otra vez"); otra.type="button"; otra.onclick=function(){ i=0; aciertos=0; pinta() };
    var a=el("a","btn","▶ Seguir practicando en la demo gratis"); a.href=demo;
    f.appendChild(a); f.appendChild(otra); caja.appendChild(f);
  }
  pinta();
})();
