JS Shell Emulator
==========

JS Shell Emulator is a dead simple pure JavaScript library for emulating a shell environment.

This package is a fork from [eosterberg/terminaljs](https://github.com/eosterberg/terminaljs), rewritten with
async/await functions and features enriched.

## Install

```bash
# Using NPM
npm install js-shell-emulator`

# Using Yarn
yarn add js-shell-emulator
```

## Get started

Create a container element with an id.

```html

<div id="container"></div>
```

Import module and create a JsShell instance.

```js
import { JsShell } from "js-shell-emulator";

let shell = new JsShell("#container")
shell.print(`Hello, world!`)
```

## Methods

### Display text & content

```js
// prints a text line
shell.print("Print this message")

// prints a rich html text
shell.printHTML("<strong>Print this bold message</strong>")

// prints a piece of text without line break at the end
shell.write("Print this")

// progressive display, simulates typing. Prints a char every 50ms 
shell.type("This will be displayed gradually", 50)

// prints a piece of text without line break at the end
shell.write("Print this ")
  .write("message")
  .newLine()
```

### Prompt for input

```js

// Ask for text
let name = await shell.input("What's your name?")

// Ask for a secret, input won't be shown during typing.
let secret = await shell.password("Enter your password")

// Ask for confirmation. "(y/n)" will be append at the end of the question. 
let confirm = await shell.confirm("Are you sure?")
```

### Interface customization

#### Constructor options

Below are the (default) styling options that you can pass in the constructor second parameter.

```js
const shell = new JsShell('#container', {
  backgroundColor: '#000',
  textColor: '#fff',
  className: 'jsShell', // this class will be applied on the shell root element.
  cursorType: 'large', // Typing cursor style: "large" ▯ or "thin" |
  cursorSpeed: 500, // blinking interval in ms
  fontFamily: 'Ubuntu Mono, Monaco, Courier, monospace',
  textSize: '1em',
  promptPS: '', // Prompt PS1 prefix ($, #, > or whatever you like) 
  width: '100%', // Shell root element css width
  height: '300px', // Shell root element css height
  margin: '0',
  overflow: 'auto',
  whiteSpace: 'break-spaces',
  padding: '10px',
})
```

#### Dynamic setters

You can programatically update styles using the follow setters:

```js
 shell
  .setTextSize('0.9rem')
  .setTextColor('green')
  .setFontFamily('consolas')
  .setBackgroundColor('black')
  .setWidth('100%')
  .setHeight('400px')
  .setBlinking(true) // start or stop cursor blinking
  .setPrompt('$ ')
  .setVisible(true)  // show or hide terminal
```

#### Custom CSS

The package is CSS free, but you can apply any other styles on the root terminal class:

```css
.jsShell {
    opacity: 0.9;
    line-height: 120%;
}
```

### Play time

```js
// Wait a second
await JsShell.sleep(1000)

// Give user a break
await shell.pause("Press any key to continue.")
```

### Other methods

```js
// Clear the terminal screen
shell.clear()

// Focus the shell prompt
shell.focus()
```

## License

See [LICENSE.md](LICENSE.md)
