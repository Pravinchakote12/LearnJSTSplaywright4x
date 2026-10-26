// Type 1 - No param / argument, No Return -> final retunr undefined.

//Fn define

function greet(){
    console.log("Hello, TeamTesting");
}

greet();
greet();
greet();


function openBrowser(){
    console.log("Open Browser");
    // open the brower
}

openBrowser();

// invalid function call 
let msg = greet(); // undefined there is not return.
console.log(msg);