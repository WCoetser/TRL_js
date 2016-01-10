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
if (typeof (Interpreter.Entities.TrsProgramBlock) == "undefined") {

  // Construction
  Interpreter.Entities.TrsProgramBlock = function (astSource) {
    Interpreter.Entities.TrsBase.call(this);
    this.AstSource = astSource;
    this.Statements = new Array();
  }
  Interpreter.Entities.TrsProgramBlock.prototype =
    new Interpreter.Entities.TrsBase();
  Interpreter.Entities.TrsProgramBlock.constructor =
    Interpreter.Entities.TrsProgramBlock;
  
  // Overrides
  Interpreter.Entities.TrsProgramBlock.prototype.ToSourceCode = function () {
    var programOut = new String();
    for (var i = 0; i < this.Statements.length; i++) {
      programOut += this.Statements[i].ToSourceCode();
      programOut += ";";
    }
    return programOut;
  }
}
