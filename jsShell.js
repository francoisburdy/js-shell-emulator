/*! jsShell.js | https://github.com/francoisburdy/js-shell-emulator */

const VERSION = '4.0.0';

class JsShell {

  // Prompt types
  static PROMPT_INPUT = 1;
  static PROMPT_PASSWORD = 2
  static PROMPT_CONFIRM = 3;
  static PROMPT_PAUSE = 4;

  constructor(container, options = {}) {

    let containerNode;

    if (typeof container === 'string') {
      if (container.charAt(0) === "#") {
        container = container.substring(1);
      }
      containerNode = document.getElementById(container)
      if (!containerNode) {
        throw new Error(`Failed instantiating JsShell object: dom node with id "${container}" not found in document.`);
      }
    } else if (container instanceof Element) {
      containerNode = container
    } else {
      throw new Error("JsShell constructor requires parameter \"container\' to be a dom Element or node string ID");
    }

    this.html = document.createElement('div');
    this.html.className = options.className || 'jsShell';

    this._innerWindow = document.createElement('div');
    this._output = document.createElement('p');
    this._promptPS = document.createElement('span');
    this._inputLine = document.createElement('span'); //the span element where the users input is put
    this.cursorType = options.cursorType || 'large';
    this.cursorSpeed = options.cursorSpeed || 500;
    this.makeCursor();
    this._input = document.createElement('p'); //the full element administering the user input, including cursor
    this._shouldBlinkCursor = true;

    this.cursorTimer = null;

    this._input.appendChild(this._promptPS);
    this._input.appendChild(this._inputLine);
    this._input.appendChild(this._cursor);
    this._innerWindow.appendChild(this._output);
    this._innerWindow.appendChild(this._input);
    this.html.appendChild(this._innerWindow);

    this.setBackgroundColor(options.backgroundColor || '#000')
      .setFontFamily(options.fontFamily || 'Ubuntu Mono, Monaco, Courier, monospace')
      .setTextColor(options.textColor || '#fff')
      .setTextSize(options.textSize || '1em')
      .setPrompt(options.promptPS || '')
      .setWidth(options.width || '100%')
      .setHeight(options.height || '300px');

    this.html.style.margin = options.margin || '0';
    this.html.style.overflow = options.overflow || 'auto';
    this.html.style.whiteSpace = options.whiteSpace || 'break-spaces';
    this._innerWindow.style.padding = options.padding || '10px';
    this._input.style.margin = '0';
    this._output.style.margin = '0';
    this._input.style.display = 'none';

    containerNode.innerHTML = '';
    containerNode.appendChild(this.html);
  }

  makeCursor() {
    if (this.cursorType === 'large') {
      this._cursor = document.createElement('span');
      this._cursor.innerHTML = 'O'; //put something in the cursor...
    } else {
      this._cursor = document.createElement('div');
      this._cursor.style.borderRightStyle = 'solid'
      this._cursor.style.borderRightColor = 'white'
      this._cursor.style.height = '1em'
      this._cursor.style.borderRightWidth = '3px'
      this._cursor.style.paddingTop = '0.15em'
      this._cursor.style.paddingBottom = '0.15em'
      this._cursor.style.position = 'absolute'
      this._cursor.style.zIndex = '1'
      this._cursor.style.marginTop = '-0.15em'
    }
    this._cursor.className = 'cursor'
    this._cursor.style.display = 'none'; //then hide it
  }

  print(message) {
    let newLine = document.createElement('div');
    newLine.textContent = message;
    this._output.appendChild(newLine);
    this.scrollBottom();
    return this;
  }

  newLine() {
    let newLine = document.createElement('br');
    this._output.appendChild(newLine);
    this.scrollBottom();
    return this;
  }

  write(message) {
    let newLine = document.createElement('span')
    newLine.innerHTML = `${message}`;
    this._output.appendChild(newLine)
    this.scrollBottom();
    return this;
  }

  async type(message, speed = 50) {
    return new Promise(async (resolve) => {
      let newLine = document.createElement('span')
      this._output.appendChild(newLine)
      const timeout = (ms) => {
        return new Promise(resolve2 => setTimeout(resolve2, ms))
      }
      for await (const char of message) {
        await timeout(speed);
        newLine.textContent += char;
        this.scrollBottom();
      }
      resolve();
    })
  }

  printHTML(message) {
    let newLine = document.createElement('div')
    newLine.innerHTML = `${message}`;
    this._output.appendChild(newLine)
    this.scrollBottom();
    return this;
  }

  fireCursorInterval = (inputField) => {
    if (this.cursorTimer) {
      clearTimeout(this.cursorTimer);
    }
    this.cursorTimer = setTimeout(() => {
      if (inputField.parentElement && this._shouldBlinkCursor) {
        this._cursor.style.visibility = this._cursor.style.visibility === 'visible' ? 'hidden' : 'visible';
        this.fireCursorInterval(inputField);
      } else {
        this._cursor.style.visibility = 'visible';
      }
    }, this.cursorSpeed);
  };

  scrollBottom = () => {
    this.html.scrollTop = this.html.scrollHeight;
  }

