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

// /* FASE 3 · PUZLE */
function startPuzzle(){
    

    // 🛑 parar huellas
    walking = false;

    const puzzle = document.getElementById("popup-puzzle");
    puzzle.classList.remove("hidden");

    let correct = 0;
    let dragging = null;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const pieces = puzzle.querySelectorAll(".piece");
    const slots = puzzle.querySelectorAll(".slot");

    pieces.forEach(piece => {

        piece.addEventListener("pointerdown", e => {
    dragging = piece;
    piece.classList.add("dragging");

    const rect = piece.getBoundingClientRect();
    startX = rect.left;
    startY = rect.top;

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // 👻 crear copia visual
    ghost = piece.cloneNode(true);
    ghost.style.position = "fixed";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    ghost.style.width = rect.width + "px";
    ghost.style.height = rect.height + "px";
    ghost.style.pointerEvents = "none";
    ghost.classList.add("dragging");

    document.body.appendChild(ghost);

    // ocultamos la original
    piece.style.visibility = "hidden";

    piece.setPointerCapture(e.pointerId);
});

        piece.addEventListener("pointermove", e => {
    if (!ghost) return;

    ghost.style.left = e.clientX - offsetX + "px";
    ghost.style.top = e.clientY - offsetY + "px";
});

        piece.addEventListener("pointerup", e => {
    if (!dragging || !ghost) return;

    piece.releasePointerCapture(e.pointerId);
    piece.classList.remove("dragging");

    const ghostRect = ghost.getBoundingClientRect();
    let placed = false;

    slots.forEach(slot => {
        if (slot.classList.contains("filled")) return;

        const slotRect = slot.getBoundingClientRect();
        const near =
            Math.abs(ghostRect.left - slotRect.left) < 50 &&
            Math.abs(ghostRect.top - slotRect.top) < 50;

        if (near && piece.dataset.pos === slot.dataset.pos) {
            // animar encaje
            ghost.style.transition = "all 0.25s ease";
            ghost.style.left = slotRect.left + "px";
            ghost.style.top = slotRect.top + "px";

            setTimeout(() => {
                slot.appendChild(piece);
                piece.style.visibility = "";
                slot.classList.add("filled");

                ghost.remove();
                ghost = null;

                correct++;

                if (correct === pieces.length) {
                    setTimeout(() => {
                        document.getElementById("popup-success").classList.remove("hidden");

                        setTimeout(() => {
                            document.getElementById("popup-success").classList.add("hidden");
                            puzzle.classList.add("hidden");
                            document.getElementById("popup-final").classList.remove("hidden");
                        }, 1500);
                    }, 2000);
                }
            }, 250);

            placed = true;
        }
    });

    if (!placed) {
        ghost.style.transition = "all 0.25s ease";
        ghost.style.left = startX + "px";
        ghost.style.top = startY + "px";

        setTimeout(() => {
            piece.style.visibility = "";
            ghost.remove();
            ghost = null;
        }, 250);
    }

    dragging = null;
});
    });

}