/*
This program is an implementation of the Term Rewriting Language, or TRL. 
In that sense it is also a specification for TRL by giving a reference
implementation. It contains a parser and interpreter.

Copyright (C) 2012 Wikus Coetser, 
Contact information on my blog: http://coffeesmudge.blogspot.com/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if (typeof (Parser) == "undefined") Parser = {};
if (typeof (Parser.Grammer) == "undefined") Parser.Grammer = {};
if (typeof (Parser.Grammer.KeywordParser) == "undefined") {

  // In the C# version "keywordType" is a template argument implementing
  // IAstKeyword
  Parser.Grammer.KeywordParser = function (keywordToken, keywordType) {
    Parser.Grammer.BaseParser.call(this);
    this.keywordToken = keywordToken;
    this.keywordType = keywordType;
  }

  // Inheritance ...
  Parser.Grammer.KeywordParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.KeywordParser.constructor = Parser.Grammer.KeywordParser;

  // Main parse method
  Parser.Grammer.KeywordParser.prototype.ParseInternal = function (tokens, startPosition) {
    if (startPosition >= tokens.length) return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Unexpected end of input.");
    if (tokens[startPosition].TokenType == this.keywordToken) {
      var retResult = new Parser.Grammer.ParseResult(tokens, startPosition);
      retResult.AstResult = eval("new " + this.keywordType + "()");
      retResult.AstResult.Keyword = tokens[startPosition];
      retResult.NextParsePosition = startPosition + 1;
      return retResult;
    }
    else {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected keyword of type " + this.keywordType);
    }
  }
}
