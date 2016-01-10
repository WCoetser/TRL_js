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
if (typeof (Interpreter.Validators.TrsProgramBlockValidator) == "undefined") {

  // Construction & Inheritance
  Interpreter.Validators.TrsProgramBlockValidator = function () {
    Interpreter.Validators.TrsValidatorBase.call(this);
    this.reductionRuleValidator = new Interpreter.Validators.TrsReductionRuleValidator();
    this.termValidator = new Interpreter.Validators.TrsTermBaseValidator();
  }
  Interpreter.Validators.TrsProgramBlockValidator.prototype =
    new Interpreter.Validators.TrsValidatorBase();
  Interpreter.Validators.TrsProgramBlockValidator.constructor =
    Interpreter.Validators.TrsProgramBlockValidator;

  Interpreter.Validators.TrsProgramBlockValidator.prototype.Validate = function (programBlockIn) {
    var validationMessage = null;

    // Check for empty
    if (!programBlockIn.Statements || programBlockIn.Statements.length == 0) {
      validationMessage = new Interpreter.Execution.InterpreterResultMessage();
      validationMessage.Message = "Empty program block.";
      validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Warning;
      validationMessage.InputEntity = programBlockIn;
      this.ValidationMessages.push(validationMessage);
    }

    // Check types for cyclical definitions
    this.ValidateTypeDefinitions(programBlockIn);

    // Check limit statements
    this.ValidateLimitStatements(programBlockIn);

    // Check statements with sub-validators
    this.ValidateSubValidators(programBlockIn);
  }

  Interpreter.Validators.TrsProgramBlockValidator.prototype.ValidateLimitStatements = function (programBlockIn) {
    var typeNames = new Collections.HashSet();
    var mappedVariables = new Collections.HashSet();
    var validationMessage = null;

    // Add native types
    var nativeTypes = Parser.Tokenization.Keywords.NativeTypes;
    for (var i = 0; i < nativeTypes.length; i++) {
      typeNames.AddElements([new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(nativeTypes[i])]);
    }

    for (var i = 0; i < programBlockIn.Statements.length; i++) {
      // Add declared types
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) {
        typeNames.AddElements([programBlockIn.Statements[i].Name]);
      }
      // Collect mapped variables
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.TypeDefinitions.TrsLimitStatement) {
        mappedVariables.AddElements(programBlockIn.Statements[i].Variables);
      }
    }

    // Check all mapped types exist
    for (var i = 0; i < programBlockIn.Statements.length; i++) {

      // Check all mapped types exist
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.TypeDefinitions.TrsLimitStatement) {
        if (!typeNames[programBlockIn.Statements[i].TypeDefinition]) {
          var limit = programBlockIn.Statements[i];
          validationMessage = new Interpreter.Execution.InterpreterResultMessage();
          validationMessage.InputEntity = limit;
          validationMessage.Message = "Unknown type referenced in limit statement: " + limit.TypeDefinition.ToSourceCode();
          validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
          this.termValidator.ValidationMessages.push(validationMessage);
        }
      }

      // Check all native function redexes have a mapped variables in head
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.Terms.TrsReductionRule
        && programBlockIn.Statements[i].Tail instanceof Interpreter.Entities.Keywords.TrsNativeKeyword) {
        var redex = programBlockIn.Statements[i];
        var headVariables = redex.Head.GetVariables();
        for (var j = 0; j < headVariables.length; j++) {
          if (!mappedVariables[headVariables[j]]) {
            validationMessage = new Interpreter.Execution.InterpreterResultMessage();
            validationMessage.InputEntity = redex;
            validationMessage.Message = "Variable " + headVariables[j].ToSourceCode() + " in term head for native function is not mapped to a type definition.";
            validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
            this.termValidator.ValidationMessages.push(validationMessage);
          }
        }
      }
    }
  }

  Interpreter.Validators.TrsProgramBlockValidator.prototype.ValidateSubValidators = function (programBlockIn) {
    var validationMessage = null;
    for (var i = 0; i < programBlockIn.Statements.length; i++) {
      var statement = programBlockIn.Statements[i];
      if (statement instanceof Interpreter.Entities.Terms.TrsReductionRule) {
        this.reductionRuleValidator.Validate(statement);
      }
      else if (statement instanceof Interpreter.Entities.Terms.TrsVariable) {
        validationMessage = new Interpreter.Execution.InterpreterResultMessage();
        validationMessage.InputEntity = statement;
        validationMessage.Message = "A term cannot only be a variable, this would match all rewrite rules excluding those resulting from the occurs check, taking type definitions into account.";
        validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
        this.termValidator.ValidationMessages.push(validationMessage);
      }
      else if (statement instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) {
        var typeDefinition = statement;
        var nativeTypeSet = new Collections.HashSet(Parser.Tokenization.Keywords.NativeTypes);
        if (nativeTypeSet[typeDefinition.Name.TypeName]) {
          validationMessage = new Interpreter.Execution.InterpreterResultMessage();
          validationMessage.InputEntity = statement;
          validationMessage.Message = "A type definition name may not be the same as the native type names: " +
                  Parser.Tokenization.Keywords.TrsConstant + " " +
                  Parser.Tokenization.Keywords.TrsNumber + " " +
                  Parser.Tokenization.Keywords.TrsString + " " +
                  Parser.Tokenization.Keywords.TrsVariable;
          validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
          this.termValidator.ValidationMessages.push(validationMessage);
        }
        else {
          this.termValidator.Validate(statement);
        }
      }
    }
    this.ValidationMessages = this.ValidationMessages.concat(this.reductionRuleValidator.ValidationMessages, this.termValidator.ValidationMessages);
  }

  Interpreter.Validators.TrsProgramBlockValidator.prototype.ClearMessages = function() {
    this.ValidationMessages.length = 0;
    this.reductionRuleValidator.ClearMessages();
    this.termValidator.ClearMessages();
  }

  Interpreter.Validators.TrsProgramBlockValidator.prototype.ValidateTypeDefinitions = function (programBlockIn) {
    var validationMessage = null;

    // Check for e-cycles in type graph
    // ... construct test graph
    var cycleTestGraph = {};
    for (var i = 0; i < programBlockIn.Statements.length; i++) {
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) {
        var typeDef = programBlockIn.Statements[i];
        if (!cycleTestGraph[typeDef.Name]) cycleTestGraph[typeDef.Name] = { Key: typeDef.Name, NextStates: new Array() };
        for (var j = 0; j < typeDef.AcceptedTerms.length; j++) {
          if (typeDef.AcceptedTerms[j] instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName) {
            cycleTestGraph[typeDef.Name].NextStates.push(typeDef.AcceptedTerms[j]);
          }
        }
      }
    }

    // Check for cycles
    var visitedNodes = new Collections.HashSet();
    var childNodes = new Array(); // actually a Stack ...
    for (var key in cycleTestGraph) {
      var currentState = cycleTestGraph[key];
      // Clear ...
      visitedNodes = new Collections.HashSet();
      childNodes.length = 0;
      childNodes.push(currentState.Key);
      while (childNodes.length > 0) {
        var currentPosition = childNodes.pop();
        if (visitedNodes[currentPosition]) {
          validationMessage = new Interpreter.Execution.InterpreterResultMessage();
          validationMessage.InputEntity = currentPosition;
          validationMessage.Message = "Found cycle in type graph for type name " + currentState.Key.ToSourceCode();
          validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
          this.ValidationMessages.push(validationMessage);
        }
        else {
          visitedNodes.AddElements([currentPosition]);
          if (cycleTestGraph[currentPosition]) {
            for (var i = 0; i < cycleTestGraph[currentPosition].NextStates.length; i++) {
              childNodes.push(cycleTestGraph[currentPosition].NextStates[i]);
            }
          }
        }
      }
    }

    // Check the type definition subtypes
    var hsNativeTypes = new Collections.HashSet(Parser.Tokenization.Keywords.NativeTypes);
    for (var i = 0; i < programBlockIn.Statements.length; i++) {
      if (programBlockIn.Statements[i] instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) {
        var typeDef = programBlockIn.Statements[i];
        var referencedTypeNames = typeDef.GetReferencedTypeNames();
        for (var j = 0; j < referencedTypeNames.length; j++) {
          var refType = referencedTypeNames[j];
          if (!cycleTestGraph[refType] && !hsNativeTypes[refType.TypeName]) {
            validationMessage = new Interpreter.Execution.InterpreterResultMessage();
            validationMessage.InputEntity = typeDef;
            validationMessage.Message = "Unknown type: " + refType.ToSourceCode();
            validationMessage.MessageType = Interpreter.Execution.InterpreterMessageType.Error;
            this.ValidationMessages.push(validationMessage);
          }
        }
      }
    }
  }
}
