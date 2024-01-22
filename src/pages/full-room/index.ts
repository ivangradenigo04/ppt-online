import { Router } from "@vaadin/router";

export function init() {
  customElements.define(
    "full-room-page",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.render();
      }

      connectedListeners() {
        setTimeout(() => {
          Router.go("/home");
        }, 5000);
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          display: flex;
          flex-direction: column;
        }
        
        .text-container {
          padding: 70px 0 45px 0;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .text-container {
            padding: 40px 0 45px 0;
          }
        }
        
        @media (min-height: 768px) {
          .text-container {
            padding: 100px 0 60px;
          }
        }

        .subtitle-container{
          padding:0 20px
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
        <text-el variant="title">Piedra
        Papel ó
        Tijera
        </text-el>
        </div>
        <div class="subtitle-container">
        <text-el class="form" variant="subtitle">Ups, la sala está
        completa y tu
        nombre no
        coincide con nadie
        en la sala.
        </div>
        </text-el>
        <div class="hands-container">
        <hand-el variant="piedra"></hand-el>
        <hand-el variant="papel"></hand-el>
        <hand-el variant="tijera"></hand-el>
        </div>
        </div>
        `;

        this.shadow.appendChild(style);
        this.connectedListeners();
      }
    }
  );
}
