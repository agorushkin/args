import { TOKEN_TYPE, Token } from './types.ts';

export class Lexer {
  #stream = '';
  #cursor = 0;

  #at = () => this.#stream[this.#cursor];

  #peek = (number = 1) => this.#stream[this.#cursor + number];

  #rest = () => this.#stream.slice(this.#cursor);

  tokenize = (exp: string) => {
    const tokens = [] as Token[];

    this.#stream = exp;

    while (this.#cursor < this.#stream.length) {
      if (this.#cursor + 1 === this.#stream.length) {
        tokens.push({ type: TOKEN_TYPE.EOF, value: null });
        break;
      }

      // Whitespace
      if (/^[\s\n=]/.test(this.#rest())) {
        this.#cursor++;
        continue;
      }

      // Short Flag
      if (/^\-[a-z]+\s/.test(this.#rest())) {
        const flag = this.#rest().match(/^\-[a-z]+/)![0].slice(1);
        flag.split('').map((flag) => tokens.push({ type: TOKEN_TYPE.FLAG_SHORT, value: flag }));
        this.#cursor += 1 + flag.length;
        continue;
      }

      // Long Flag
      if (/^\-{2}[a-z]+[\s\t\n=]/.test(this.#rest())) {
        const flag = this.#rest().match(/^\-\-[a-z]+/)![0].slice(2);
        tokens.push({ type: TOKEN_TYPE.FLAG_LONG, value: flag });
        this.#cursor += flag.length + 2;
        continue;
      }

      // Argument
      if (/^[^\s\t\n"=]+/.test(this.#rest())) {
        const arg = this.#rest().match(/^[^\s\t\n"=]+/)![0];

        console.log(arg);

        tokens.push({ type: TOKEN_TYPE.ARGUMENT, value: arg });
        this.#cursor += arg.length;
        continue;
      }

      // Quoted Argument
      if (/^\"/.test(this.#rest())) {
        let arg = '';
        this.#cursor++;


        while (this.#at() !== '"' || this.#peek(-1) === '\\') {
          arg += this.#at();
          this.#cursor++;

          if (this.#cursor === this.#stream.length) {
            throw new Error('Unterminated string');
          }
        }

        tokens.push({ type: TOKEN_TYPE.ARGUMENT, value: arg });
        this.#cursor++;
        continue;
      }

      this.#cursor++;
    }

    return tokens;
  }
}