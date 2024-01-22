import { Router } from "@vaadin/router";

export function init() {
  class Button extends HTMLElement {
    shadow: ShadowRoot;
    text: string | null;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.text = this.textContent;
      this.render();
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .root{
        width:320px
      }
      
      @media (min-width: 768px) {
        .root{
          width:340px;
        }
      }

      .button{
        font-family:"Odibee Sans";
        border-radius: 10px;
        text-align:center;
        border: 10px solid #001997;
        width:100%;
        background-color: #006CFC;
        padding:8px;
        cursor:pointer;
        transition: transform 0.3s;
      }
      
      @media (min-width: 768px) {
        .button:hover{
          transform: scale(1.1);
        }
      }
      `;

      this.shadow.innerHTML = `
        <div class="root">
        <button class="button"><text-el variant="button-text">${this.text}</text-el></button> 
        </div>
      `;

      this.shadow.appendChild(style);
    }
  }
  customElements.define("button-el", Button);
}
