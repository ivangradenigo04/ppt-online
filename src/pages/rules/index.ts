import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "rules-page",
    class extends HTMLElement {
      shadow: ShadowRoot;
      opponentName: string;
      myName: string;
      opponentScore: string;
      myScore: string;
      gameroomId: string;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        const cs = state.getState();
        this.gameroomId = cs.gameroomId;
        this.myScore = cs.history.myWins;
        this.opponentScore = cs.history.opponentWins;
        const nombreUno = cs.myGame.fullName.split(" ")[0];
        const nombreDos = cs.opponentGame.fullName.split(" ")[0];
        this.myName = nombreUno;
        this.opponentName = nombreDos;
        state.subscribe(() => this.render());
        this.render();
      }

      connectedListeners() {
        const cs = state.getState();
        const buttonEl = this.shadow.querySelector("button-el");
        buttonEl.addEventListener("click", () => {
          state.setReadyStatus();
          state.pushMyGame(() => {
            if (cs.opponentGame.ready) {
              Router.go("/game");
            } else {
              Router.go("/waiting-opponent");
            }
          });
        });
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          display: flex;
          flex-direction: column;
        }

        .room-data-container{
          position: absolute;
          top: 0;
          display: flex;
          left: 50%;
          transform: translate(-50%);
          justify-content:space-between;
          gap:150px;
        }

        @media (min-width: 768px) {
          .room-data-container{
            gap:600px;
          }
        }
        
        .text-container {
          padding: 130px 0 60px 0;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .text-container {
            padding: 80px 0 50px 0;
          }
        }
        
        @media (min-height: 768px) {
          .text-container {
            padding: 160px 0 100px;
          }
        }

        .button-container{
          margin:0 auto;
        }

        @media (max-height: 600px) {
          .button-container {
            gap: 10px;
          }
        }
        
        .hands-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          display: flex;
          gap:40px;
        }
        
        @media (min-width: 768px) {
          .hands-container {
            gap: 65px;
          }
        }
        `;

        this.shadow.innerHTML = `
        <div class="root">
        <div class="room-data-container">
        <text-el variant="info">
        ${this.myName}:${this.myScore}
        ${this.opponentName}:${this.opponentScore}
        </text-el>
        <text-el variant="info">
        Sala
        ${this.gameroomId}
        </text-el>
        </div>
        <div class="text-container">
        <text-el variant="subtitle">Presioná jugar
        y elegí: piedra,
        papel o tijera
        antes de que 
        pasen los 3 
        segundos.
        </text-el>
        </div>
        <div class="button-container">
        <button-el>¡Jugar!</button-el>
        </div>
        <div class="hands-container">
        <hand-el variant="piedra"></hand-el>
        <hand-el variant="papel"></hand-el>
        <hand-el variant="tijera"></hand-el>
        </div>
        </div>
        `;

        this.connectedListeners();
        this.shadow.appendChild(style);
      }
    }
  );
}
