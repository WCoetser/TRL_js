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

if (typeof (Interpreter) == "undefined") Interpreter = {};
if (typeof (Interpreter.Entities) == "undefined") Interpreter.Entities = {};
if (typeof (Interpreter.Entities.TypeDefinitions) == "undefined") Interpreter.Entities.TypeDefinitions = {};
if (typeof (Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) == "undefined") {

  var nsTrsTypeDefinition = Interpreter.Entities.TypeDefinitions;

  // Inheritance & Construction
  nsTrsTypeDefinition.TrsTypeDefinition = function (name,acceptedTerms,astIn) {
    Interpreter.Entities.TrsStatement.call(this);
    this.AstSource = astIn;
    this.AcceptedTerms = acceptedTerms;
    this.Name = name;
  }
  nsTrsTypeDefinition.TrsTypeDefinition.prototype =
    new Interpreter.Entities.TrsStatement();
  nsTrsTypeDefinition.TrsTypeDefinition.constructor =
    nsTrsTypeDefinition.TrsTypeDefinition;

  // Prototype
  nsTrsTypeDefinition.TrsTypeDefinition.prototype.CreateCopy = function () {
    var newAcceptedTerms = new Array();
    for (var i = 0; i < this.AcceptedTerms.length; i++) {
      newAcceptedTerms.push(this.AcceptedTerms[i].CreateCopy());
    }
    return new nsTrsTypeDefinition.TrsTypeDefinition(this.Name, newAcceptedTerms, this.AstSource);
  }
  nsTrsTypeDefinition.TrsTypeDefinition.prototype.ToSourceCode = function () {
    var builder = new String();
    builder += Parser.Tokenization.Keywords.Type;
    builder += " ";
    builder += this.Name.ToSourceCode();
    builder += " = ";
    builder += this.AcceptedTerms[0].ToSourceCode();
    for (var i = 1; i < this.AcceptedTerms.length; i++) {
      builder += " | ";
      builder += this.AcceptedTerms[i].ToSourceCode();
    }
    return builder;
  }
  nsTrsTypeDefinition.TrsTypeDefinition.prototype.GetReferencedTypeNames = function () {
    var retTypeNames = new Array();
    for (var i = 0; i < this.AcceptedTerms.length; i++) {
      var subTypes = this.AcceptedTerms[i].GetReferencedTypeNames();
      for (var j = 0; j < subTypes.length; j++) {
        retTypeNames.push(subTypes[j]);
      }
    }
    return retTypeNames;
  }
}
