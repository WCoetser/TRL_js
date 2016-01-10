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
if (typeof (Interpreter.Entities.Terms.TrsTermProduct) == "undefined") {

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsTermProduct = function (termList, astSource) {
    Interpreter.Entities.Terms.TrsTermBase.call(this);
    this.TermList = termList;
    this.AstSource = astSource;
  }
  Interpreter.Entities.Terms.TrsTermProduct.prototype =
    new Interpreter.Entities.Terms.TrsTermBase();
  Interpreter.Entities.Terms.TrsTermProduct.constructor =
    Interpreter.Entities.Terms.TrsTermProduct;

  // Overrides
  Interpreter.Entities.Terms.TrsTermProduct.prototype.ToSourceCode = function () {
    var builder = new String();
    builder += "[";
    builder += this.TermList[0].ToSourceCode();
    for (var i = 1; i < this.TermList.length; i++) {
      builder += ",";
      builder += this.TermList[i].ToSourceCode();
    }
    builder += "]";
    return builder;
  }
  Interpreter.Entities.Terms.TrsTermProduct.prototype.ApplySubstitution = function (substitution) {
    var argList = new Array();
    for (var i = 0; i < this.TermList.length; i++) {
      if (this.TermList[i].toString() == substitution.Variable) {
        argList.push(substitution.SubstitutionTerm);
      }
      else {
        argList.push(this.TermList[i].ApplySubstitutions([substitution]));
      }
    }
    return new Interpreter.Entities.Terms.TrsTermProduct(argList);
  }
  Interpreter.Entities.Terms.TrsTermProduct.prototype.ContainsVariable = function(testVariable) {
    for (var i = 0; i < this.TermList.length; i++) {
      if (this.TermList[i].ContainsVariable(testVariable)) return true;
    }
    return false;
  }
  Interpreter.Entities.Terms.TrsTermProduct.prototype.CreateCopyAndReplaceSubTerm = function (termToReplace, replacementTerm) {
    var newArguments = new Array();
    for (var i = 0; i < this.TermList.length; i++) {
      if (termToReplace && (this.TermList[i].toString() == termToReplace.toString())) {
        newArguments.push(replacementTerm);
      }
      else {
        newArguments.push(this.TermList[i].CreateCopyAndReplaceSubTerm(termToReplace, replacementTerm));
      }
    }
    return new Interpreter.Entities.Terms.TrsTermProduct(newArguments);
  }
  Interpreter.Entities.Terms.TrsTermProduct.prototype.GetVariables = function () {
    var retVars = new Array();
    for (var key in this.TermList) {
      var subVariables = this.TermList[key].GetVariables();
      for (var variableKey in subVariables) {
        retVars.push(subVariables[variableKey]);
      }
    }
    return retVars;
  }
}
