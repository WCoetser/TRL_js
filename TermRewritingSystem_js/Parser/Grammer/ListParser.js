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
if (typeof (Parser.Grammer.ListParser) == "undefined") {

  Parser.Grammer.ListParser = function (listElementParser, delimiter, allowEndDelimiter) {
    Parser.Grammer.BaseParser.call(this);
    this.elementParser = listElementParser;
    this.delimiter = delimiter;
    this.allowEndDelimiter = allowEndDelimiter;
  }
  Parser.Grammer.ListParser.prototype = new Parser.Grammer.BaseParser();
  Parser.Grammer.ListParser.constructor = Parser.Grammer.ListParser;

  Parser.Grammer.ListParser.prototype.ParseInternal = function (tokens, startPosition) {
    if (startPosition >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Expected at least one parsable element.");
    }
    var firstElement = this.elementParser.ParseInternal(tokens, startPosition);
    var astResult = new Array();
    // First element
    if (!firstElement.GetSucceed()
      || firstElement.NextParsePosition >= tokens.length) {
      return Parser.Grammer.ParseResult.MakeFail(tokens, startPosition, "Failed to parse first element in list");
    }
    else {
      astResult.push(firstElement.AstResult);
    }
    // Parse the rest
    var currentResult = firstElement;
    var lastDelimiterPosition = -1;
    var lastParsePosition = currentResult.NextParsePosition; // keep track of last parse position for improved error handling
    while (currentResult.NextParsePosition < tokens.length
      && tokens[currentResult.NextParsePosition].TokenType == this.delimiter
      && currentResult.GetSucceed()) {
      lastDelimiterPosition = currentResult.NextParsePosition;
      lastParsePosition = lastDelimiterPosition + 1;
      // Skip delimiter
      currentResult = this.elementParser.ParseInternal(tokens, lastParsePosition);
      if (currentResult.GetSucceed()) astResult.push(currentResult.AstResult);
    }

    var parseResultList = new Parser.Grammer.ParseResult(tokens, startPosition);
    if (this.allowEndDelimiter) {
      // Must end in delimiter ... therefore the current element must fail to parse
      if (!currentResult.GetSucceed() && firstElement.GetSucceed()) {
        parseResultList.AstResult = new Parser.AbstractSyntaxTree.AstListResult(astResult);
        // Skip delimiter
        parseResultList.NextParsePosition = lastDelimiterPosition == -1 ? firstElement.NextParsePosition + 1 : lastDelimiterPosition + 1;
        return parseResultList;
      }
      else {
        return Parser.Grammer.ParseResult.MakeFail(tokens, lastParsePosition, "Expected list ending in delimiter.");
      }
    }
    else {
      if (currentResult.GetSucceed()) {
        parseResultList.AstResult = new Parser.AbstractSyntaxTree.AstListResult(astResult),
        parseResultList.NextParsePosition = currentResult.NextParsePosition;
        return parseResultList;
      }
      else {
        return Parser.Grammer.ParseResult.MakeFail(tokens, lastParsePosition, "Expected delimiter seperated list.");
      }
    }
  }
}
