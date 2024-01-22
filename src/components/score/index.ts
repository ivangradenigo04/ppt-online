import { state } from "../../state";

export function init() {
  class Score extends HTMLElement {
    shadow: ShadowRoot;
    myScore: number;
    opponentScore: number;
    myName: string;
    opponentName: string;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      const cs = state.getState();
      this.myScore = cs.history.myWins;
      this.opponentScore = cs.history.opponentWins;
      const nombreUno = cs.myGame.fullName.split(" ")[0];
      const nombreDos = cs.opponentGame.fullName.split(" ")[0];
      this.myName = nombreUno;
      this.opponentName = nombreDos;
      state.subscribe(() => this.render());
      this.render();
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .root{
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:12px;
        font-family:"Odibee Sans";
        background-color: #FFF;
        padding:10px 30px;
        border: 10px solid #000;
        border-radius: 10px;
        width:200px;
      }

      @media (max-height: 768px) and (min-width:620px) {
        .root {
          height:150px;
          gap:2px
        }
      }

      .score-content{
        display:flex;
        flex-direction:column;
        align-self:flex-end;
        align-items:flex-end;
      }
      `;

      this.shadow.innerHTML = `
        <div class="root">
        <text-el variant="component-55">Score</text-el> 
        <div class="score-content">
        <text-el variant="component-45">${this.myName}:${this.myScore}</text-el> 
        <text-el variant="component-45">${this.opponentName}:${this.opponentScore}</text-el> 
        </div>    
        </div>    
      `;

      this.shadow.appendChild(style);
    }
  }
  customElements.define("score-el", Score);
}
