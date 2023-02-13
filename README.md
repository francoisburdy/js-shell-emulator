JS Shell Emulator
==========

JS Shell Emulator is a dead simple pure JavaScript library for emulating a shell environment.

### Install

`npm i js-shell-emulator`

### Usage example

```javascript
import JsShell from 'js-shell-emulator';

let t1 = new JsShell('shell-1');
t1.setHeight("400px");
t1.print('This is sample with some additional logic:')
  .print(`Are you ready? Let's go!`)
  .input(`Hi! What's your name?`, function(name) {
    t1.print(`Welcome, ${name}!`)
      .sleep(1000, function() {
        t1.print(`We have more questions to follow.`)
          .input(`Enter your email, please:`, function(email) {
            t1.password('Enter password:', function(password) {
              t1.print(`Your name is "${name}" and your email is "${email}" and you have entered password "${password}".`)
                .confirm(`Is it true?`, function(didConfirm) {
                  t1.print(didConfirm ? 'You confirmed!' : 'You declined!')
                });
            });

          });
      });
  });
```

### Properties and methods

    .print(message)

Prints the message on a new line.

    .input(message, callback)

Prints the message, and shows a prompt where the user can write. When the user presses enter, the callback function
fires. The callback takes one argument, which is the user input.

    .password(message, callback)

The same as input but the input of the user will be hidden just like an old-fashioned shell.

    .confirm(message, callback)

Displays a confirm message, with a " (y/n)" automatically appended at the end. The callback receives the yes/no value as
a boolean.

    .clear()

Clears the screen.

    .setPrompt()

You can customize your PS1 for the prompt. It can be set and override at any point of time.

    .sleep(milliseconds, callback)

Works exactly like the JavaScript "setTimeout" function. Waits for the number of milliseconds given, then executes the
callback.

    .beep()

**DISMISSED** from v. 3.0. Plays a retro digital tone.

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

Copyright (c) 2014 Erik Österberg, François Burdy

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
