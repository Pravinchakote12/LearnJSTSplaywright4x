class BaseTest {
    setup() {
        console.log("Base: open browser");
    }
}
class APITest extends BaseTest {
    setup() {
        console.log("APITest: open browser");
    }
}

let test = new APITest();
test.setup();


// If same method is present in both parent and child class then child class method will be executed. This is called as Method Overriding.