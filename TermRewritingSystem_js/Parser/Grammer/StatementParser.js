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
if (typeof (Parser.Grammer.StatementParser) == "undefined") {

  // Inheritance and construction
  Parser.Grammer.StatementParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.StatementParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.StatementParser.constructor = Parser.Grammer.StatementParser;

  // Sub-parsers
  // NB: Sequence important here: Redexes must be parsed before terms.
  Parser.Grammer.StatementParser.StatementTypes = [
    new Parser.Grammer.ReductionRuleParser(),
    new Parser.Grammer.TermParser(),
    new Parser.Grammer.TypeDefinitionParser(),
    new Parser.Grammer.LimitStatement()
  ];

  Parser.Grammer.StatementParser.prototype.ParseInternal = function (tokens, startPosition) {
    var StatementTypes = Parser.Grammer.StatementParser.StatementTypes;
    for (var key in StatementTypes) {
      var rule = StatementTypes[key];
      var currentResult = rule.ParseInternal(tokens, startPosition);
      if (currentResult.GetSucceed()) {
        return currentResult;
      }
    }
    return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected term, reduction rule, type definition or limit statement. Followed by a semicolon.");
  }
}
