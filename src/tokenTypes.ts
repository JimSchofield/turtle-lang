export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN= "LEFT_PAREN",
  RIGHT_PAREN= "RIGHT_PAREN",
  LEFT_BRACE= "LEFT_BRACE",
  RIGHT_BRACE= "RIGHT_BRACE",
  LEFT_BRACKET= "LEFT_BRACKET",
  RIGHT_BRACKET= "RIGHT_BRACKET",
  COMMA= "COMMA",
  DOT= "DOT",
  MINUS= "MINUS",
  PLUS= "PLUS",
  SLASH= "SLASH",
  STAR= "STAR",
  COLON= "COLON",

  // One or two character tokens.
  NOT_EQUAL= "NOT_EQUAL",
  EQUAL= "EQUAL",
  GREATER= "GREATER",
  GREATER_EQUAL= "GREATER_EQUAL",
  LESS= "LESS",
  LESS_EQUAL= "LESS_EQUAL",
  STORE_ARROW= "STORE_ARROW",

  // Literals.
  IDENTIFIER= "IDENTIFIER",
  STRING= "STRING",
  NUMBER= "NUMBER",

  // Keywords.
  AND= "AND",
  OR= "OR",
  IF= "IF",
  ELSE= "ELSE",
  FALSE= "FALSE",
  TRUE= "TRUE",
  FUNC= "FUNC",
  END_FUNC= "END_FUNC",
  REPEAT= "REPEAT",
  END_REPEAT= "END_REPEAT",
  NEW = "NEW",
  TURTLE = "TURTLE",

  EOF= "EOF",
}
