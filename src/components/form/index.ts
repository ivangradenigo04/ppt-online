export function init() {
  class Form extends HTMLElement {
    shadow: ShadowRoot;
    variant: string;
    text: string | null;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.variant = this.getAttribute("variant");
      this.text = this.textContent;
      this.render();
    }

    render() {
      const style = document.createElement("style");
      style.innerHTML = `
      .root{
        font-family:Odibee sans;
        text-align:center;
      }
      
      .form{
        width:320px;
        display:flex;
        flex-direction:column;
        gap:20px;
      }

      @media (min-width: 768px) {
        .form{
          width:340px;
          gap:10px
        }
      }

      .label{
        display:grid;
        gap:2px;
      }

      .input{
        padding:8px;
        border-radius: 10px;
        border: 10px solid #182460;
        background-color: #FFF;
        font-size: 35px;
        font-family: Odibee Sans;
        text-align: center;
      }
      
      .input::placeholder{
        color: #D9D9D9;
      }
      
      .button{
        padding:3px;
        width:100%;
        font-family:Odibee Sans;
        border-radius: 10px;
        text-align:center;
        border: 10px solid #001997;
        background-color: #006CFC;
        cursor:pointer;
        transition: transform 0.3s;
      }

      @media (min-width: 768px) {
        .button:hover{
          transform: scale(1.1);
        }
      }
      `;

      if (this.variant == "name") {
        this.shadow.innerHTML = `
          <div class="root">
          <form class="form">
          <label class="label">
          <text-el variant="component-45">Tu nombre completo</text-el>
          <input class="input" type="text" name="full-name"/>
          </label>
          <button class="button"><text-el variant="button-text">Empezar<text-el></button>
          </form> 
          </div>    
        `;
      } else if (this.variant == "gameroom") {
        this.shadow.innerHTML = `
          <div class="root">
          <form class="form">
          <input class="input" type="text" name="id" placeholder="Código"/>
          <button class="button"><text-el variant="button-text">Ingresar a la sala<text-el></button>
          </form> 
          </div>    
        `;
      }

      this.shadow.appendChild(style);
    }
  }
  customElements.define("form-el", Form);
}
