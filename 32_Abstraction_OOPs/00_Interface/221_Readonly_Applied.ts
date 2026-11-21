// Readonly

interface Point1{
    readonly x1:number;
    readonly y1:number;
}

const point1 : Point1 = {
    x1:10,
    y1:10,
}
console.log(point1)

// point.x1 = 15
console.log(point1)