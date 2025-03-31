import { tokenize } from './lib/tokenize.ts';
import { parse } from './lib/parse.ts';

import { ParsedToken, Result } from './types.ts';

const parser = (
  exp: string,
): Result<ParsedToken[]> => {
  try {
    const tokens = tokenize(exp);
    const value = parse(tokens);

    return { ok: true, value, error: null };
  } catch (error) {
    return { ok: false, value: null, error: error as Error };
  }
};

export { parser as parse };
