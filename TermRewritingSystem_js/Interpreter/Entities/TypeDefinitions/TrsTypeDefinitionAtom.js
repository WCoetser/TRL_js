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
if (typeof (Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionAtom) == "undefined") {

  var nsTrsTypeDefinitionAtom = Interpreter.Entities.TypeDefinitions;

  // Inheritance & Construction
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom = function (atomValue, source) {
    Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase.call(this);
    this.AstSource = source;
    this.AtomValue = atomValue;
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase();
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.constructor =
    new nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom;

  // Overrides
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype.CreateCopy = function () {
    return this;
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype.GetReferencedTypeNames = function () {
    return new Array();
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype.CreateCopyAndReplaceSubTermRefEquals =
    function (termToReplace, replacementTerm) {
      if (this == termToReplace) return replacementTerm;
      else return this.CreateCopy();
    }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype.GetAllAtoms = function () {
    return [this];
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.prototype.GetAllVariables = function () {
    return new Array();
  }

  ////////////// CONSTANTS //////////////

  // Construction
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionConstant = function (constName, source) {
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.call(this, constName, source);
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionConstant.prototype =
    new nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom();
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionConstant.constructor =
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionConstant;

  // Overrides
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionConstant.prototype.ToSourceCode = function () {
    return this.AtomValue;
  }

  ////////////// STRING //////////////

  // Construction
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionString = function (constName, source) {
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.call(this, constName, source);
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionString.prototype =
    new nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom();
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionString.constructor =
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionString;

  // Overrides
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionString.prototype.ToSourceCode = function () {
    return "\"" + this.AtomValue + "\"";
  }

  ////////////// NUMBER //////////////

  // Construction
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionNumber = function (constName, source) {
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom.call(this, constName, source);
  }
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionNumber.prototype =
    new nsTrsTypeDefinitionAtom.TrsTypeDefinitionAtom();
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionNumber.constructor =
    nsTrsTypeDefinitionAtom.TrsTypeDefinitionNumber;

  // Overrides
  nsTrsTypeDefinitionAtom.TrsTypeDefinitionNumber.prototype.ToSourceCode = function () {
    return this.AtomValue;
  }
}
