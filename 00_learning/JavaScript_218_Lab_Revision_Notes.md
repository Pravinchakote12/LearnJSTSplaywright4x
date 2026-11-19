# JavaScript & TypeScript Labs 1–218 — Revision Notes

Use this as a quick-recall sheet, not a replacement for running the examples. It covers the JavaScript, OOP, and introductory TypeScript topics in the labs numbered 1–218. The Playwright examples in this range are introductory async-test examples, not a complete Playwright guide.

## 1. The core mental model

- **Values have types; variables hold values.** JavaScript is dynamically typed, so a variable can later hold a value of another type.
- Common primitive types: `string`, `number`, `boolean`, `bigint`, `undefined`, `null`, and `symbol`. Objects, arrays, and functions are reference values.
- A **literal** is a value written directly in code: `42`, `"hello"`, `true`, `null`.
- JavaScript has one `number` type for ordinary integers and decimals. `NaN` and `Infinity` are also numbers; use `Number.isNaN(value)` to check for `NaN`.
- Remember the two `typeof` oddities:

  ```js
  typeof null       // "object" — a historical JavaScript quirk
  typeof undefined // "undefined"
  ```

- `undefined` usually means “not assigned / not found”; `null` means “intentionally empty.”
- `const` prevents rebinding the variable; it does **not** make an object or array immutable.

## 2. Operators: predict the value before running it

| Operator | Remember |
| --- | --- |
| `=` | Assign a value; it is not an equality check. |
| `==` / `!=` | Loose equality; may coerce types. |
| `===` / `!==` | Strict equality; compares without type coercion. Prefer these for normal checks. |
| `+ - * / % **` | Arithmetic; `%` gives the remainder, `**` raises to a power. |
| `> < >= <=` | Relational comparisons produce a boolean. |
| `&& || !` | AND, OR, NOT. `&&` and `||` short-circuit. |
| `condition ? yes : no` | Ternary expression for one concise choice. |
| `value ?? fallback` | Use the fallback only when `value` is `null` or `undefined`. |

**Increment/decrement trap**

```js
let a = 10;
let before = ++a; // increment first: before = 11, a = 11
let after = a++;  // use first: after = 11, then a = 12
```

In expressions, evaluate left to right and track each update. Prefer a separate increment statement when the result would otherwise be hard to read.

**Loose equality trap:** `"" == 0` is `true`, while `"" == "0"` is `false`; coercion makes loose equality surprising. Use `===` unless coercion is deliberate.

## 3. Decisions and input

- `if / else if / else` handles ranges and more involved conditions. Check invalid/out-of-range input before classifying it; test boundary values.
- `switch` compares cases strictly. Use `break` to stop after the matching branch. Leaving it out causes **fall-through**; stacked cases can intentionally share a branch.
- Use a ternary for a simple value choice, not a long, deeply nested decision tree.
- Browser `prompt()` and Node input arrive as text. Convert explicitly when doing numeric work:

  ```js
  const score = Number(input);
  ```

- The labs show browser `prompt`, Node `readline`, `prompt-sync`, and reading standard input with `fs`. Choose the method for the runtime you are using.

## 4. Loops: know the stopping condition

```js
for (let i = 0; i < limit; i++) { /* repeat */ }
while (condition) { /* update state so it can stop */ }
do { /* runs at least once */ } while (condition);
```

- A `for` loop’s three parts are **initialize → condition → update**.
- `while` checks before each iteration; `do...while` checks after, so it always runs once.
- Nested loops are useful for grids, matrices, and printed patterns: the outer loop chooses a row; the inner loop builds that row.
- `break` exits a loop. Before running a `while (true)`, confirm there is a reachable `break`.
- Off-by-one check: decide whether the end is inclusive (`<=`) or exclusive (`<`) and test the first and last iterations.

## 5. Arrays: values, indexes, and mutation

- Arrays are zero-indexed; `length` is the number of items. An invalid index usually gives `undefined`; `at(-1)` gets the last item.
- Arrays are objects (`typeof [] === "object"`); use `Array.isArray(value)` to identify one.

