JS Shell Emulator
==========

JS Shell Emulator is a dead simple pure JavaScript library for emulating a shell environment.

This package is a fork from [eosterberg/terminaljs](https://github.com/eosterberg/terminaljs), rewritten with async/await functions and features enriched.

## Install

`npm i js-shell-emulator`

## Get started

Create a container element with an id.
```html
<div id="container"></div>
```

Import module and create a JsShell instance.
```js
import { JsShell } from "jsShell.js";

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
Below are the default options that you can pass in the constructor second parameter. 
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
Displays a confirm message, with a " (y/n)" automatically appended at the end. The callback receives the yes/no value as
a boolean.

    .clear()

Clears the screen.

    .setPrompt()

You can customize your PS1 for the prompt. It can be set and override at any point of time.

```js
JsShell.sleep(milliseconds)
```

Works exactly like the JavaScript "setTimeout" function. Waits for the number of milliseconds given, then executes the
callback.

    .setTextSize()
    .setTextColor()
    .setBackgroundColor()
    .setWidth()
    .setHeight()

All the ".set" methods accepts any CSS-compliant value.

    .blinkingCursor(boolean)

Set to true by default.

    .html

This is the top DOM element of the shell instance. If you want to modify styling via CSS, all instances belong to a
.jsShell class.

### License

The MIT License

Copyright (c) 2014 François Burdy, Erik Österberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
