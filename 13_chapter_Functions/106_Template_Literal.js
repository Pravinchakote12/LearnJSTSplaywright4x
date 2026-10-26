function greet(name){
    return `Hello, ${name}`;
}

let op = greet('Alice');
console.log(op);


function helpMe(name){
    return `Help me, ${name}`;
}

let op1 = helpMe('Bob');
console.log(op1);

const helpMe1 = (n1) => `Help me, ${n1}`;
console.log(helpMe1('Charlie'));