| Goal | Common methods | Changes the original? |
| --- | --- | --- |
| Add/remove at end | `push`, `pop` | Yes |
| Add/remove at start | `unshift`, `shift` | Yes |
| Insert/remove/replace at an index | `splice(start, deleteCount, ...items)` | Yes |
| Get a range / copy | `slice(start, end)` | No; `end` is excluded |
| Search | `includes`, `indexOf`, `lastIndexOf` | No |
| Find an item / index by condition | `find`, `findIndex` | No |
| Transform / select | `map`, `filter` | Returns a new array |
| Combine | `concat`, `[...a, ...b]` | Returns a new array |
| Test conditions | `every`, `some` | Returns a boolean |

- `indexOf` returns `-1` when absent; `find` returns `undefined` when no item matches.
- Iterate by **index** with a classic `for` or `for...in` (which yields keys/indexes); iterate over **values** with `for...of`. `forEach` is convenient for side effects and does not produce a new array.
- `sort()` changes the array and sorts values as strings by default. For numbers, supply a comparator:

  ```js
  numbers.sort((a, b) => a - b); // ascending
  numbers.sort((a, b) => b - a); // descending
  ```

- Destructuring unpacks positions: `const [first, second, ...rest] = values;`. A skipped slot can be left blank: `const [, , third] = values;`.
- **Copying matters:** `const alias = original` shares the same array. `[...original]` and `original.slice()` make shallow copies. Nested objects inside a shallow copy are still shared. `structuredClone(value)` can make a deep copy of supported data.
- One lab labels an alias as a “deep copy”; remember that assigning an array/object to another variable copies its **reference**, not its contents.

## 6. Functions: inputs in, results out

Think of a function as a reusable unit with optional inputs and an optional returned result:

```js
function add(a, b) {
  return a + b;
}
```

| Function shape | Example idea |
| --- | --- |
| No parameters, no return | Perform an action, such as logging. |
| No parameters, returns value | `return "Hello";` |
| Parameters, no return | Use inputs for an action; the call evaluates to `undefined`. |
| Parameters and return | Compute and return a result. |

- A function with no `return` (or a bare `return`) returns `undefined`.
- A **function declaration** can be called before its definition due to hoisting. Function expressions and arrow functions are values assigned to variables.
- Arrow functions: `(x) => x * 2`. With a block body `{}`, write `return` explicitly. A one-parameter arrow may omit parentheses.
- Template literals use backticks and `${expression}`: `` `Hello, ${name}` ``.
- **Rest** gathers arguments into an array: `function check(...codes) {}`. **Spread** expands an iterable: `check(...codes)`.
- An IIFE is invoked as soon as it is defined; the labs use `(() => { /* setup */ })();`.
- Closures remember the variables of the scope where the inner function was created. Returning an inner function keeps that surrounding state available.

## 7. Scope, hoisting, and the temporal dead zone

| Declaration | Scope | Key reminder |
| --- | --- | --- |
| `var` | Function-scoped | Can be redeclared; hoisted and initialized to `undefined`. Usually avoid for new code. |
| `let` | Block-scoped | Reassignable; cannot be redeclared in the same scope. |
| `const` | Block-scoped | Must be initialized; cannot be rebound. |

- `let` and `const` are hoisted too, but cannot be accessed before their declaration is evaluated. That period is the **temporal dead zone (TDZ)** and access throws `ReferenceError`.
- A block `{ ... }` creates a scope for `let` and `const`; `var` ignores ordinary block boundaries.
- Do not confuse “declaration is hoisted” with “safe to use before the declaration.” That differs among declaration types.

## 8. Strings and objects

**Strings**

- Use single or double quotes for simple strings; backticks for interpolation and multiline text.
- Strings have `length`, zero-based indexes, and are immutable.
- `includes`, `startsWith`, `endsWith`, `indexOf`, and `lastIndexOf` help inspect/search strings.
- `at(-1)` gets the last character. `charAt(-1)` does not support negative indexes and returns `""` for an out-of-range index.

**Objects**

```js
const user = {
  name: "Alex",
  greet() { return `Hi, ${this.name}`; }
};
```

- Read with `object.key` or `object["key"]`; quoted/bracket notation is useful for dynamic keys. Property names are case-sensitive.
- Properties can be added, changed, or removed with assignment and `delete`.
- A method called as `object.method()` gets that object as `this`.
- Assigning an object to another variable copies the reference. `{ ...object }` makes a shallow copy; nested objects remain shared.

