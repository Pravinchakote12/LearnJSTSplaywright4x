# Object-Oriented Programming (OOP) in TypeScript

Object-oriented programming is a way to organize a program around **objects**: values that hold related data and operations together. It is useful when a program models things with identity, state, and behavior, such as users, accounts, browser pages, or API clients.

OOP is not the only way to write a program, and a class is not automatically better than a function. Use objects and classes when grouping state and behavior makes the code easier to understand and maintain.

## 1. Classes and objects

A **class** is a definition, or blueprint. An **object** is a particular value created from that definition.

```ts
class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  introduce(): string {
    return `Hi, I am ${this.name}.`;
  }
}

const user1 = new User("Mira", "mira@example.com");
const user2 = new User("Dev", "dev@example.com");

console.log(user1.introduce()); // Hi, I am Mira.
console.log(user2.name);        // Dev
```

`User` is the class. `user1` and `user2` are separate objects made from it. Each object has its own `name` and `email`.

### The constructor and `this`

- `new User(...)` creates an object and calls its `constructor`.
- Constructor parameters provide the initial values for the object.
- `this` means “the object this method or constructor is currently working with.”
- `user1.introduce()` runs the method with `this` referring to `user1`.

TypeScript also supports **parameter properties**, a compact way to declare and initialize fields:

```ts
class User {
  constructor(
    public name: string,
    public email: string
  ) {}
}
```

This is shorthand for declaring `name` and `email` fields and assigning the constructor arguments to them.

## 2. Encapsulation

**Encapsulation** means keeping an object's state and the rules for changing that state together. It prevents other code from changing internal details in ways that could leave the object invalid.

For example, an account should not allow its balance to be set to any arbitrary value:

```ts
class BankAccount {
  private balanceInCents: number;

  constructor(initialBalanceInCents: number) {
    if (initialBalanceInCents < 0) {
      throw new Error("Initial balance cannot be negative");
    }

    this.balanceInCents = initialBalanceInCents;
  }

  get balance(): number {
    return this.balanceInCents / 100;
  }

  deposit(amountInCents: number): void {
    if (amountInCents <= 0) {
      throw new Error("Deposit must be greater than zero");
    }

    this.balanceInCents += amountInCents;
  }
}

const account = new BankAccount(2500);
account.deposit(500);
console.log(account.balance); // 30
// account.balanceInCents = -100; // TypeScript error: private member
```

The class owns the balance and controls how it changes. `private` prevents code outside the class from accessing `balanceInCents` in TypeScript.

### TypeScript access modifiers

| Modifier | Where it can be accessed |
| --- | --- |
| `public` | Anywhere. This is the default when no modifier is written. |
| `private` | Only inside the class that declares the member. |
| `protected` | Inside the declaring class and its subclasses. |

These modifiers are primarily TypeScript's type-checking rules. The `private` keyword shown above is not the same as JavaScript's runtime-private `#field` syntax. If runtime privacy is required, JavaScript private fields can be used:

```ts
class TokenStore {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  hasToken(): boolean {
    return this.#token.length > 0;
  }
}
```

Avoid making every field public by default just for convenience. Expose the smallest useful API, and validate changes to important state.

## 3. Inheritance

**Inheritance** lets a specialized class reuse and extend another class. The class being extended is the **base class** (or parent); the new class is the **derived class** (or child).

```ts
class Notification {
  constructor(protected recipient: string) {}

  send(): string {
    return `Sending a notification to ${this.recipient}`;
  }
}

class EmailNotification extends Notification {
  constructor(recipient: string, private subject: string) {
    super(recipient);
  }

  send(): string {
    return `${super.send()} by email: "${this.subject}"`;
  }
}

const notice = new EmailNotification("mira@example.com", "Welcome");
console.log(notice.send());
// Sending a notification to mira@example.com by email: "Welcome"
```

- `extends` establishes the inheritance relationship.
- `super(...)` calls the base class constructor. A derived constructor must call it before using `this`.
- `protected` lets the derived class use `recipient`, while code outside the class hierarchy cannot access it directly.
- `super.send()` calls the base implementation.

Inheritance describes an **“is-a”** relationship: an email notification is a notification. Use it when that relationship is genuinely true. Deep or awkward inheritance chains make code harder to change.

