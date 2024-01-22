import { Router } from "@vaadin/router";
import { state } from "../../state";

export function init() {
  customElements.define(
    "result-page",
    class extends HTMLElement {
      shadow: ShadowRoot;
      variant: string;
      winURL: string;
      loseURL: string;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.variant = state.getState().result;
        this.winURL = require("url:../../assets/win.png");
        this.loseURL = require("url:../../assets/lose.png");
        this.render();
      }

      connectedListeners() {
        const cs = state.getState();
        const buttonEls = this.shadow.querySelectorAll("button-el");
        for (const button of buttonEls) {
          button.addEventListener("click", (e) => {
            const name = (e.target as HTMLElement).getAttribute("name");
            if (name == "play-again") {
              const buttonsContainer =
                this.shadow.querySelector(".buttons-container");
              buttonsContainer.classList.add("display-none");
              const waitingContainer =
                this.shadow.querySelector(".waiting-container");
              waitingContainer.classList.add("display-block");

              state.resetMoves();
              state.setReadyStatus();
              state.pushMyGame(() => {
                if (cs.opponentGame.ready) {
                  Router.go("/game");
                  buttonsContainer.classList.remove("display-none");
                  waitingContainer.classList.remove("display-block");
                } else {
                  Router.go("/waiting-opponent");
                  buttonsContainer.classList.remove("display-none");
                  waitingContainer.classList.remove("display-block");
                }
              });
            } else if (name == "exit") {
              const buttonsContainer =
                this.shadow.querySelector(".buttons-container");
              buttonsContainer.classList.add("display-none");
              const waitingContainer =
                this.shadow.querySelector(".waiting-container");
              waitingContainer.classList.add("display-block");

              state.setOfflineStatus();
              state.pushMyGame(() => {
                state.resetHistory();
                Router.go("/home");
                buttonsContainer.classList.remove("display-none");
                waitingContainer.classList.remove("display-block");
              });
            }
          });
        }
      }

      render() {
        const style = document.createElement("style");
        style.innerHTML = `
        .root{
          display:none;
          position:absolute;
          top:0;
          bottom:0;
          right:0;
          left:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          padding:30px 0;
          background-color:rgba(136, 137, 73, 0.9);
        }
        
        @media (min-height: 768px) {
          .root {
            padding:70px 0;
          }
        }

        .lose{
          background-color:rgba(137, 73, 73, 0.90);
        }

        .tie{
          background-color:#cccccc
        }

        .active{
          display:
        }

        img{
          width:200px;
          height:200px;
        }

        @media (max-height: 700px) {
          img {
            width:170px;
            height:170px;
          }
        }
        
        @media (min-height: 768px) and (min-width:768px) {
          img {
            width: 255px;
            height: 260px;
          }
        }

        @media (max-height: 768px) and (min-width:620px) {
          img {
            width: 170px;
            height: 150px;
          }
        }

        .score-container {
          margin:10px auto 40px; 
        }
        
        @media (max-height: 768px) and (min-width:620px) {
          .score-container {
            margin:10px auto 20px; 
          }
        }
        
        @media (min-height: 768px) {
          .score-container {
            margin:30px auto 80px; 
          }
        }

        .buttons-container{
          margin:0 auto;
          display:grid;
          gap:15px
        }

        @media (max-height: 768px) {
          .buttons-container {
            gap:10px
          }
        }

        .display-none{
          display:none
        }

        .display-block{
          display:block
        }
        `;

        if (this.variant == "win") {
          this.shadow.innerHTML = `
          <div class="root">
          <img src=${this.winURL}>
          <div class="score-container">
          <score-el class="score"></score-el> 
          </div>
          <div class="buttons-container">
          <button-el name="play-again">Volver a jugar</button-el>
          <button-el name="exit">Salir</button-el>
          </div>
          <div class="waiting-container display-none">
          <text-el variant="subtitle">
          Cargando...
          </text-el>
          </div>
          </div>    
          `;
        } else if (this.variant == "lose") {
          this.shadow.innerHTML = `
          <div class="root lose">
          <img src=${this.loseURL}>
          <div class="score-container">
          <score-el class="score"></score-el> 
          </div>
          <div class="buttons-container">
          <button-el name="play-again">Volver a jugar</button-el>
          <button-el name="exit">Salir</button-el>
          </div>
          <div class="waiting-container display-none">
          <text-el variant="subtitle">
          Cargando...
          </text-el>
          </div>
          </div>    
          `;
        } else if (this.variant == "tie") {
          this.shadow.innerHTML = `
          <div class="root tie">
          <img src=${this.loseURL}>
          <div class="score-container">
          <score-el class="score"></score-el> 
          </div>
          <div class="buttons-container">
          <button-el name="play-again">Volver a jugar</button-el>
          <button-el name="exit">Salir</button-el>
          </div>
          <div class="waiting-container display-none">
          <text-el variant="subtitle">
          Cargando...
          </text-el>
          </div>
          </div>    
          `;
        }

        this.shadow.appendChild(style);
        this.connectedListeners();
      }
    }
  );
}
