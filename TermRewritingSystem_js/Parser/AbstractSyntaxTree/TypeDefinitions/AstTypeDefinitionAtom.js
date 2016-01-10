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
if (typeof (Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom) == "undefined") {

  // Atom base class
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom = function (sourceToken) {
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTermBase.call(this);
    this.SourceToken = sourceToken;
  }
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.prototype =
    new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTermBase();
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.constructor =
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom;
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.prototype.ToSourceCode = function () {
    return this.SourceToken.GetTokenString();
  }

  // Constant
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant = function (sourceToken) {
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.call(this, sourceToken);
  }
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant.prototype =
    new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom();
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant.constructor =
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant;

  // Number
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber = function (sourceToken) {
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.call(this, sourceToken);
  }
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber.prototype =
    new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom();
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber.constructor =
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber;

  // String
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString = function (sourceToken) {
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom.call(this, sourceToken);
  }
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString.prototype =
    new Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionAtom();
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString.constructor =
    Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString;
  Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString.prototype.ToSourceCode = function () {
    return "\"" + this.SourceToken.GetTokenString() + "\"";
  }
}
