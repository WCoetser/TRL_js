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
if (typeof (Parser.Grammer.TermParser) == "undefined") {

  // Construction and inheritance
  Parser.Grammer.TermParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.TermParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.TermParser.constructor = Parser.Grammer.TermParser;

  // Sub-parsers
  Parser.Grammer.TermParser.thisParser = new Parser.Grammer.TermParser();
  Parser.Grammer.TermParser.listParser =
  new Parser.Grammer.ListParser(Parser.Grammer.TermParser.thisParser, Parser.Tokenization.TokenType.Comma, false);

  // Main parsers
  Parser.Grammer.TermParser.prototype.ParseArgumentList = function (tokens, startLocation) {
    var currentResult = Parser.Grammer.TermParser.listParser.ParseInternal(tokens, startLocation);
    if (!currentResult.GetSucceed()) {
      currentResult.ErrorMessage = "Term must have at least one argument.";
      currentResult.AstResult = null;
    }
    else if (currentResult.GetSucceed()
      && (currentResult.NextParsePosition >= tokens.length
          || tokens[currentResult.NextParsePosition].TokenType != Parser.Tokenization.TokenType.EndTerm)) {
      currentResult.ErrorMessage = "Expected term close bracket";
      currentResult.AstResult = null;
    }
    else {
      currentResult.ErrorMessage = null;
      currentResult.AstResult = new Parser.AbstractSyntaxTree.Terms.AstArgumentList(currentResult.AstResult.ListResult);
      // Skip close bracket
      currentResult.NextParsePosition++;
    }
    return currentResult;
  }

  Parser.Grammer.TermParser.prototype.ParseInternal = function (tokens, startLocation) {
    var result = new Parser.Grammer.ParseResult(tokens, startLocation);
    if (!result.GetSucceed()) return result;
      
    switch (tokens[startLocation].TokenType)
    {
      case Parser.Tokenization.TokenType.NativeFunction:
      {
        result.ErrorMessage = null;
        result.NextParsePosition = startLocation + 1;
        result.AstResult = new Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword(tokens[startLocation]);
        break;
      }
      case Parser.Tokenization.TokenType.Variable:
      {
        result.ErrorMessage = null;
        result.NextParsePosition = startLocation + 1;
        result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstVariable(tokens[startLocation]);
        break;
      }
      case Parser.Tokenization.TokenType.Atom:
      {
        result.ErrorMessage = null;
        result.NextParsePosition = startLocation + 1;
        result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstConstant(tokens[startLocation]);
        break;
      }
      case Parser.Tokenization.TokenType.String:
      {
        result.ErrorMessage = null;
        result.NextParsePosition = startLocation + 1;
        result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstString(tokens[startLocation]);
        break;
      }
      case Parser.Tokenization.TokenType.Number:
      {
        result.ErrorMessage = null;
        result.NextParsePosition = startLocation + 1;
        result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstNumber(tokens[startLocation]);
        break;
      }
      case Parser.Tokenization.TokenType.StartTerm:
      {
        var argumentListResult = this.ParseArgumentList(tokens, startLocation + 1);
        if (!argumentListResult.GetSucceed())
        {
          result = argumentListResult;
        }
        else
        {
          result.ErrorMessage = null;
          result.NextParsePosition = argumentListResult.NextParsePosition;
          result.AstResult = new Parser.AbstractSyntaxTree.Terms.AstTerm(tokens[startLocation], argumentListResult.AstResult);
        }
        break;
      }
      default:
      {
        result.ErrorMessage = "Expected term, variable, number, string or atom.";
        result.NextParsePosition = startLocation;
        result.AstResult = null;
        break;
      }
    }
    return result;
  }
}