## 4. Polymorphism

**Polymorphism** means different objects can be used through the same operation or contract, while each provides its own behavior.

```ts
abstract class PaymentMethod {
  abstract pay(amountInCents: number): string;
}

class CardPayment extends PaymentMethod {
  pay(amountInCents: number): string {
    return `Charging card ${amountInCents} cents`;
  }
}

class GiftCardPayment extends PaymentMethod {
  pay(amountInCents: number): string {
    return `Using gift card for ${amountInCents} cents`;
  }
}

function checkout(method: PaymentMethod, amountInCents: number): void {
  console.log(method.pay(amountInCents));
}

checkout(new CardPayment(), 1200);
checkout(new GiftCardPayment(), 1200);
```

`checkout` does not need to know which concrete payment class it received. It only relies on the shared `pay` operation. Each subclass supplies its own implementation.

An `abstract` class cannot be instantiated directly. It can contain shared code as well as abstract methods that subclasses are required to implement. Use the `override` keyword on a subclass method when overriding a base-class method; it helps TypeScript catch accidental misspellings or methods that do not actually override anything.

## 5. Abstraction and interfaces

**Abstraction** means describing what a caller can do without requiring it to know all the implementation details.

An **interface** defines a type-level contract. A class can implement the contract, and functions can depend on the contract rather than a specific class:

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class OrderService {
  constructor(private logger: Logger) {}

  placeOrder(): void {
    this.logger.log("Order placed");
  }
}

const service = new OrderService(new ConsoleLogger());
service.placeOrder();
```

`OrderService` only needs something that follows `Logger`. Another implementation (for example, one that writes to a file in a server application) could be supplied without changing `OrderService`.

An interface is erased when TypeScript is compiled to JavaScript: it provides compile-time checking, not a runtime object or runtime validation. For data arriving from outside the program, validate it at runtime as well.

## 6. Composition

**Composition** builds an object by giving it other objects to use. It often avoids rigid inheritance and is a good choice when a class *has* or *uses* another thing rather than *is* another thing.

```ts
interface Clock {
  now(): Date;
}

class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

class Report {
  constructor(private clock: Clock) {}

  createdAt(): Date {
    return this.clock.now();
  }
}

const report = new Report(new SystemClock());
console.log(report.createdAt());
```

`Report` uses a `Clock`; it is not a kind of clock. Supplying the dependency through the constructor also makes it possible to provide a predictable test clock in tests.

## 7. The four commonly taught OOP ideas

These terms are often called the four pillars of OOP:

1. **Encapsulation** — keep state and the rules for working with it together; protect internal details.
2. **Inheritance** — create a specialized class from a base class when the “is-a” relationship makes sense.
3. **Polymorphism** — use different implementations through one shared type or operation.
4. **Abstraction** — expose the essential operations and hide unnecessary implementation detail.

They are related ideas, not a checklist every class must use. A small class may need only encapsulation; an interface-based design may use abstraction and polymorphism without class inheritance.

## 8. Applying this to the API client example

The access-modifier example in [`236_PPP.ts`](../34_private_public_protected/236_PPP.ts) uses these ideas:

- `APIClient` is a class; `client` is an instance (object).
- `baseURL` is `public`, so caller code can read it.
- `apiKey` is `private`, so callers should use the class's public operations rather than read the key.
- `getAuthHeader()` is private helper behavior used internally by `sendRequest()`.
- `timeout` is `protected`, so a subclass such as `UserAPIClient` can use it.
- `UserAPIClient extends APIClient` demonstrates inheritance.

One important security improvement: do not hard-code real API keys in source code or print them to logs. Load secrets from an appropriate secret store or environment configuration, and avoid logging authentication headers.

## 9. Practical design guidance

- Give a class one clear responsibility.
- Keep internal state private or protected when callers do not need direct access.
- Use methods to enforce rules when state changes.
- Prefer interfaces for contracts and composition for interchangeable dependencies.
- Use inheritance only for a real “is-a” relationship; do not use it just to share a few lines of code.
- Prefer simple functions and plain objects when a class would add ceremony without useful state or behavior.
- Remember that TypeScript types and interfaces help during development but do not validate untrusted runtime input.
