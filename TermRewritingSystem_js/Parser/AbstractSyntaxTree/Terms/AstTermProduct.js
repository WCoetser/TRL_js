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
if (typeof (Parser.AbstractSyntaxTree.Terms) == "undefined") Parser.AbstractSyntaxTree.Terms = {};
if (typeof (Parser.AbstractSyntaxTree.Terms.AstTermProduct) == "undefined") {

  // Inheritance and construction
  Parser.AbstractSyntaxTree.Terms.AstTermProduct = function (termList) {
    Parser.AbstractSyntaxTree.Terms.AstTermBase.call(this);
    this.TermList = termList;
  }
  Parser.AbstractSyntaxTree.Terms.AstTermProduct.prototype =
    new Parser.AbstractSyntaxTree.Terms.AstTermBase();
  Parser.AbstractSyntaxTree.Terms.AstTermProduct.constructor =
    Parser.AbstractSyntaxTree.Terms.AstTermProduct;

  // Overrides
  Parser.AbstractSyntaxTree.Terms.AstTermProduct.prototype.ToSourceCode = function () {
    var builder = new String();
    builder += "[" + this.TermList[0].ToSourceCode();
    for (var i = 1; i < this.TermList.length; i++) {
      builder += "," + this.TermList[i].ToSourceCode();
    }
    builder += "]";
    return builder;
  }
}
