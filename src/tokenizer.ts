import Token from './token'
import {TokenType} from './tokenTypes';

const keywordsMap: [string, TokenType][] = [
  ["and", TokenType.AND],
  ["else", TokenType.ELSE],
  ["false", TokenType.FALSE],
  ["true", TokenType.TRUE],
  ["func", TokenType.FUNC],
  ["endfunc", TokenType.END_FUNC],
  ["repeat", TokenType.REPEAT],
  ["endrepeat", TokenType.END_REPEAT],
  ["if", TokenType.IF],
  ["or", TokenType.OR],
  ["new", TokenType.NEW],
  ["turtle", TokenType.TURTLE],
];

export default class Tokenizer {
  tokens: Token[] = [];
  source: string;
  current = 0;
  start = 0;
  line = 1;
  keywords = new Map(keywordsMap);

  reset() {
    this.current = 0;
    this.start = 0;
    this.line = 1;
    this.tokens = []
  }
  
  scan(source: string) {
    this.reset();

    this.source = source;

    return this.scanLoop();
  }

  private get isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private scanLoop(): Token[] {
    while (!this.isAtEnd) {
      this.start = this.current;

      this.scanNextToken();
    }

    return this.tokens;
  }

  private scanNextToken(): void {
    const char = this.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case "[":
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      case "]":
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case "=":
        this.addToken(TokenType.EQUAL);
        break;
      case ":":
        this.addToken(TokenType.COLON);
        break;
      // involves two tokens matched
      case "!":
        if (this.match("=")) {
          this.addToken(TokenType.STAR);
        }
        break;
      case "<":
        if (this.match("-")) {
          this.addToken(TokenType.STORE_ARROW);
        } else if (this.match("=")) {
          this.addToken(TokenType.LESS_EQUAL);
        } else {
          this.addToken(TokenType.LESS);
        }
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      // deal with white space characters
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case `"`:
        this.string();
        break;
      default:
          if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          throw new TokenizingError(this.line, "Unexpected character.");
        }
        break;
    }

  }

  private string() {
    while (this.peek() != '"' && !this.isAtEnd) {
      if (this.peek() == "\n") {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd) {
      throw new TokenizingError(this.line, "Unterminated string.");
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }
  
  private match(expected: string): boolean {
    if (this.isAtEnd) { return false; }
    if (this.source.charAt(this.current) != expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private advance() {
    const char = this.source.charAt(this.current);

    this.current++;

    return char;
  }

  private addToken(type: TokenType, literal: number | string = "") {
    const text = this.source.substring(this.start, this.current);

    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private isDigit(char: string): boolean {
    return char <= '9' && char >= '1';
  }

  private isAlpha(char: string): boolean {
    return (
      (char <= "z" && char >= "a") ||
      (char <= "Z" && char >= "A") ||
      char === "_" ||
      char === "-"
    );
  }

  private peek(): string {
    if (this.isAtEnd) return "\0";
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }

    return this.source.charAt(this.current + 1);
  }

  private number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const token = this.source.substring(this.start, this.current);

    if (token) {
      this.addToken(TokenType.NUMBER, Number(token));
    } else {
      throw new TokenizingError(this.line, "Unexpected character.");
    }
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = this.keywords.get(text) ?? TokenType.IDENTIFIER;

    this.addToken(type);
  }
}

class TokenizingError extends Error {
  constructor(line: number, message: string) {
    super();

    this.message = `Error on line ${line}: ${message}`;
  }
}
