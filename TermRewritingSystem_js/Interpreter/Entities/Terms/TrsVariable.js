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
if (typeof (Interpreter.Entities.Terms.TrsVariable) == "undefined") {

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsVariable = function (name, astSource) {
    Interpreter.Entities.Terms.TrsTermBase.call(this);
    this.Name = name;
    this.AstSource = astSource;
  }
  Interpreter.Entities.Terms.TrsVariable.prototype =
    new Interpreter.Entities.Terms.TrsTermBase();
  Interpreter.Entities.Terms.TrsVariable.constructor =
    Interpreter.Entities.Terms.TrsVariable;

  // Overridedes
  Interpreter.Entities.Terms.TrsVariable.prototype.ContainsVariable = function (testVariable) {
    return this.toString() == testVariable.toString();
  }
  Interpreter.Entities.Terms.TrsVariable.prototype.ToSourceCode = function () {
    return ":" + this.Name;
  }
  Interpreter.Entities.Terms.TrsVariable.prototype.ApplySubstitution = function (substitution) {
    if (this.toString() == substitution.Variable.toString()) return substitution.SubstitutionTerm;
    else return this;
  }
  Interpreter.Entities.Terms.TrsVariable.prototype.CreateCopyAndReplaceSubTerm = function (termToReplace, replacementTerm) {
    if (termToReplace && (this.toString() == termToReplace.toString())) return replacementTerm;
    else return new Interpreter.Entities.Terms.TrsVariable(this.Name, null);
  }
  Interpreter.Entities.Terms.TrsVariable.prototype.GetVariables = function () {
    return [this];
  }
}
