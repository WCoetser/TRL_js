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
if (typeof (Interpreter.Entities.Terms.TrsAtom) == "undefined") {

  ///////////// ATOM BASE CLASS ///////////// 

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsAtom = function () {
    Interpreter.Entities.Terms.TrsTermBase.call(this);
    this.Value = new String();
  }
  Interpreter.Entities.Terms.TrsAtom.prototype =
    new Interpreter.Entities.Terms.TrsTermBase();
  Interpreter.Entities.Terms.TrsAtom.constructor =
    Interpreter.Entities.Terms.TrsAtom;

  Interpreter.Entities.Terms.TrsAtom.prototype.Value = new String();

  // Overrides
  Interpreter.Entities.Terms.TrsAtom.prototype.ContainsVariable =
    function (testVariable) { return false; }
  Interpreter.Entities.Terms.TrsAtom.prototype.ApplySubstitution =
    function (substitution) { return this; }
  Interpreter.Entities.Terms.TrsAtom.prototype.GetVariables =
    function () { return new Array(); }
  Interpreter.Entities.Terms.TrsAtom.prototype.CreateCopyAndReplaceSubTerm =
    function (termToReplace, replacementTerm) {
      if (termToReplace && (this.toString() == termToReplace.toString())) {
        return replacementTerm;
      }
      else {
        if (this instanceof Interpreter.Entities.Terms.TrsNumber) {
          return new Interpreter.Entities.Terms.TrsNumber(this.Value);
        }
        else if (this instanceof Interpreter.Entities.Terms.TrsConstant) {
          return new Interpreter.Entities.Terms.TrsConstant(this.Value);
        }
        else if (this instanceof Interpreter.Entities.Terms.TrsString) {
          return new Interpreter.Entities.Terms.TrsString(this.Value);
        }
      }
    }
  Interpreter.Entities.Terms.TrsAtom.prototype.ToSourceCode =
    function () { return this.Value; }

  ///////////// NUMBER CLASS ///////////// 

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsNumber = function (value, source) {
    Interpreter.Entities.Terms.TrsAtom.call(this);
    this.AstSource = source;
    this.Value = value;
  }
  Interpreter.Entities.Terms.TrsNumber.prototype =
    new Interpreter.Entities.Terms.TrsAtom();
  Interpreter.Entities.Terms.TrsNumber.constructor =
    Interpreter.Entities.Terms.TrsNumber;

  ///////////// STRING CLASS ///////////// 

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsString = function (value, source) {
    Interpreter.Entities.Terms.TrsAtom.call(this);
    this.AstSource = source;
    this.Value = value;
  }
  Interpreter.Entities.Terms.TrsString.prototype =
    new Interpreter.Entities.Terms.TrsAtom();
  Interpreter.Entities.Terms.TrsString.constructor =
    Interpreter.Entities.Terms.TrsString;

  // Overrides
  Interpreter.Entities.Terms.TrsString.prototype.ToSourceCode =
    function () { return "\"" + this.Value + "\""; }

  ///////////// CONSTANTS CLASS /////////////  

  // Construction & Inheritance
  Interpreter.Entities.Terms.TrsConstant = function (value, source) {
    Interpreter.Entities.Terms.TrsAtom.call(this);
    this.AstSource = source;
    this.Value = value;
  }
  Interpreter.Entities.Terms.TrsConstant.prototype =
    new Interpreter.Entities.Terms.TrsAtom();
  Interpreter.Entities.Terms.TrsConstant.constructor =
    Interpreter.Entities.Terms.TrsConstant;

}