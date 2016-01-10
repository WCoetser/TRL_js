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
if (typeof (Parser.Tokenization.Token) == "undefined") {

  Parser.Tokenization.Token = function () {
    this.From = new Number();
    this.Length = new Number();
    this.SourceString = new String();
    this.TokenType = Parser.Tokenization.TokenType.None;
  }

  Parser.Tokenization.Token.prototype.From = new Number();
  Parser.Tokenization.Token.prototype.Length = new Number();
  Parser.Tokenization.Token.prototype.SourceString = new String();
  Parser.Tokenization.Token.prototype.TokenType = Parser.Tokenization.TokenType.None;

  Parser.Tokenization.Token.prototype.GetTokenString = function () {
    return this.SourceString.substring(this.From, this.From + this.Length);
  };

  Parser.Tokenization.Token.prototype.ToString = function () {
    return this.TokenType + ", from " + this.From + ", length " + this.Length + ", " + this.GetTokenString();
  }
}
