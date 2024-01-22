import { json } from "stream/consumers";
import { state } from "../../state";

export function init() {
  class Hand extends HTMLElement {
    shadow: ShadowRoot;
    variant: string | null;
    type: string | null;
    size: string | null;
    piedraURL: any;
    papelURL: any;
    tijeraURL: any;
    piedraLargeURL: any;
    papelLargeURL: any;
    tijeraLargeURL: any;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.variant = this.getAttribute("variant");
      this.size = this.getAttribute("size");
      this.piedraURL = require("url:../../assets/piedra.png");
      this.papelURL = require("url:../../assets/papel.png");
      this.tijeraURL = require("url:../../assets/tijera.png");
      this.piedraLargeURL = require("url:../../assets/piedraL.png");
      this.papelLargeURL = require("url:../../assets/papelL.png");
      this.tijeraLargeURL = require("url:../../assets/tijeraL.png");
      this.type = this.getAttribute("type");
      this.render();
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      img{
        display: block;
        height:125px;
      }
      
      @media (min-height: 768px) {
        img {
          height:150px;
        }
      }

      @media (max-height: 670px) {
        .img--fixed {
          height:90px;
          width:55px;
        }
      }

      .button{
        cursor:pointer;
        transition: transform 0.2s;
        height:180px;
      }

      @media (min-width: 768px) {
        .button {
          height:200px;
        }
      }

      .button:hover{
        transform: scale(1.2);
      }

      .selected{
        height:190px;
      }
      
      @media (min-width: 768px) {
        .selected {
          height:230px;
        }
      }

      .discarded{
        height:150px;
        opacity:0.5;
        width:120px;
      }

      .my-move,.opponent-move{
        height:230px;
        bottom:0;
        position:absolute;
        left: 50%;
        transform: translate(-50%);
      }

      .opponent-move{
        top:0;
        left: 50%;
        transform: translate(-50%) rotate(180deg);
      }
      `;

      if (this.variant == "piedra" && this.size == "large") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className}" src=${this.piedraLargeURL}>
        </div> 
        `;
      } else if (this.variant == "papel" && this.size == "large") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className}" src=${this.papelLargeURL}>
        </div> 
        `;
      } else if (this.variant == "tijera" && this.size == "large") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className}" src=${this.tijeraLargeURL}>
        </div> 
        `;
      } else if (this.variant == "piedra") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className} img--fixed" src=${this.piedraURL}>
        </div> 
        `;
      } else if (this.variant == "papel") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className} img--fixed" src=${this.papelURL}>
        </div> 
        `;
      } else if (this.variant == "tijera") {
        this.shadow.innerHTML = ` 
        <div class="root">
        <img class="${this.type} ${this.className} img--fixed" src=${this.tijeraURL}>
        </div> 
        `;
      }

      this.shadow.appendChild(style);
    }
  }
  customElements.define("hand-el", Hand);
}
