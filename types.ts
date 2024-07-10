export enum TokenType {
  EOF = 'EOF',
  OP_SHORT = 'OP_SHORT',
  OP_LONG = 'OP_LONG',
  ARGUMENT = 'ARGUMENT',
}

export type Token = {
  type: TokenType;
  value: string | null;
};

export type ParsedToken = {
  key?: string;
  value: string | boolean;
};

export type Result<V, E = Error> = {
  ok: true;
  value: V;
  error: null;
} | {
  ok: false;
  value: null;
  error: E;
};
