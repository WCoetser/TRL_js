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
if (typeof (Interpreter.Entities.Terms) == "undefined") Interpreter.Entities.Terms = {};
if (typeof (Interpreter.Entities.Terms.TrsTerm) == "undefined") {
  
  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsTerm = function (name, arguments, sourceTerm) {
    Interpreter.Entities.Terms.TrsTermBase.call(this);
    this.Name = name;
    this.Arguments = arguments;
    this.AstSource = sourceTerm;
  }
  Interpreter.Entities.Terms.TrsTerm.prototype =
    new Interpreter.Entities.Terms.TrsTermBase();
  Interpreter.Entities.Terms.TrsTerm.constructor =
    Interpreter.Entities.Terms.TrsTerm;

  // Overrides
  Interpreter.Entities.Terms.TrsTerm.prototype.ToSourceCode = function () {
    var result = new String();
    result += this.Name;
    result += "(";
    result += this.Arguments[0].ToSourceCode();
    for (var i = 1; i < this.Arguments.length; i++) {
      result += ",";
      result += this.Arguments[i].ToSourceCode();
    }
    result += ")";
    return result;
  }
  Interpreter.Entities.Terms.TrsTerm.prototype.ApplySubstitution = function (substitution) {
    var newArguments = new Array();
    for (var key in this.Arguments) {
      newArguments.push(this.Arguments[key].ApplySubstitutions([substitution]));
    }
    return new Interpreter.Entities.Terms.TrsTerm(this.Name, newArguments, null);
  }
  Interpreter.Entities.Terms.TrsTerm.prototype.CreateCopyAndReplaceSubTerm = function (termToReplace, replacementTerm) {
    if (termToReplace && (this.toString() == termToReplace.toString()))
    {
      return replacementTerm;
    }
    else
    {
      var newArgs = new Array();
      for (var key in this.Arguments) {
        newArgs.push(this.Arguments[key].CreateCopyAndReplaceSubTerm(termToReplace, replacementTerm));
      }
      return new Interpreter.Entities.Terms.TrsTerm(this.Name, newArgs, null);
    }
  }
  Interpreter.Entities.Terms.TrsTerm.prototype.GetVariables = function () {
    var retVars = new Array();
    for (var key in this.Arguments) {
      var subVariables = this.Arguments[key].GetVariables();
      for (var variableKey in subVariables) {
        retVars.push(subVariables[variableKey]);
      }
    }
    return retVars;
  }
}
