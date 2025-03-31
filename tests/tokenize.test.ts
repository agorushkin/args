import { tokenize } from '../lib/tokenize.ts';

import { Token, TokenType } from '../types.ts';

const assert = (expected: Token[], actual: Token[]) => {
  for (let i = 0; i < expected.length; i++) {
    if (
      expected[i].type !== actual[i].type ||
      expected[i].value !== actual[i].value
    ) {
      const message = `Expected ${JSON.stringify(expected[i])}, but got ${
        JSON.stringify(actual[i])
      }`;
      throw new Error(message);
    }
  }
};

Deno.test('command --key=value -ab', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.OP_LONG, value: 'key' },
    { type: TokenType.ARGUMENT, value: 'value' },
    { type: TokenType.OP_SHORT, value: 'a' },
    { type: TokenType.OP_SHORT, value: 'b' },
  ];

  const actual = tokenize('command --key=value -ab');
  assert(expected, actual);
});

Deno.test('command -a -b --key=value', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.OP_SHORT, value: 'a' },
    { type: TokenType.OP_SHORT, value: 'b' },
    { type: TokenType.OP_LONG, value: 'key' },
    { type: TokenType.ARGUMENT, value: 'value' },
  ];

  const actual = tokenize('command -a -b --key=value');
  assert(expected, actual);
});

Deno.test('command --long-option', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.OP_LONG, value: 'long-option' },
  ];

  const actual = tokenize('command --long-option');
  assert(expected, actual);
});

Deno.test('command -a', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.OP_SHORT, value: 'a' },
  ];

  const actual = tokenize('command -a');
  assert(expected, actual);
});

Deno.test('command value-only', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.ARGUMENT, value: 'value-only' },
  ];

  const actual = tokenize('command value-only');
  assert(expected, actual);
});

Deno.test('command with equal sign in value', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.OP_LONG, value: 'key' },
    { type: TokenType.ARGUMENT, value: 'value=with=equals' },
  ];

  const actual = tokenize('command --key=value=with=equals');
  assert(expected, actual);
});

Deno.test('command and value with spaces', () => {
  const expected: Token[] = [
    { type: TokenType.ARGUMENT, value: 'command' },
    { type: TokenType.ARGUMENT, value: 'value with spaces' },
  ];

  const actual = tokenize('command "value with spaces"');
  assert(expected, actual);
});
