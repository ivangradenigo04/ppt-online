import { state, GameOptions } from "../../state";
import { Router } from "@vaadin/router";

export function init() {
  customElements.define(
    "game-page",
    class extends HTMLElement {
      shadow: ShadowRoot;
      myMove: string;
      opponentMove: string;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.render();
      }

      connectedListeners() {
        const handEls = this.shadow.querySelectorAll("hand-el");
        for (const hand of handEls) {
          const handShadow: any = hand.shadowRoot;
          hand?.addEventListener("click", (e) => {
            e.preventDefault();
            const img = handShadow.querySelector("img");
            img.classList.remove("button");
            img.classList.add("selected");
            state.setMoves(hand.getAttribute("variant") as GameOptions);

            for (const notClicked of handEls) {
              if (notClicked !== hand) {
                const notClickedShadow: any = notClicked.shadowRoot;
                const ncImg = notClickedShadow.querySelector("img");
                ncImg.classList.remove("button");
                ncImg.classList.add("discarded");
              }
            }
          });
        }
      }

      startTimer(counter: number, callback: () => void) {
        const timerEl: any = this.shadow.querySelector("timer-el");
        const timer = timerEl.shadowRoot.querySelector(".timer");

        const countdownInterval = setInterval(() => {
          --counter;
          timer.textContent = counter.toString();
          if (counter == 0) {
            clearInterval(countdownInterval);
            state.resetReadyStatus();
            state.pushMyGame();
            state.subscribe(() => {
              console.log("Hola");
              const cs = state.getState();
              this.myMove = cs.myGame.move;
              this.opponentMove = cs.opponentGame.move;
              state.unsubscribe();
              if (this.myMove !== "" && this.opponentMove !== "") {
                callback();
                state.setResult();
                Router.go("/result");
              } else if (this.myMove == "" || this.opponentMove == "") {
                state.setResult();
                Router.go("/rules");
              }
            });
          }
        }, 1500);
      }

      disconnectedCallback() {
        state.unsubscribe();
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root{
          display:flex;
          flex-direction:column;
        }

        .hands-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          display: flex;
          align-items:flex-end;
          gap:10px;
        }
        
        @media (min-width: 768px) {
          .hands-container {
            gap: 50px;
          }
        }
        `;

        this.shadow.innerHTML = `
        <div class="root">
        <div class="timer-container">
        <timer-el class="timer">3</timer-el> 
        </div> 
        <div class="hands-container">
        <hand-el variant="piedra" type="button" size="large"></hand-el>
        <hand-el variant="papel" type="button" size="large"></hand-el>
        <hand-el variant="tijera" type="button" size="large"></hand-el>
        </div>
        </div>    
        `;

        this.shadow.appendChild(style);
        this.connectedListeners();
        this.startTimer(3, () => {
          this.shadow.innerHTML = `
          <hand-el class="opponent-move" variant=${this.opponentMove} size="large"></hand-el>
          <hand-el class="my-move" variant=${this.myMove} size="large"></hand-el>
          `;
        });
      }
    }
  );
}
