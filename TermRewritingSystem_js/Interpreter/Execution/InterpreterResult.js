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
if (typeof (Interpreter.Execution.InterpreterResult) == "undefined") {

  Interpreter.Execution.InterpreterResult = function (programIn) {
    this.Messages = new Array();
    this.ProgramIn = programIn;
    this.ProgramOut = new Interpreter.Entities.TrsProgramBlock();
    this.IsRewritten = false;
  }

  Interpreter.Execution.InterpreterResult.prototype.GetSucceed = function () {
    for (var msgKey in this.Messages) {
      var msg = this.Messages[msgKey];
      if (msg.MessageType == Interpreter.Execution.InterpreterMessageType.Error) {
        return false;
      }
    }
    return true;
  }

  Interpreter.Execution.InterpreterResult.prototype.ProgramIn = null;
  Interpreter.Execution.InterpreterResult.prototype.ProgramOut = null;
  Interpreter.Execution.InterpreterResult.prototype.IsRewritten = false;

}
