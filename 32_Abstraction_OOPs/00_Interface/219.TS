interface User{
    name:string,
    age: number,
    email : string
}

let user1:User = {
    name: "Prmaod",
    age : 100,
    email : "abcaa@gmail.com"
}

const user2:User = {
    name: "Prmaod",
    age: 90,
    email : "abcaa@gmail.com"
}

const user3: User = {
    name: "John3",
    age : 23,
    email: "abc@gmail.com"
}

//the object reference of user1 and user2 is different but the structure is same so we can say that they are of same type
// user1 and user2 are instances of the User interface
// attributes of user1 should be equal to the interface User attributes, it should have the same structure as the User interface, otherwise it will give an error
