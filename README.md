# EnSet

# Features

# Example

```js
const enset = new EnSet([{ age: 25 }, { age: 15 }]);
console.log(enset.values());
// [ { age: 25 }, { age: 15 } ]

enset.add({ age: 30 }, { age: 37 });
console.log(enset.values());
// [ { age: 25 }, { age: 15 }, { age: 30 }, { age: 37 } ]

enset.query(v => v.age > 18).update(v => (v.active = true));
console.log(enset.values());
// [ { age: 25, active: true }, { age: 15 }, { age: 30, active: true }, { age: 37, active: true } ]

enset.query(v => v.age < 30).delete();
console.log(enset.values());
// [ { age: 30, active: true }, { age: 37, active: true } ]

enset.delete();  // Do nothing
console.log(enset.values());
// [ { age: 30 } ]

enset.clear();  
console.log(enset.values());
// []
```
