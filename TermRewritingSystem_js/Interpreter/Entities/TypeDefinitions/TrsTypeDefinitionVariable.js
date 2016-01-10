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
if (typeof (Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionVariable) == "undefined") {

  var nsTrsTypeDefinitionVariable = Interpreter.Entities.TypeDefinitions;

  // Construction
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable = function (variableName, astSource) {
    Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase.call(this);
    this.AstSource = astSource;
    this.VariableName = variableName;
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase();
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.constructor =
    nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable;

  // Override
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.ToSourceCode = function () {
    return ":" + this.VariableName;
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.CreateCopy = function () {
    return this;
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.GetReferencedTypeNames = function () {
    return [];
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.CreateCopyAndReplaceSubTermRefEquals = function (termToReplace, replacementTerm) {
    if (this == termToReplace) return replacementTerm;
    else return new nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable(this.VariableName,null);
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.GetAllAtoms = function () {
    return [];
  }
  nsTrsTypeDefinitionVariable.TrsTypeDefinitionVariable.prototype.GetAllVariables = function () {
    return [this];
  }
}