## 9. Two-dimensional arrays and patterns

- A 2D array is an array of rows: `grid[row][column]`. `grid.length` counts rows; `grid[row].length` counts columns in that row.
- Use nested loops to visit each cell. For row totals, transform each row and reduce it:

  ```js
  const totals = scores.map(row => row.reduce((sum, score) => sum + score));
  ```

- For text patterns, the outer loop controls rows and inner loops control spaces/stars. Build a whole `row` string, then print it once.

## 10. Asynchronous JavaScript: callbacks → promises → async/await

**Callbacks**

- A callback is a function passed to another function to run later or at a chosen point.
- `forEach` callbacks run synchronously. A timer callback runs later, so code after `setTimeout` runs before that timer callback.
- Deeply nested callbacks make ordered workflows difficult to read (“callback hell”). Error-first callbacks conventionally pass an error first; handle it and return before using missing results.

**Promises**

- A promise settles once: fulfilled (`resolve`) or rejected (`reject`).
- `.then()` handles fulfillment and can return a value or another promise; return the next async operation to keep a chain sequential.
- `.catch()` handles rejection. `.finally()` runs for cleanup on either outcome.
- Promise combinators:

  | Method | Behavior |
  | --- | --- |
  | `Promise.all([...])` | Fulfilled values in input order when all fulfill; rejects as soon as one rejects. |
  | `Promise.allSettled([...])` | Waits for every promise; each result has `status` and `value` or `reason`. |
  | `Promise.race([...])` | Settles with the first promise to settle, whether fulfilled or rejected. |

**Async/await**

```js
async function load() {
  try {
    const result = await getData();
    return result;
  } catch (error) {
    // handle/report failure
  } finally {
    // cleanup
  }
}
```

- An `async` function always returns a promise. `await` unwraps a promise’s fulfillment value and pauses that async function until it settles.
- A rejected promise becomes a thrown error at `await`; use `try/catch/finally`.
- Independent requests can run together with `await Promise.all([a(), b()])`. Use separate `await` statements when a later step depends on an earlier result.
- After `await Promise.resolve()`, the continuation runs later: in the lab ordering, synchronous logs happen first, then the code after `await`.
- Playwright starter examples use `test(..., async ({ page }) => { await page.goto(...); })`. Await async Playwright actions; the included labs do not cover the full Playwright API.

## 11. Modules: share code across files

- **Named exports/imports** use matching names; aliases can rename an imported binding:

  ```js
  import { BASE_URL as apiBase } from "./utils.js";
  ```

- A **default export** is the module’s primary export and can be imported with a chosen local name:

  ```js
  import log from "./logger.js";
  ```

- Keep module paths and filenames exact. Named and default imports have different syntax.

## 12. Classes and object-oriented programming

- A class is a blueprint; `new ClassName(...)` creates an instance. The `constructor` initializes it, and methods describe behavior.
- `this.property` is instance data; each instance has its own values. `static` properties/methods belong to the class itself, not individual instances.
- A private field starts with `#` and is only accessible from within its class. Expose controlled behavior through methods (or accessors); validate changes at that boundary.
- A class may have one constructor. Use default parameter values for optional constructor arguments.
- Inheritance: `class Child extends Parent`. Call `super(...)` before using `this` in a derived constructor. `super.method()` invokes a parent method.
- **Overriding:** a child method with the same name replaces the inherited version for that child; call `super.method()` when you want to extend rather than entirely replace the parent behavior.
- **Polymorphism:** different child objects can respond to the same method call in their own way. The lab’s test types all implement `execute()`, so one loop can call `test.execute()` without checking each concrete type.

- **Inheritance shapes in the labs:**
  - **Single:** one child extends one parent.
  - **Multilevel:** a chain such as `BasePage → AuthPage → AdminPage`; the last class can use inherited behavior from both levels.
  - **Hierarchical:** several child classes extend the same parent.
  - JavaScript classes cannot extend two classes directly. Use **mixins** to compose reusable behavior, or prefer composition. The hybrid-inheritance exercise is a concept placeholder, not a built-in JS feature.
