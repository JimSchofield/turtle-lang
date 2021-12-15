import Tokenizer from './tokenizer';

class Turtle {
  textareaEl = document.querySelector<HTMLTextAreaElement>('#txt');
  runButton = document.querySelector<HTMLButtonElement>('#run');
  source = ""
  tokenizer = new Tokenizer();

  constructor() {
    this.attachHandlers();
  }

  run() {
    const result = this.tokenizer.scan(this.textareaEl.value);
    console.log(result);
  }

  attachHandlers = () => {
    this.runButton.addEventListener('click', () => {
      this.run(); 
    })
  }
}

new Turtle();
