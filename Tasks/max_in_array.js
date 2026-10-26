const data = require('fs').readFileSync(0, 'utf8');
const tokens = data.split(/\s+/).filter(s => s.length > 0).map(Number);
const n = tokens[0];
const arr = tokens.slice(1, 1 + n);

// Write your solution here

let maxElement = arr[0];
for (let i = 1; i < n; i++) {
    if (arr[i] > maxElement) {
        maxElement = arr[i];
    }
}
console.log(maxElement);