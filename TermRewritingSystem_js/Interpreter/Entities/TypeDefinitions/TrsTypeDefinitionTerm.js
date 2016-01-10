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
if (typeof (Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTerm) == "undefined") {

  var nsTrsTypeDefinitionTerm = Interpreter.Entities.TypeDefinitions;

  // Construction
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm = function (termName, argumentTypes, astSource) {
    Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase.call(this);
    this.TermName = termName;
    this.AstSource = astSource;
    this.ArgumentTypes = argumentTypes;
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTermBase();
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.constructor =
    nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm;

  // Override
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.ToSourceCode = function () {
    var builder = new String();
    builder += this.TermName;
    builder += "(" + this.ArgumentTypes[0].ToSourceCode();
    for (var i = 1; i < this.ArgumentTypes.length; i++) {
      builder += ",";
      builder += this.ArgumentTypes[i].ToSourceCode();
    }
    builder += ")";
    return builder;
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.CreateCopy = function () {
    var newArgs = new Array();
    for (var i = 0; this.ArgumentTypes; i++) {
      newArgs.push(this.ArgumentTypes[i].CreateCopy());
    }
    return new nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm(this.TermName, newArgs, this.AstSource);
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.GetReferencedTypeNames = function() {
    return this.ArgumentTypes;
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.CreateCopyAndReplaceSubTermRefEquals = function(termToReplace, replacementTerm) {
    if (this == termToReplace) return replacementTerm;
    else {
      var newArgs = new Array();
      for (var i = 0; i < this.ArgumentTypes.length; i++) {
        newArgs.push(this.ArgumentTypes[i].CreateCopyAndReplaceSubTermRefEquals(termToReplace, replacementTerm));
      }
      return new nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm(this.TermName, newArgs);
    }
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.GetAllAtoms = function () {
    var atoms = new Array();
    for (var i = 0; i < this.ArgumentTypes.length; i++) {
      var subAtoms = this.ArgumentTypes[i].GetAllAtoms();
      for (var j = 0; j < subAtoms.length; j++) {
        atoms.push(subAtoms[j]);
      }
    }
    return atoms;
  }
  nsTrsTypeDefinitionTerm.TrsTypeDefinitionTerm.prototype.GetAllVariables = function () {
    var variables = [];
    for (var i = 0; i < this.ArgumentTypes.length; i++) {
      var subVars = this.ArgumentTypes[i].GetAllVariables();
      for (var j = 0; j < subVars.length; j++) {
        variables.push(subVars[j]);
      }
    }
    return variables;
  }
}
