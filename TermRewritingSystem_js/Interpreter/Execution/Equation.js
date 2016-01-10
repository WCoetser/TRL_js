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
if (typeof (Interpreter.Execution) == "undefined") Interpreter.Execution = {};
if (typeof (Interpreter.Execution.Equation) == "undefined") {

  var nsEquation = Interpreter.Execution;

  nsEquation.Equation = function () {
    this.Lhs = null;
    this.Rhs = null;
  }

  nsEquation.Equation.prototype.Lhs = null;
  nsEquation.Equation.prototype.Rhs = null;

  nsEquation.Equation.prototype.ToSourceCode = function () {
    return this.Lhs.ToSourceCode() + " = " + this.Rhs.ToSourceCode();
  }

  nsEquation.Equation.prototype.toString = function () {
    return this.ToSourceCode();
  }

  nsEquation.Equation.prototype.CreateCopy = function () {
    var retVal = new nsEquation.Equation();
    retVal.Lhs = this.Lhs.CreateCopy();
    retVal.Rhs = this.Rhs.CreateCopy();
    return retVal;
  }
}
