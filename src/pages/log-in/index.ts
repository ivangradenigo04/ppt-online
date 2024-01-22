import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "login-page",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.render();
      }

      parseFullName(texto) {
        return texto.replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
      }

      connectedListeners() {
        const formEl = this.shadow.querySelector(".form");
        const form = formEl.shadowRoot.querySelector("form");
        form.addEventListener("submit", (e: any) => {
          e.preventDefault();
          const fullName = e.target["full-name"].value;
          const fullNameParseado = this.parseFullName(fullName);
          if (fullNameParseado) {
            const formEl = this.shadow.querySelector("form-el");
            formEl.classList.add("display-none");
            const waitingContainer =
              this.shadow.querySelector(".waiting-container");
            waitingContainer.classList.add("display-block");

            state.setName(fullNameParseado);
            state.logIn(() => {
              Router.go("/home");
              formEl.classList.remove("display-none");
              waitingContainer.classList.remove("display-block");
            });
          }
        });
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          display: flex;
          flex-direction: column;
        }
        
        .text-container {
          padding: 70px 0 40px 0;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .text-container {
            padding: 40px 0 25px 0;
          }
        }
        
        @media (min-height: 768px) {
          .text-container {
            padding: 130px 0 70px;
          }
        }

        .form{
          margin:0 auto;
        }

        .display-none{
          display:none
        }

        .display-block{
          display:block
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
        <form-el class="form" variant="name"></form-el>
        <div class="waiting-container display-none">
        <text-el variant="subtitle">
        Cargando...
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
        this.connectedListeners();
      }
    }
  );
}