  async _prompt(message, promptType) {
    return new Promise(async (resolve) => {
      let shouldDisplayInput = (promptType === JsShell.PROMPT_INPUT || promptType === JsShell.PROMPT_CONFIRM);
      let inputField = document.createElement('input');

      inputField.style.position = 'absolute';
      inputField.style.zIndex = '-100';
      inputField.style.outline = 'none';
      inputField.style.border = 'none';
      inputField.style.opacity = '0';
      inputField.style.fontSize = '0.2em';

      this._inputLine.textContent = '';
      this._input.style.display = 'block';
      this.html.appendChild(inputField);
      this.fireCursorInterval(inputField);

      if (message.length) {
        this.printHTML(promptType === JsShell.PROMPT_CONFIRM ? `${message} (y/n)` : message);
      }

      inputField.onblur = () => {
        this._cursor.style.display = 'none';
      }

      inputField.onfocus = () => {
        inputField.value = this._inputLine.textContent;
        this._cursor.style.display = 'inline-block';
      }

      this.html.onclick = () => {
        inputField.focus();
      }

      inputField.onkeydown = (e) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowRight' || e.code === 'ArrowLeft' || e.code === 'ArrowDown' || e.code === 'Tab') {
          e.preventDefault();
        }
        // keep cursor visible while active typing
        this._cursor.style.visibility = 'visible';
      }

      inputField.onkeyup = (e) => {
        this.fireCursorInterval(inputField)
        let inputValue = inputField.value;
        if (shouldDisplayInput && !this.isKeyEnter(e)) {
          this._inputLine.textContent = inputField.value;
        }

        if (promptType === JsShell.PROMPT_CONFIRM && !this.isKeyEnter(e)) {
          if (e.code !== 'KeyY' && e.code !== 'KeyN') { // PROMPT_CONFIRM accept only "Y" and "N"
            this._inputLine.textContent = inputField.value = '';
            return;
          }
          if (this._inputLine.textContent.length > 1) { // PROMPT_CONFIRM accept only one character
            this._inputLine.textContent = inputField.value = this._inputLine.textContent.substr(-1);
          }
        }

        if (promptType === JsShell.PROMPT_PAUSE) {
          resolve();
          inputField.blur()
          this.html.removeChild(inputField);
          this.scrollBottom();
          return;
        }

        if (this.isKeyEnter(e)) {

          if (promptType === JsShell.PROMPT_CONFIRM) {
            if (!inputValue.length) { // PROMPT_CONFIRM doesn't accept empty string. It requires answer.
              return;
            }
          }

          this._input.style.display = 'none';
          if (shouldDisplayInput) {
            this.print(this._promptPS.textContent + inputValue);
          }

          if (typeof (resolve) === 'function') {
            if (promptType === JsShell.PROMPT_CONFIRM) {
              if (inputValue.toUpperCase()[0] === 'Y') {
                resolve(true);
              } else if (inputValue.toUpperCase()[0] === 'N') {
                resolve(false);
              } else {
                throw new Error(`PROMPT_CONFIRM failed: Invalid input (${inputValue.toUpperCase()[0]}})`);
              }
            } else {
              resolve(inputValue);
            }
            this.html.removeChild(inputField); // remove input field in the end of each callback
            this.scrollBottom(); // scroll to the bottom of the terminal
          }

        }
      }
      inputField.focus();
    })

  }

  async expect(cmdList, inputMessage, notFoundMessage) {
    return new Promise(async (resolve) => {
      let cmd = await this.input(inputMessage);
      while (!cmdList.includes(cmd)) {
        cmd = await this.input(notFoundMessage)
      }
      resolve(cmd)
    })
  }

  async input(message) {
    return await this._prompt(message, JsShell.PROMPT_INPUT)
  }

  async pause(message) {
    return await this._prompt(message, JsShell.PROMPT_PAUSE)
  }

  async password(message) {
    return await this._prompt(message, JsShell.PROMPT_PASSWORD)
  }

  async confirm(message) {
    return await this._prompt(message, JsShell.PROMPT_CONFIRM)
  }

  clear() {
    this._output.innerHTML = '';
    return this;
  }

  static async sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  setTextSize(size) {
    this._output.style.fontSize = size;
    this._input.style.fontSize = size;
    return this;
  }

  setTextColor(col) {
    this.html.style.color = col;
    this._cursor.style.background = col;
    this._cursor.style.color = col;
    this._cursor.style.borderRightColor = col;
    return this;
  }

  setFontFamily(font) {
    this.html.style.fontFamily = font
    return this;
  }

  setBackgroundColor(col) {
    this.html.style.background = col;
    return this;
  }

  setWidth(width) {
    this.html.style.width = width;
    return this;
  }

  setHeight(height) {
    this.html.style.height = height;
    return this;
  }

  setBlinking(bool) {
    bool = bool.toString().toUpperCase();
    this._shouldBlinkCursor = (bool === 'TRUE' || bool === '1' || bool === 'YES');
    return this;
  }

  setPrompt(promptPS) {
    this._promptPS.textContent = promptPS;
    return this;
  }

  getVersion() {
    console.info(`JS Shell Emulator ${VERSION}`)
    return VERSION;
  }

  isKeyEnter(event) {
    return event.keyCode === 13 || event.code === 'Enter'
  }

  setVisible(visible) {
    this.html.style.display = !!visible ? 'block' : 'none';
    return this;
  }

  focus() {
    let lastChild = this.html.lastElementChild;
    if (lastChild) {
      lastChild.focus();
    }
    return this;
  }

}

export { JsShell }
