export function init() {
  class Timer extends HTMLElement {
    shadow: ShadowRoot;
    text: string | null;
    count: number = 3;

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
      .timer{
        font-family:"Nunito";
        display:flex;
        align-items:center;
        justify-content:center;
        font-size: 70px;
        width: 200px;
        height: 100px;
        margin:50px auto;
        padding:50px 0;
        border: 10px solid black;
        border-radius:50%;
      }
      `;

      this.shadow.innerHTML = `
        <div class="root">
        <div class="timer">${this.count}</div> 
        </div>    
      `;

      this.shadow.appendChild(style);
    }
  }
  customElements.define("timer-el", Timer);
}
