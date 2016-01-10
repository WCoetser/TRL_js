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
if (typeof (Parser.Grammer.TypeDefinitionParser) == "undefined") {

  // Inheritance & Construction
  Parser.Grammer.TypeDefinitionParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.TypeDefinitionParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.TypeDefinitionParser.constructor =
    Parser.Grammer.TypeDefinitionParser;

  // Sub-parsers
  Parser.Grammer.TypeDefinitionParser.typeDefTermParser =
    new Parser.Grammer.TypeDefinitionTermParser();
  Parser.Grammer.TypeDefinitionParser.listParser =
    new Parser.Grammer.ListParser(Parser.Grammer.TypeDefinitionParser.typeDefTermParser, Parser.Tokenization.TokenType.Pipe, false);
  Parser.Grammer.TypeDefinitionParser.typeKeyword =
    new Parser.Grammer.KeywordParser(Parser.Tokenization.TokenType.TypeDecleration, "Parser.AbstractSyntaxTree.Keywords.AstTypeKeyword");
  Parser.Grammer.TypeDefinitionParser.typeNameParser =
    new Parser.Grammer.TypeDefinitionTypeNameParser();

  // Main parse method
  Parser.Grammer.TypeDefinitionParser.prototype.ParseInternal = function (tokens, startPosition) { 
    // Check length      
    if (startPosition + 5 > tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected type definition, encountered end of input.");
    }

    // Check for "type"
    var currentPosition = startPosition;
    var keywordResult = Parser.Grammer.TypeDefinitionParser.typeKeyword.ParseInternal(tokens, currentPosition);
    if (keywordResult.GetSucceed()) currentPosition = keywordResult.NextParsePosition;
    else return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected 'type' keyword.");

    // Get the type name
    var typeNameResult = Parser.Grammer.TypeDefinitionParser.typeNameParser.ParseInternal(tokens, currentPosition);
    if (typeNameResult.GetSucceed()) currentPosition = typeNameResult.NextParsePosition;
    else return Parser.Grammer.ParseResult.MakeFail(tokens, typeNameResult.StartPosition, "Expected type name.");

    // Check for '='
    if (tokens[currentPosition].TokenType == Parser.Tokenization.TokenType.Equals) currentPosition++;
    else return Parser.Grammer.ParseResult.MakeFail(tokens, currentPosition, "Expected '=' as part of type decleration.");

    // Parse pipe seperated list
    var resultInner = Parser.Grammer.TypeDefinitionParser.listParser.ParseInternal(tokens, currentPosition);

    if (!resultInner.GetSucceed()) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, currentPosition, "Expected type definition.");
    }
    else {
      var parseResult = new Parser.Grammer.ParseResult(tokens, startPosition);
      parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionStatement(typeNameResult.AstResult, resultInner.AstResult.ListResult);
      parseResult.NextParsePosition = resultInner.NextParsePosition;
      return parseResult;
    }
  }
}
