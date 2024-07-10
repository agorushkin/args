🔧 **A small cmd line arg parser**

## 📦 Installation & Usage

### Exported members

```ts
parse(exp: string): Result;
```

### Example

```ts
import { parse } from 'x/flags';

const args = parse('command --key=value -ab');

console.log(args);
// {
//   ok: true,
//   value: [
//     { value: 'command' },
//     { key: 'key', value: 'value' },
//     { key: 'a', value: true },
//     { key: 'b', value: true },
//   ],
//   error: null
// }
```

## 📝 Specification

### I mostly tried to stick to the [GNU implimentation of the POSIX standard](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)

- `--` argument is treated as a separator between options and positional
  arguments. All arguments after `--` are treated as positional arguments and
  aren't parsed as options.

- Short form options can be combined, e.g. `-abc` is equivalent to `-a -b -c`.

- Long form options with values can either be separated by unlimited space
  chracaters, or one equal sign. E.g. `--key value` or `--key=value`. If more
  than one equal sign is present, the first one is used as the separator, and
  second as part of the value.

- Options can appear in any order and be supplied multiple times.

### While I did my best to stick to the standard, there is a notable difference:

- When using a short form option combined with a value `-o foo`, given the
  no-config style of the library, you are unable to use the shorthand for the
  value `-ofoo`, as the parser is unaware of short form option declarations.

## 🛠️ Contribution

Feel free to open an issue or a pull request if you have any suggestions or
changes you'd like to see. I would very much appreacite it. Leaving a star is
also a great way to show your support.

Made with ❤️ by [agorushkin](https://github.com/agorushkin)
