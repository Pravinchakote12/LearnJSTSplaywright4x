// Compile-time polymorphism (Method Overloading) is not directly supported in JavaScript.
// However, you can achieve similar behavior using default parameters or rest parameters.

class Calculator {
    add(a, b = 0, c = 0) {
        return a + b + c;
    }
}

let calc = new Calculator();
console.log(calc.add(5));        // 5
console.log(calc.add(5, 10));     // 15
console.log(calc.add(5, 10, 15)); // 30