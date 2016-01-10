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
if (typeof (Parser.Grammer.LimitStatement) == "undefined") {

  // Inheritance and construction
  Parser.Grammer.LimitStatement = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.LimitStatement.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.LimitStatement.constructor = Parser.Grammer.LimitStatement;

  // Sub-parsers ...
  Parser.Grammer.LimitStatement.limitKeyword =
    new Parser.Grammer.KeywordParser(Parser.Tokenization.TokenType.Limit, "Parser.AbstractSyntaxTree.Keywords.AstLimitKeyword");
  Parser.Grammer.LimitStatement.toKeyword =
    new Parser.Grammer.KeywordParser(Parser.Tokenization.TokenType.To, "Parser.AbstractSyntaxTree.Keywords.AstToKeyword");
  Parser.Grammer.LimitStatement.variableListParser =
    new Parser.Grammer.ListParser(new Parser.Grammer.TypeDefinitionVariableParser(), Parser.Tokenization.TokenType.Comma, false);
  Parser.Grammer.LimitStatement.typeNameParser =
    new Parser.Grammer.TypeDefinitionTypeNameParser();

  // Main parser
  Parser.Grammer.LimitStatement.prototype.ParseInternal = function (tokens, startPosition) { 
    var resultLimit = null;
    var resultVariableList = null;
    var resultTo = null;
    var resultTypeName = null;

    resultLimit = Parser.Grammer.LimitStatement.limitKeyword.ParseInternal(tokens, startPosition);
    if (!resultLimit.GetSucceed()) return resultLimit;

    resultVariableList = Parser.Grammer.LimitStatement.variableListParser.ParseInternal(tokens, resultLimit.NextParsePosition);
    if (!resultVariableList.GetSucceed()) return resultVariableList;

    resultTo = Parser.Grammer.LimitStatement.toKeyword.ParseInternal(tokens, resultVariableList.NextParsePosition);
    if (!resultTo.GetSucceed()) return resultTo;

    resultTypeName = Parser.Grammer.LimitStatement.typeNameParser.ParseInternal(tokens, resultTo.NextParsePosition);
    if (!resultTypeName.GetSucceed()) return resultTypeName;

    var parseResult = new Parser.Grammer.ParseResult(tokens, startPosition);
    parseResult.AstResult = new Parser.AbstractSyntaxTree.TypeDefinitions.AstLimitStatement(resultVariableList.AstResult.ListResult, resultTypeName.AstResult);
    parseResult.NextParsePosition = resultTypeName.NextParsePosition;
    return parseResult;
  }
}
