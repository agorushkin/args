export enum TOKEN_TYPE {
  EOF = 'EOF',

  FLAG_SHORT = 'FLAG_SHORT',
  FLAG_LONG = 'FLAG_LONG',

  ARGUMENT = 'ARGUMENT',
}

export interface Token {
  type: TOKEN_TYPE;
  value: string | null;
}

export interface ParseResultItem {
  key?: string;
  value: string | boolean;
}