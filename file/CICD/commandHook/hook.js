let execSync = require('child_process').execSync;

let command = `dir`

// what you do pre

console.log(execSync(command).toString())

// what you do last