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
if (typeof (Interpreter.Entities.Terms.TrsTermBase) == "undefined") {

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsTermBase = function () {
    Interpreter.Entities.TrsStatement.call(this);
  }
  Interpreter.Entities.Terms.TrsTermBase.prototype =
    new Interpreter.Entities.TrsStatement();
  Interpreter.Entities.Terms.TrsTermBase.constructor =
    Interpreter.Entities.Terms.TrsTermBase;

  // Abstract methods
  Interpreter.Entities.Terms.TrsTermBase.prototype.ApplySubstitution =
    function (substitution) { }
  Interpreter.Entities.Terms.TrsTermBase.prototype.ContainsVariable =
    function (testVariable) { }
  Interpreter.Entities.Terms.TrsTermBase.prototype.CreateCopyAndReplaceSubTerm =
    function (termToReplace, replacementTerm) { }
  Interpreter.Entities.Terms.TrsTermBase.prototype.GetVariables =
    function () { }

  // Use the abstract methods implemented in child classes to
  // do substitutions
  Interpreter.Entities.Terms.TrsTermBase.prototype.ApplySubstitutions =
    function (substitutions) {
      var retVal = this;
      for (var key in substitutions) {
        retVal = retVal.ApplySubstitution(substitutions[key]);
      }
      return retVal;
    }

  // Overrides ...
  Interpreter.Entities.Terms.TrsTermBase.prototype.CreateCopy =
    function () { return this.CreateCopyAndReplaceSubTerm(null, null); }


}
