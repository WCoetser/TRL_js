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
if (typeof (Parser.Grammer.TypeDefinitionVariableParser) == "undefined") {

  // Inheritance and construction
  Parser.Grammer.TypeDefinitionVariableParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.TypeDefinitionVariableParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.TypeDefinitionVariableParser.constructor = Parser.Grammer.TypeDefinitionVariableParser;

  // Main parse method
  Parser.Grammer.TypeDefinitionVariableParser.prototype.ParseInternal = function (tokens, startPosition) {
    if (startPosition >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected variable, found end of input.");
    }
    else if (tokens[startPosition].TokenType == Parser.Tokenization.TokenType.Variable) {
      var parseResult = new Parser.Grammer.ParseResult(tokens, startPosition);
      parseResult.AstResult = new Parser.AbstractSyntaxTree.Terms.AstVariable(tokens[startPosition]);
      parseResult.NextParsePosition = startPosition + 1;
      return parseResult;
    }
    else
    {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected variable.");
    }
  }    
}
