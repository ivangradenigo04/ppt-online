import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "home-page",
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
        const buttonEls = this.shadow.querySelectorAll("button-el");
        for (const button of buttonEls) {
          button.addEventListener("click", (e) => {
            const name = (e.target as HTMLElement).getAttribute("name");
            if (name == "new-game") {
              const buttonsContainer =
                this.shadow.querySelector(".buttons-container");
              buttonsContainer.classList.add("display-none");

              const waitingContainer =
                this.shadow.querySelector(".waiting-container");
              waitingContainer.classList.add("display-block");

              state.askNewRoom(() => {
                state.accessToRoom(() => {
                  state.listenOpponentDataAndHistory(() => {
                    state.setOnlineStatus();
                    state.pushMyGame(() => {
                      Router.go("/new-game");
                      buttonsContainer.classList.remove("display-none");
                      waitingContainer.classList.remove("display-block");
                    });
                  });
                });
              });
            } else if (name == "join-game") {
              Router.go("/join-game");
            }
          });
        }
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root {
          display: flex;
          flex-direction: column;
        }
        
        .text-container {
          padding: 70px 0 50px 0;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .text-container {
            padding: 40px 0 25px 0;
          }
        }
        
        @media (min-height: 768px) {
          .text-container {
            padding: 130px 0 80px;
          }
        }

        @media (max-height: 620px) {
          .text-container {
            padding: 40px 0 40px;
          }
        }

        .buttons-container{
          display:grid;
          gap:20px;
          margin:0 auto;
        }

        @media (max-height: 600px) {
          .buttons-container {
            gap: 10px;
          }
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
          align-items:flex-end;
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
        <div class="buttons-container">
        <button-el name="new-game">Nuevo juego</button-el>
        <button-el name="join-game">Ingresar a una sala</button-el>
        </div>
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
