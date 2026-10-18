// 1. 
let a = 100;

console.log(a++ + ++a +a++ + ++a);

console.log(a);

// 2.
let b = 37;

console.log(--b + b--);

console.log(b);

// 3.
let c = 5; 
let d = c-- - --c; 
console.log(d, c);

// 4.
let i = 1; 

let r = i++ > 1 ? i++ : ++i; 
console.log(r, i);