🚩 **A small cmd line flag parser**

📦 Installation & Usage
```ts
import { parse } from 'flag-parser';

const args = parse('command --key=value -ab');

console.log(args);
// [
//   { value: 'command' },
//   { key: 'key', value: 'value' },
//   { key: 'a', value: true },
//   { key: 'b', value: true },
// ]
```