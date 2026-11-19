class TestCase {
    #status = "not run";
    static #count = 0;
    constructor(name) {
        this.name = name;
        TestCase.#count++;
    }
    run(pass) {
       this.#status = pass ? "PASSED" : "FAILED";
    }
    getStatus() { 
        return this.#status; 
    }
    static getCount() { 
        // return TestCase.#count;     // this shows error because static method can not access private variable of class
        return this.#count; 
    }
    static setCount(v) {
        // TestCase.#count = v;         // this shows error because static method can not access private variable of class
        this.#count = v;
    }
}
const tc = new TestCase("login");
tc.run(true);
console.log(tc.getStatus());
new TestCase("login");
new TestCase("login");
new TestCase("login");
console.log(TestCase.getCount())