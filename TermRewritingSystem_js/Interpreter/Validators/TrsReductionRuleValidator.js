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
if (typeof (Interpreter.Validators.TrsReductionRuleValidator) == "undefined") {

  // Construction & Inheritance
  Interpreter.Validators.TrsReductionRuleValidator = function () {
    Interpreter.Validators.TrsValidatorBase.call(this);
    this.termValidator = new Interpreter.Validators.TrsTermBaseValidator();
  }
  Interpreter.Validators.TrsReductionRuleValidator.prototype =
    new Interpreter.Validators.TrsValidatorBase();
  Interpreter.Validators.TrsReductionRuleValidator.constructor =
    Interpreter.Validators.TrsReductionRuleValidator;

  // Overrides
  Interpreter.Validators.TrsReductionRuleValidator.prototype.Validate = function(validationInput) {
    var validationMessage = null;
    if (validationInput.Head instanceof Interpreter.Entities.Terms.TrsVariable) {
      validationMessage = new Interpreter.Execution.InterpreterResultMessage();
      validationMessage.Message = "A reduction rule head may not only be a variable.";
      validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
      validationMessage.InputEntity = validationInput;
      this.ValidationMessages.push(validationMessage);
    }

    // All variables in tail must appear on head
    var headVariables = new Collections.HashSet(validationInput.Head.GetVariables());
    var tailVariables = new Collections.HashSet(validationInput.Tail.GetVariables());
    tailVariables.AddElements(headVariables);
    if (tailVariables.GetElementCount() != headVariables.GetElementCount()) {
      validationMessage = new Interpreter.Execution.InterpreterResultMessage();
      validationMessage.Message = "A reduction rule head must contain all variables that is in the reduction rule tail.";
      validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
      validationMessage.InputEntity = validationInput;
      this.ValidationMessages.push(validationMessage);
    }

    // Head validation
    if (validationInput.Head instanceof Interpreter.Entities.Terms.TrsTermProduct) {
      for (var i = 0; i < validationInput.Head.TermList; i++) {
        this.termValidator.Validate(validationInput.Head.TermList[i]);
      }
    }
    else {
      this.termValidator.Validate(validationInput.Head);
    }

    // The tail validation must take the case into account where the "native" keywork have been used
    if (!(validationInput.Tail instanceof Interpreter.Entities.Keywords.TrsNativeKeyword)) {
      this.termValidator.Validate(validationInput.Tail);
    }
    this.ValidationMessages.concat(this.termValidator.ValidationMessages);
  }

  // Overrides
  Interpreter.Validators.TrsReductionRuleValidator.ClearMessages = function() {
    this.ValidationMessages.length = 0;
    this.termValidator.ClearMessages();
  }
}
