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
if (typeof (Parser.AbstractSyntaxTree) == "undefined") Parser.AbstractSyntaxTree = {};
if (typeof (Parser.AbstractSyntaxTree.Keywords) == "undefined") Parser.AbstractSyntaxTree.Keywords = {};
if (typeof (Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword) == "undefined") {

  // Inheritance
  Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword = function () {
    Parser.AbstractSyntaxTree.AstBase.call(this);
    this.Keyword = new Parser.Tokenization.Token();
  }
  Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword.prototype =
    new Parser.AbstractSyntaxTree.AstBase();
  Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword.prototype.constructor =
    Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword;

  // Implement IAstKeyword
  Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword.prototype.Keyword =
    new Parser.Tokenization.Token();

  // Overrides
  Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword.prototype.ToSourceCode = function () {
    return Parser.Tokenization.Keywords.Native;
  }

}
