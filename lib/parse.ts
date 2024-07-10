import { ParsedToken, Token, TokenType } from '../types.ts';

export const parse = (tokens: Token[]): ParsedToken[] => {
  const at = () => tokens[cursor];
  const rest = () => tokens.slice(cursor);
  const result: ParsedToken[] = [];

  let cursor = 0;

  while (cursor < tokens.length) {
    const type = at().type;

    if (type === TokenType.OP_LONG || type === TokenType.OP_SHORT) {
      const next = rest()?.[1];

      result.push({
        key: at().value as string,
        value: next?.type === TokenType.ARGUMENT ? next.value as string : true,
      });

      cursor += next?.type === TokenType.ARGUMENT ? 2 : 1;
      continue;
    }

    if (type === TokenType.ARGUMENT) {
      result.push({ value: at().value as string });
      cursor++;
      continue;
    }

    cursor++;
  }

  return result;
};
