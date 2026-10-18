const data = require('fs').readFileSync(0, 'utf8');
// Write your solution here
let sidesTriangle = data.split(' ');
// console.log(sidesTriangle)

let side1 = sidesTriangle[0];
let side2 = sidesTriangle[1];
let side3 = sidesTriangle[2];

// console.log(side1);
// console.log(side2);
// console.log(side3);

if (side1 == side2 && side2 == side3) {
    console.log('Equilateral');
} else if (side1 == side2 || side2 == side3 || side1 == side3) {
    console.log('Isosceles');
} else { 
    console.log('Scalene')

}