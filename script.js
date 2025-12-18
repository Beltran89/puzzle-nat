/* HUELLAS */
// const footsteps=document.getElementById("footsteps");
// let walking=true;

// setInterval(()=>{
//     if(!walking) return;
//     const s=document.createElement("div");
//     s.className="step";
//     s.textContent="👣";
//     s.style.left=Math.random()*80+10+"vw";
//     s.style.bottom="-20px";
//     footsteps.appendChild(s);
//     setTimeout(()=>s.remove(),3000);
// },600);

/* =========================
   LOADER + PAPÁ NOEL
========================= */

const santaContainer = document.getElementById("santa-container");
let santaInterval = null;

function createSanta() {
    const santa = document.createElement("img");
    santa.src = "papanoel.png";
    santa.className = "santa-fly";

    const startY = Math.random() * 80 + 10;
    const endY = startY + (Math.random() * 40 - 20);

    santa.style.setProperty("--start-y", startY + "vh");
    santa.style.setProperty("--end-y", endY + "vh");
    santa.style.animationDuration = Math.random() * 3 + 4 + "s";

    santaContainer.appendChild(santa);

    setTimeout(() => santa.remove(), 20000);
}

/* AL CARGAR LA PÁGINA */
window.addEventListener("load", () => {

    // Papá Noel aparece mientras carga
    santaInterval = setInterval(createSanta, 100);

    // Duración del loader
    setTimeout(() => {
        const loader = document.getElementById("loader");

        // parar Papá Noel
        clearInterval(santaInterval);

        // ocultar loader
        loader.classList.add("hidden");

        // eliminarlo del DOM tras la animación
        setTimeout(() => loader.remove(), 700);

    }, 2500); // ⏱️ 2 segundos
});

/* MUSICA*/
document.body.addEventListener("click", () => {
    document.getElementById("musica").play();
}, { once: true });


/* PRUEBA*/
const snowContainer = document.getElementById("snow-container");

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "❄";

    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.fontSize = Math.random() * 14 + 10 + "px";
    snowflake.style.animationDuration = Math.random() * 6 + 6 + "s";
    snowflake.style.opacity = Math.random();

    snowContainer.appendChild(snowflake);

    setTimeout(() => snowflake.remove(), 12000);
}

setInterval(createSnowflake, 180);






/* FASE 1 · QUIZ */
const quiz=document.getElementById("popup-quiz");
const quizMsg=document.getElementById("quiz-msg");

setTimeout(()=>{
    walking=false;
    quiz.classList.remove("hidden");
},500);

quiz.querySelectorAll("button").forEach(b=>{
    b.onclick=()=>{
        if(b.dataset.ok==="true"){
            quiz.classList.add("hidden");
            walking=true;
            setTimeout(()=>startMemory(),300);
        }else{
            quizMsg.textContent="Casi 😜";
            navigator.vibrate?.(80);
        }
    }
});

/* FASE 2 · MEMORY */
function startMemory(){
    walking=false;
    const popup=document.getElementById("popup-memory");
    popup.classList.remove("hidden");

    const cards=document.querySelectorAll(".card");
    let first=null, lock=false, matched=0;

    cards.forEach(card=>{
        const inner=document.createElement("div");
        inner.className="card-inner";
        inner.innerHTML=`
          <div class="card-face card-back">🎨</div>
          <div class="card-face card-front" style="background-image:url('${card.dataset.img}')"></div>
        `;
        card.appendChild(inner);

        card.onclick=()=>{
            if(lock||card.classList.contains("flipped")) return;
            card.classList.add("flipped");
            if(!first){ first=card; return; }
            lock=true;
            if(first.dataset.img===card.dataset.img){
                matched+=2; first=null; lock=false;
                if(matched===4){
                    popup.classList.add("hidden");
                    walking=true;
                    setTimeout(()=>startPuzzle(),300);
                }
            }else{
                setTimeout(()=>{
                    first.classList.remove("flipped");
                    card.classList.remove("flipped");
                    first=null; lock=false;
                },900);
            }
        };
    });
}

/* FASE 3 · PUZLE */
function startPuzzle(){
    walking=false;
    const puzzle=document.getElementById("popup-puzzle");
    puzzle.classList.remove("hidden");

    let selected=null, correct=0;

    document.querySelectorAll(".piece").forEach(p=>{
        p.onclick=()=>{
            document.querySelectorAll(".piece").forEach(x=>x.classList.remove("selected"));
            selected=p; p.classList.add("selected");
        };
    });

    document.querySelectorAll(".slot").forEach(s=>{
        s.onclick=()=>{
            if(!selected) return;
            if(selected.dataset.pos===s.dataset.pos&&!s.classList.contains("filled")){
                s.appendChild(selected);
                selected.classList.remove("selected");
                s.classList.add("filled");
                correct++;
                selected=null;
               if (correct === 4) {

    // 1️⃣ dejamos el puzle visible 2 segundos
    setTimeout(() => {

        // 2️⃣ mostramos "Correcto ❤️"
        const success = document.getElementById("popup-success");
        success.classList.remove("hidden");

        // 3️⃣ después de un momento, cerramos el puzle y seguimos
        setTimeout(() => {
            success.classList.add("hidden");
            puzzle.classList.add("hidden");
            document.getElementById("popup-final").classList.remove("hidden");
        }, 1000);

    }, 1500); // ⏱️ AQUÍ están los 2 segundos con el puzle visible
}
            }
        };
    });
}