- **Overriding and `super`:** the child implementation runs for an overridden method. `super.method()` lets it reuse the parent implementation. A child constructor must call `super(...)` before using `this`.
- JavaScript does not provide traditional compile-time method overloading. Default and rest parameters can handle different argument counts, but do not create distinct overload signatures.
- A method can return `this` to support a fluent chain, for example `counter.increment().display()`.

## 13. TypeScript: types on JavaScript values

- TypeScript adds annotations that help catch type mismatches before running the code; types are not a replacement for runtime input validation.
- Common annotations from the labs:

  ```ts
  let name: string = "Alex";
  let age: number = 30;
  let active: boolean = true;
  let numbers: number[] = [1, 2, 3];
  let names: Array<string> = ["Alex", "Sam"];
  ```

- JavaScript numbers are typed as `number`; there is no separate `float` type.
- `any` opts out of much type checking. Prefer `unknown` for a value of uncertain type, then check/narrow it before using it.
- Annotate function parameters and return types:

  ```ts
  const multiply = (a: number, b: number): number => a * b;
  function sayHello(message: string): void { console.log(message); }
  ```

- `void` means the function does not return a useful value. `never` means it does not complete normally, such as a function that always throws or loops forever.
- Inline object types describe the expected property names and types:

  ```ts
  let user: { name: string; age: number } = { name: "Alex", age: 30 };
  ```

## 14. Fast recall: common traps

1. `=` assigns; `===` compares without coercion.
2. `typeof null` is `"object"`; use `Array.isArray` for arrays.
3. `++x` changes before use; `x++` changes after use.
4. `switch` falls through without `break`.
5. `slice` does not mutate; `splice` does. `sort()` mutates and defaults to lexicographic order.
6. `for...in` gives keys/indexes; `for...of` gives values.
7. An object/array assignment is an alias; spread only makes a shallow copy.
8. `var` is function-scoped; `let`/`const` are block-scoped and have a TDZ.
9. A function without a return value evaluates to `undefined`.
10. `Promise.race` means first **settled**, not first successful.
11. `async` means a promise is returned; `await` does not block the entire JavaScript program.
12. Instance members use instances; static members use the class.

## 15. Quick self-check

Try to answer without looking above:

- What is the difference between `null` and `undefined`? What does `typeof null` return?
- What do `++i` and `i++` return when `i` starts at `3`?
- Which array methods mutate: `slice`, `splice`, `push`, `map`, `sort`?
- What does `find` return if nothing matches? What does `indexOf` return?
- Why is `{ ...user }` not always a full independent copy?
- Which declaration is block-scoped: `var` or `let`?
- What is different about `do...while`?
- When should independent async calls use `Promise.all`?
- Which runs first: a synchronous log after calling an async function, or a log after its `await`?
- Where do private and static class members live?
- Which inheritance shapes can JavaScript classes express directly, and when might a mixin help?
- What is the difference between TypeScript's `any`, `unknown`, `void`, and `never`?

## Lab map

| Lab range | Main ideas |
| --- | --- |
| 1–18 | Setup, identifiers, literals, primitive values, numbers, `null`/`undefined` |
| 19–45 | Assignment, arithmetic, comparison, logic, ternary, increment/decrement, nullish coalescing |
| 46–62 | Conditions, `switch`, console and Node input |
| 63–77 | `for`, `while`, `do...while`, nested loops, `break` |
| 78–100 | Arrays, iteration, search, transformations, sorting, copying, destructuring |
| 101–127 | Function forms, parameters/returns, arrows, spread/rest, scope, hoisting, TDZ |
| 128–139 | Closures, strings, objects, references and copying |
| 140–146 | 2D arrays, reductions, nested-loop patterns |
| 147–171 | Callbacks, promises, async/await, sequential and parallel tasks, Playwright starters |
| 172–174 | ES module imports and exports |
| 175–200 | Classes, constructors, encapsulation, static members, inheritance, polymorphism |
| 201–211 | Polymorphism examples, inheritance structures, mixins, method chaining, OOP practice |
| 212–218 | TypeScript basics, primitive/array/object types, typed functions, `void`, and `never` |
