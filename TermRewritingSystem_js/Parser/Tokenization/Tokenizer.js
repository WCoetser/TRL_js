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
if (typeof (Parser.Tokenization) == "undefined") Parser.Tokenization = {};
if (typeof (Parser.Tokenization.Tokenizer) == "undefined") {

  Parser.Tokenization.Tokenizer = function () { }

  Parser.Tokenization.Tokenizer.prototype.Tokenize = function (strIn) {
    var sourceString = strIn;
    var result = new Parser.Tokenization.TokenizationResult();
    result.SourceString = sourceString;
    if (!sourceString || (sourceString.match(/^[\s]*$/) != null)) {
      result.ErrorMessage = "Input string is empty";
      result.Tokens = null;
      result.Succeed = false;
      return result;
    }
    var nextParsePosition = 0;
    var matchedType = Parser.Tokenization.TokenType.None;
    result.Tokens = new Array();

    var tokenTypeMappings = Parser.Tokenization.ParseRegexes.GetRegexToTokenTypeMappings();
    do {
      var match = null;
      matchedType = Parser.Tokenization.TokenType.None;
      // Sequence is important to the matches to avoid confusing a term with an atom
      for (key in tokenTypeMappings) {
        var pair = tokenTypeMappings[key];
        if ((match = sourceString.match(pair[0])) && match.index == 0) {
          matchedType = pair[1];
          break;
        }
      }
      if (matchedType != Parser.Tokenization.TokenType.None) {
        // Comments are removed here
        if (matchedType != Parser.Tokenization.TokenType.SingleLineComment) {
          var newToken = new Parser.Tokenization.Token();
          newToken.From = nextParsePosition + sourceString.indexOf(match[1], match.index);
          newToken.Length = match[1].length;
          newToken.SourceString = strIn;
          newToken.TokenType = matchedType;
          result.Tokens.push(newToken);
        }
        nextParsePosition += match[0].length;
        sourceString = sourceString.substring(match[0].length, sourceString.length);
      }
    } while (nextParsePosition < strIn.length && matchedType != Parser.Tokenization.TokenType.None);
    result.Succeed = nextParsePosition == strIn.length;
    if (!result.Succeed) result.ErrorMessage = "Unexpected characters at position " + nextParsePosition;
    return result;
  }
}
