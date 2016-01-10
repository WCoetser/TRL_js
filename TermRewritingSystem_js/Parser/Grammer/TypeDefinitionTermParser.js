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
if (typeof (Parser.Grammer.TypeDefinitionTermParser) == "undefined") {
  
  // Inheritance & construction
  Parser.Grammer.TypeDefinitionTermParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.TypeDefinitionTermParser.prototype =
    new Parser.Grammer.BaseParser();
  Parser.Grammer.TypeDefinitionTermParser.constructor =
    Parser.Grammer.TypeDefinitionTermParser;

  // Sub-parsers
  Parser.Grammer.TypeDefinitionTermParser.nameParser = new Parser.Grammer.TypeDefinitionTypeNameParser();
  Parser.Grammer.TypeDefinitionTermParser.listParser =
    new Parser.Grammer.ListParser(Parser.Grammer.TypeDefinitionTermParser.nameParser, Parser.Tokenization.TokenType.Comma, false);

  // Main parsers start
  Parser.Grammer.TypeDefinitionTermParser.prototype.ParseInternal = function (tokens, startPosition) {
    if (startPosition >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Found end of input, expected type definition term.");
    }

    var parseResult = new Parser.Grammer.ParseResult(tokens, startPosition);
    switch (tokens[startPosition].TokenType) {
      case Parser.Tokenization.TokenType.TypeName:
        {
          parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionName(tokens[startPosition]),
          parseResult.NextParsePosition = startPosition + 1;
          return parseResult;
        }
      case Parser.Tokenization.TokenType.Number:
        {
          parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber(tokens[startPosition]);
          parseResult.NextParsePosition = startPosition + 1;
          return parseResult;
        }
      case Parser.Tokenization.TokenType.String:
        {
          parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString(tokens[startPosition]);
          parseResult.NextParsePosition = startPosition + 1;
          return parseResult;
        }
      case Parser.Tokenization.TokenType.Atom:
        {
          parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant(tokens[startPosition]);
          parseResult.NextParsePosition = startPosition + 1;
          return parseResult;
        }
      case Parser.Tokenization.TokenType.Variable:
        {
          parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionVariable(tokens[startPosition]);
          parseResult.NextParsePosition = startPosition + 1;
          return parseResult;
        }
      case Parser.Tokenization.TokenType.StartTerm:
        {
          return this.ParseTypeDefinitionTermWithArgs(tokens, startPosition);
        }
      default: 
        {
          return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected type definition term.");
        }
    }
  }

  Parser.Grammer.TypeDefinitionTermParser.prototype.ParseTypeDefinitionTermWithArgs = function (tokens, startPosition) {
    // Check length
    if (startPosition + 2 >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Unexpected end of input, expected type decleration term");
    }

    // Check token name
    var termName = new Parser.Tokenization.Token();
    if (tokens[startPosition].TokenType != Parser.Tokenization.TokenType.StartTerm)
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected term name.");
    else termName = tokens[startPosition];

    var listResult = Parser.Grammer.TypeDefinitionTermParser.listParser.ParseInternal(tokens, startPosition + 1);

    if (!listResult.GetSucceed()) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition + 1, "Expected term definition name list");
    }
    else if (listResult.NextParsePosition >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, listResult.NextParsePosition, "Unexpected end of input, was expecting typpe decleration term.");
    }
    else if (tokens[listResult.NextParsePosition].TokenType != Parser.Tokenization.TokenType.EndTerm) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, listResult.NextParsePosition, "Expected term closing bracket in type decleration.");
    }
    else {
      var parseResult = new Parser.Grammer.ParseResult(tokens, startPosition);
      parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm(termName, listResult.AstResult.ListResult);
      parseResult.NextParsePosition = listResult.NextParsePosition + 1;
      return parseResult;
    }
  }

}
