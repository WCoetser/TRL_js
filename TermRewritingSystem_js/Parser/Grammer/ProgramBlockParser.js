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
if (typeof (Parser.Grammer.ProgramBlockParser) == "undefined") {

  // Inheritance & construction
  Parser.Grammer.ProgramBlockParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.ProgramBlockParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.ProgramBlockParser.constructor =
    Parser.Grammer.ProgramBlockParser;

  // Sub-parsers
  Parser.Grammer.ProgramBlockParser.statementParser =
    new Parser.Grammer.StatementParser();
  Parser.Grammer.ProgramBlockParser.listParser =
    new Parser.Grammer.ListParser(Parser.Grammer.ProgramBlockParser.statementParser, Parser.Tokenization.TokenType.Semicolon, true);

  // Main parser
  Parser.Grammer.ProgramBlockParser.prototype.ParseInternal = function (tokens, startLocation) {
    if (tokens.length == 0) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, 0, "Input is empty.");
    }

    // Semi-colon seperated list of terms and reduction rules
    var statementListResult = Parser.Grammer.ProgramBlockParser.listParser.ParseInternal(tokens, startLocation);
    if (statementListResult.GetSucceed()
      && statementListResult.NextParsePosition == tokens.length) {
      var parseResult = new Parser.Grammer.ParseResult(tokens, startLocation);
      parseResult.AstResult = new Parser.AbstractSyntaxTree.AstProgramBlock(statementListResult.AstResult.ListResult);
      parseResult.NextParsePosition = statementListResult.NextParsePosition;
      return parseResult;
    }
    else return Parser.Grammer.ParseResult.MakeFail(tokens, statementListResult.StartPosition, "Expected statement, reduction rule, type definition or limit.");
  }
}
