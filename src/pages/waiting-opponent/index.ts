import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "waiting-opponent-page",
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
        state.subscribe(() => {
          this.render();
          Router.go("/game");
        });
        this.render();
      }

      disconnectedCallback() {
        state.unsubscribe();
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          height:100vh;
          display: flex;
          align-items:center;
          justify-content:center
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

        .text-container{
          margin:0 5px
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
        <text-el variant="subtitle">Esperando a que
        ${this.opponentName} presione
        ¡Jugar!...
        </text-el>
        </div>
        <div class="hands-container">
        <hand-el variant="piedra"></hand-el>
        <hand-el variant="papel"></hand-el>
        <hand-el variant="tijera"></hand-el>
        </div>
        </div>
        `;

        this.shadow.appendChild(style);
      }
    }
  );
}
