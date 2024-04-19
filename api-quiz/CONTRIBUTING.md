# Contributing to Tech Quiz API

## Javascript styleguide

- **Prefer usage of native methods over libraries such as `lodash`**
- Use 2 spaces. Not tabs.
- Prefer the object spread operator `({...anotherObj})` to `Object.assign()`
- Inline exports with expressions whenever possible
```javascript
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
```

- Place requires in the following order:
    - Built in Node Modules (such as path)
    - Local Modules (using relative paths)
- Place class properties in the following order:
    - Class methods and properties (methods starting with static)
    - Instance methods and properties
- Braces are required for all control structures (i.e. `if`, `else`, `for`, `do`, `while`), even if the body contains only a single statement. The first statement of a non-empty block must begin on its own line.
- Simple `.map()`, `.filter()` and other similar statements can use one-line shorthands
- Declare all local variables with either const or let. Use const by default, unless a variable needs to be reassigned. The var keyword must not be used.
- Every local variable declaration declares only one variable: declarations such as `let a = 1, b = 2;` are not used.
- Local variables are **not** habitually declared at the start of their containing block or block-like construct. Instead, local variables are declared close to the point they are first used (within reason), to minimize their scope.
- Include a trailing comma whenever there is a line break between the final element and the closing bracket.

  Example:
```javascript
  const values = [
    'first value',
    'second value',
  ];
```
- Do not define or use non-numeric properties on an array (other than length). Use a `Map` (or `Object`) instead.
- Do not use JavaScript getter and setter properties. They are potentially surprising and difficult to reason about, and have limited support in the compiler. Provide ordinary methods instead.
- Arrow functions provide a concise syntax and fix a number of difficulties with `this`. Prefer arrow functions over the `function` keyword, particularly for nested functions.
- `for`-`of` loops should be preferred when possible.


- Use `PascalCase` for class, enums and interface names.
- Use `camelCase` for variable and function names
- Prefer single quotes (`'`) unless escaping. When escaping - use backticks (`).
- Annotate arrays as `foos:Foo[]` instead of `foos:Array<Foo>`
