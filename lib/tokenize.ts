import { Token, TokenType } from '../types.ts';

const OP_CHARS = new Set(
  [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'],
);
const SPACES = new Set([' ', '\t', '\n', '\r']);
const ENDINGS = new Set([' ', '=']);
const QUOTES = new Set(['"', `'`, '`']);
const ESCAPABLE = new Set(['\\', ...QUOTES]);

export const tokenize = (exp: string): Token[] => {
  const tokens: Token[] = [];

  const at = (overhead = 0) => exp[cursor + overhead];
  const advance = (amount = 1) => cursor += amount;
  const consumed = () => cursor >= exp.length;

  let terminated = false;
  let cursor = 0;

  while (cursor <= exp.length) {
    if (consumed()) {
      tokens.push({ type: TokenType.EOF, value: null });
      break;
    }

    // Skipping
    if (SPACES.has(at())) {
      advance();
      continue;
    }

    // Reading long op or op terminator
    if (!terminated && at() === '-' && at(1) === '-') {
      advance(2);
      let value = '';

      if (ENDINGS.has(at())) {
        tokens.push({ type: TokenType.ARGUMENT, value: '--' });
        terminated = true;
        continue;
      }

      while (!ENDINGS.has(at())) {
        if (consumed()) break;

        if (!OP_CHARS.has(at())) {
          throw new SyntaxError(
            `Used non-alphanumeric character on long option at ${cursor}`,
          );
        }

        value += at();
        advance();
      }

      tokens.push({ type: TokenType.OP_LONG, value });
      if (at() === '=') advance();
      continue;
    }

    // Reading short op
    if (!terminated && at() === '-') {
      advance();

      while (!ENDINGS.has(at())) {
        if (cursor >= exp.length) break;

        if (!OP_CHARS.has(at()) && at() || at() === '-') {
          throw new SyntaxError(
            `Used non-alphanumeric character on short option at ${cursor}`,
          );
        }

        tokens.push({ type: TokenType.OP_SHORT, value: at() });
        advance();
      }

      continue;
    }

    // Reading arguments
    let arg = '';
    let style = '';
    let escaped = false;
    while (true) {
      if (consumed()) {
        if (style.length) throw new SyntaxError('Unterminated string');
        break;
      }

      if (escaped) {
        if (ESCAPABLE.has(at())) arg += at();

        escaped = false;
        advance();
        continue;
      }

      if (at() == '\\') {
        escaped = true;
        advance();
        continue;
      }

      if (at() === ' ') {
        if (!style.length) {
          advance();
          break;
        }

        arg += at();
        advance();
        continue;
      }

      if (style.length === 0 && QUOTES.has(at())) {
        style = at();
        advance();
        continue;
      }

      if (style.length && at() === style) {
        style = '';
        advance();
        continue;
      }

      arg += at();
      advance();
    }

    if (arg === '--') terminated = true;
    tokens.push({ type: TokenType.ARGUMENT, value: arg });
  }

  return tokens;
};
