#!/bin/bash
java -jar compiler.jar -O SIMPLE --js_output_file game.min.js  FX.js utils.js controls.js phys.js actors.js level0.js main.js
