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
if (typeof (Parser.Grammer.TermProductParser) == "undefined") {

  // Inheritance and construction
  Parser.Grammer.TermProductParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.TermProductParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.TermProductParser.constructor = Parser.Grammer.TermProductParser;
  
  // Sub-parsers
  Parser.Grammer.TermProductParser.parser = new Parser.Grammer.TermParser();
  Parser.Grammer.TermProductParser.listParser =
    new Parser.Grammer.ListParser(Parser.Grammer.TermProductParser.parser, Parser.Tokenization.TokenType.Comma, false);

  // Main parse method
  Parser.Grammer.TermProductParser.prototype.ParseInternal = function (tokens, startPosition) {
    var result = new Parser.Grammer.ParseResult(tokens, startPosition);
    if (startPosition >= tokens.length) {
      result.ErrorMessage = "Unexpected end of input, tried to parse term product.";
      return result;
    }
    if (tokens[startPosition].TokenType != Parser.Tokenization.TokenType.OpenTermProduct) {
      result.ErrorMessage = "Expected square bracket for term product.";
      return result;
    }

    var productList = Parser.Grammer.TermProductParser.listParser.ParseInternal(tokens, startPosition + 1);

    if (!productList.GetSucceed()) {
      result.ErrorMessage = "Failed to parse term product.";
      return result;
    }

    var termList = productList.AstResult.ListResult;

    if (productList.NextParsePosition >= tokens.length
      && tokens[productList.NextParsePosition].TokenType != TokenType.CloseTermProduct) {
      result.ErrorMessage = "Expected term product close bracket \"]\".";
    }
    else if (termList.Count <= 1) {
      result.ErrorMessage = "A term product must contain at least two terms.";
    }
    else {
      result.NextParsePosition = productList.NextParsePosition + 1;
      result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstTermProduct(termList);
    }
    return result;
  }
}
