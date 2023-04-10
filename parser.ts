import { Token, ParseResultItem, TOKEN_TYPE } from './types.ts'

export class Parser {
  #tokens = [] as Token[];
  #cursor = 0;

  #at = () => this.#tokens[this.#cursor];

  #peek = (number = 1) => this.#tokens[this.#cursor + number];

  parse = (tokens: Token[]) => {
    this.#tokens = tokens;
    const result = [] as ParseResultItem[];

    while (this.#cursor < this.#tokens.length) {
      const type = this.#at().type;

      if (type === TOKEN_TYPE.FLAG_SHORT) {
        result.push({ key: this.#at().value as string, value: true });
        this.#cursor++;
        continue;
      }
      
      if (type === TOKEN_TYPE.FLAG_LONG) {
        const value = this.#peek().type === TOKEN_TYPE.ARGUMENT ? this.#peek().value as string : true;
        
        result.push({ key: this.#at().value as string, value });
        this.#cursor += value === true ? 1 : 2;
        continue;
      }
      
      if (type === TOKEN_TYPE.ARGUMENT) {
        result.push({ value: this.#at().value as string });
        this.#cursor++;
        continue;
      }

      this.#cursor++;
    }

    return result;
  }
}