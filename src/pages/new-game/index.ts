import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "new-game-page",
    class extends HTMLElement {
      shadow: ShadowRoot;
      gameroomId: string;
      subscription: Function | null;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        const cs = state.getState();
        this.gameroomId = cs.gameroomId;
        state.subscribe(() => {
          Router.go("/rules");
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
          display: flex;
          flex-direction: column;
        }
        
        .text-container {
          padding: 130px 0 60px 0;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .text-container {
            padding: 100px 0 80px 0;
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
        <div class="text-container">
        <text-el variant="subtitle">Compartí el código:

        ${this.gameroomId}

        Con tu contrincante
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
