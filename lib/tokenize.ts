import { Token, TokenType } from '../types.ts';

export const tokenize = (exp: string): Token[] => {
  const at = () => exp[cursor];
  const rest = () => exp.slice(cursor);
  const tokens: Token[] = [];

  let terminated = false;
  let cursor = 0;

  while (cursor <= exp.length) {
    if (cursor >= exp.length) {
      tokens.push({ type: TokenType.EOF, value: null });
      break;
    }

    if (/\s/.test(at())) {
      cursor++;
      continue;
    }

    if (!terminated && /^\-[a-zA-Z0-9]+/.test(rest())) {
      cursor++;

      while (/[^\s=]/.test(at())) {
        if (cursor >= exp.length) break;

        if (!/[a-zA-Z0-9]/.test(at())) {
          throw new SyntaxError(
            `Used non-alphanumeric character on short option at ${cursor}`,
          );
        }

        tokens.push({ type: TokenType.OP_SHORT, value: at() });
        cursor++;
      }

      if (at() === '=') cursor++;
      continue;
    }

    if (!terminated && /^\-{2}[\-a-zA-Z0-9]+/.test(rest())) {
      cursor += 2;
      let flag = '';

      while (/[^\s=]/.test(at())) {
        if (cursor >= exp.length) break;

        if (!/[\-a-zA-Z0-9]/.test(at())) {
          throw new SyntaxError(
            `Used non-alphanumeric character on long option at ${cursor}`,
          );
        }

        flag += at();
        cursor++;
      }

      tokens.push({ type: TokenType.OP_LONG, value: flag });
      if (at() === '=') cursor++;
      continue;
    }

    let arg = '';
    let style = '';
    let escaped = false;
    while (true) {
      if (cursor >= exp.length) {
        if (style.length) throw new SyntaxError('Unterminated string');
        break;
      }

      if (escaped) {
        if (/\\/.test(at())) arg += at();
        else if (/\s/.test(at())) arg += at();
        else if (/["'`]/.test(at())) arg += at();

        escaped = false;
        cursor++;
        continue;
      }

      if (/\\/.test(at())) {
        escaped = true;
        cursor++;
        continue;
      }

      if (/\s/.test(at())) {
        if (!style.length) {
          cursor++;
          break;
        } else {
          arg += at();
          cursor++;
          continue;
        }
      }

      if (style.length === 0 && /["'`]/.test(at())) {
        style = at();
        cursor++;
        continue;
      }

      if (style.length && at() === style) {
        style = '';
        cursor++;
        continue;
      }

      arg += at();
      cursor++;
    }

    if (arg === '--') terminated = true;
    tokens.push({ type: TokenType.ARGUMENT, value: arg });
  }

  return tokens;
};
