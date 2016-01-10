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
if (typeof (Interpreter.Validators) == "undefined") Interpreter.Validators = {};
if (typeof (Interpreter.Validators.TrsTermBaseValidator) == "undefined") {

  // Construction & Inmmheritance
  Interpreter.Validators.TrsTermBaseValidator = function () {
    Interpreter.Validators.TrsValidatorBase.call(this);
  }
  Interpreter.Validators.TrsTermBaseValidator.prototype =
    new Interpreter.Validators.TrsValidatorBase();
  Interpreter.Validators.TrsTermBaseValidator.constructor =
    Interpreter.Validators.TrsTermBaseValidator;

  // Overrides
  Interpreter.Validators.TrsTermBaseValidator.prototype.Validate = function (validationInput) {
    var validationMessage = null;
    if (validationInput instanceof Interpreter.Entities.Keywords.TrsNativeKeyword) {
      validationMessage = new Interpreter.Execution.InterpreterResultMessage();
      validationMessage.Message = "The '" + Parser.Tokenization.Keywords.Native + "' keyword can only be used in reduction rule tails.";
      validationMessage.InputEntity = validationInput;
      validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
      this.ValidationMessages.push(validationMessage);
    }
    else if (validationInput instanceof Interpreter.Entities.Terms.TrsTermProduct) {
      validationMessage = new Interpreter.Execution.InterpreterResultMessage();
      validationMessage.Message = "Term product can only be used as a reduction rule head.";
      validationMessage.InputEntity = validationInput;
      validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
      this.ValidationMessages.push(validationMessage);
    }
    else if (validationInput instanceof Interpreter.Entities.Terms.TrsTerm) {
      var term = validationInput;
      for (var i = 0; i < term.Arguments.length; i++) {
        this.Validate(term.Arguments[i]);
      }
    }
  }

  Interpreter.Validators.TrsTermBaseValidator.prototype.ClearMessages = function () {
    this.ValidationMessages.length = 0;
  }
}
