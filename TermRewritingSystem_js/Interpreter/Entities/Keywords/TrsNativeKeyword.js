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
if (typeof (Interpreter.Entities.Keywords) == "undefined") Interpreter.Entities.Keywords = {};
if (typeof (Interpreter.Entities.Keywords.TrsNativeKeyword) == "undefined") {

  // Construction & inheritance
  Interpreter.Entities.Keywords.TrsNativeKeyword = function (astNativeKeyword) {
    Interpreter.Entities.Terms.TrsTermBase.call(this);
    this.AstNativeKeyword = astNativeKeyword;
  }
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype =
    new Interpreter.Entities.Terms.TrsTermBase();
  Interpreter.Entities.Keywords.TrsNativeKeyword.constructor =
    Interpreter.Entities.Keywords.TrsNativeKeyword;

  // Overrides
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype.ApplySubstitution =
    function (substitution) { return this; }
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype.ContainsVariable =
    function (testVariable) { return this; }
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype.CreateCopyAndReplaceSubTerm =
    function (termToReplace, replacementTerm) { return this; }
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype.GetVariables =
    function () { return new Array(); }
  Interpreter.Entities.Keywords.TrsNativeKeyword.prototype.ToSourceCode =
    function () { return Parser.Tokenization.Keywords.Native; }
}
