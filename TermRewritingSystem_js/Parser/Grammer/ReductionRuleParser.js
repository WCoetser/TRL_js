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
if (typeof (Parser.Grammer.ReductionRuleParser) == "undefined") {

  // Inheritance & construction
  Parser.Grammer.ReductionRuleParser = function () {
    Parser.Grammer.BaseParser.call(this);
  }
  Parser.Grammer.ReductionRuleParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.ReductionRuleParser.constructor = Parser.Grammer.ReductionRuleParser;

  // Sub-parsers
  Parser.Grammer.ReductionRuleParser.termParser = new Parser.Grammer.TermParser();
  Parser.Grammer.ReductionRuleParser.termProductParser = 
    new Parser.Grammer.TermProductParser();

  // Main parser
  Parser.Grammer.ReductionRuleParser.prototype.ParseInternal = function (tokens, startLocation) {
    var termParser = Parser.Grammer.ReductionRuleParser.termParser;
    var termProductParser = Parser.Grammer.ReductionRuleParser.termProductParser;

    // Head part
    var head = termParser.ParseInternal(tokens, startLocation);
    if (!head.GetSucceed()) head = termProductParser.ParseInternal(tokens, startLocation);
    if (!head.GetSucceed()) {
      head.ErrorMessage = "Expected reduction rule head term or term product: " + head.ErrorMessage;
      return head;
    }
    // Arrow
    if (head.NextParsePosition >= tokens.length
      || tokens[head.NextParsePosition].TokenType != Parser.Tokenization.TokenType.Arrow) {
      var arrowError = new Parser.Grammer.ParseResult(tokens, head.NextParsePosition);
      arrowError.ErrorMessage = "Expected reduction rule arrow symbol";
      return arrowError;
    }
    // Tail part
    var tail = termParser.ParseInternal(tokens, head.NextParsePosition + 1);
    if (!tail.GetSucceed()) {
      tail.ErrorMessage = "Expected reduction rule tail term: " + tail.ErrorMessage;
      return tail;
    }
    var reductionRule = new Parser.Grammer.ParseResult(tokens, startLocation);
    reductionRule.AstResult = new Parser.AbstractSyntaxTree.Terms.AstReductionRule(head.AstResult, tail.AstResult);
    reductionRule.NextParsePosition = tail.NextParsePosition;
    return reductionRule;
  }    
}
