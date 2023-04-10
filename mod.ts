import { Lexer } from './lexer.ts';
import { Parser } from './parser.ts';

import { ParseResultItem } from './types.ts';

export const parse = (exp: string): [ ParseResultItem[], null ] | [ null, Error ] => {
  const lexer = new Lexer();
  const parser = new Parser();
  try {
    const tokens = lexer.tokenize(exp);
    const result = parser.parse(tokens);

    return [ result, null ];
  } catch (error) {
    return [ null, error ];
  }
};