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
if (typeof (Parser.AbstractSyntaxTree.TypeDefinitions) == "undefined") Parser.AbstractSyntaxTree.TypeDefinitions = {};
if (typeof (Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm) == "undefined") {

  // Atom base class
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm = function (termName, subTypeArgumentNames) {
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTermBase.call(this);
    this.TermName = termName;
    this.SubTypeArgumentNames = subTypeArgumentNames;
  }
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm.prototype =
    new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTermBase();
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm.constructor =
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm;
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm.prototype.ToSourceCode = function () {
    var builder = this.TermName.GetTokenString() + "(" + this.SubTypeArgumentNames[0].ToSourceCode();
    for (var i = 1; i < this.SubTypeArgumentNames.length; i++) {
      builder += this.SubTypeArgumentNames[i].ToSourceCode();
    }
    builder += ")";
    return builder;
  }
}
