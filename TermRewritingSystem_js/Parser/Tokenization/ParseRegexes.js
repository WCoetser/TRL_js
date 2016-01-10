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

if (typeof(Parser) == "undefined") Parser = {};
if (typeof(Parser.Tokenization) == "undefined") Parser.Tokenization = {};
if (typeof (Parser.Tokenization.ParseRegexes) == "undefined") {

  Parser.Tokenization.ParseRegexes = {
    LookAheadConstAtomFormat: /[\s]*([a-zA-Z_]\w*)[\s]*/,
    LookAheadStringFormat: /[\s]*"([^"]*)"[\s]*/,
    LookAheadNumberFormat: /[\s]*([+-]?[0-9]+[\.]?[0-9]*)[\s]*/,
    LookAheadOpenTerm: /[\s]*([a-zA-Z_]\w*)[\s]*[(][\s]*/,
    LookAheadComma: /[\s]*(,)[\s]*/,
    LookAheadCloseTerm: /[\s]*([)])[\s]*/,
    LookAheadArrow: /[\s]*(=>)[\s]*/,
    LookAheadSemicolon: /[\s]*(;)[\s]*/,
    LookAheadSingleLineComment: /[\s]*\/\/[^\r\n]*[\s]*/,
    LookAheadOpenTermProduct: /[\s]*(\[)[\s]*/,
    LookAheadCloseTermProduct: /[\s]*(\])[\s]*/,
    LookAheadEquals: /[\s]*(=)[\s]*/,
    LookAheadPipe: /[\s]*(\|)[\s]*/,
    
    // Types & Variables
    LookAheadVariableFormat: /[\s]*\:(\w+)[\s]*/,
    LookAheadTypeName: /[\s]*\$(\w+)[\s]*/,

    // Keywords
    LookAheadType: new RegExp("[\\s]*(" + Parser.Tokenization.Keywords.Type + ")[\\s]*"),
    LookAheadNative: new RegExp("[\\s]*(" + Parser.Tokenization.Keywords.Native + ")[\\s]*"),
    LookAheadLimit: new RegExp("[\\s]*(" + Parser.Tokenization.Keywords.Limit + ")[\\s]*"),
    LookAheadTo: new RegExp("[\\s]*(" + Parser.Tokenization.Keywords.To + ")[\\s]*")
  }

  Parser.Tokenization.ParseRegexes.GetRegexToTokenTypeMappings = function() {
    // NB: Sequence is important here not to confuse atom and term start, "type" and atom constant.
    // NB: Arrow must come before Equals
    // NB: Keywords before constants
    return [
      // Keywords
      [Parser.Tokenization.ParseRegexes.LookAheadNative, Parser.Tokenization.TokenType.NativeFunction],
      [Parser.Tokenization.ParseRegexes.LookAheadType, Parser.Tokenization.TokenType.TypeDecleration],
      [Parser.Tokenization.ParseRegexes.LookAheadLimit, Parser.Tokenization.TokenType.Limit],
      [Parser.Tokenization.ParseRegexes.LookAheadTo, Parser.Tokenization.TokenType.To],
      // The rest
      [Parser.Tokenization.ParseRegexes.LookAheadTypeName, Parser.Tokenization.TokenType.TypeName],
      [Parser.Tokenization.ParseRegexes.LookAheadPipe, Parser.Tokenization.TokenType.Pipe],
      [Parser.Tokenization.ParseRegexes.LookAheadVariableFormat, Parser.Tokenization.TokenType.Variable],
      [Parser.Tokenization.ParseRegexes.LookAheadOpenTerm, Parser.Tokenization.TokenType.StartTerm],
      [Parser.Tokenization.ParseRegexes.LookAheadConstAtomFormat, Parser.Tokenization.TokenType.Atom],
      [Parser.Tokenization.ParseRegexes.LookAheadStringFormat, Parser.Tokenization.TokenType.String],
      [Parser.Tokenization.ParseRegexes.LookAheadNumberFormat, Parser.Tokenization.TokenType.Number],
      [Parser.Tokenization.ParseRegexes.LookAheadCloseTerm, Parser.Tokenization.TokenType.EndTerm],
      [Parser.Tokenization.ParseRegexes.LookAheadComma, Parser.Tokenization.TokenType.Comma],
      [Parser.Tokenization.ParseRegexes.LookAheadArrow, Parser.Tokenization.TokenType.Arrow],
      [Parser.Tokenization.ParseRegexes.LookAheadEquals, Parser.Tokenization.TokenType.Equals],
      [Parser.Tokenization.ParseRegexes.LookAheadSemicolon, Parser.Tokenization.TokenType.Semicolon],
      [Parser.Tokenization.ParseRegexes.LookAheadSingleLineComment, Parser.Tokenization.TokenType.SingleLineComment],
      [Parser.Tokenization.ParseRegexes.LookAheadOpenTermProduct, Parser.Tokenization.TokenType.OpenTermProduct],
      [Parser.Tokenization.ParseRegexes.LookAheadCloseTermProduct, Parser.Tokenization.TokenType.CloseTermProduct]
    ];
  }

}
