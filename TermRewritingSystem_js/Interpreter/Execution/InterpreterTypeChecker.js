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
if (typeof (Interpreter.Execution.InterpreterTypeChecker) == "undefined") {

  var nsInterpreterTypeChecker = Interpreter.Execution;

  // Construction
  nsInterpreterTypeChecker.InterpreterTypeChecker = function (programIn) {
    this.typeMappings = new Object();
    this.transitionFunction = new Object();
    this.InitializeLookupTables(programIn);
  }

  // Singleton type names
  nsInterpreterTypeChecker.InterpreterTypeChecker.allNumbers =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(
      Parser.Tokenization.Keywords.TrsNumber);
  nsInterpreterTypeChecker.InterpreterTypeChecker.allStrings =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(
      Parser.Tokenization.Keywords.TrsString);
  nsInterpreterTypeChecker.InterpreterTypeChecker.allConstants =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(
      Parser.Tokenization.Keywords.TrsConstant);
  nsInterpreterTypeChecker.InterpreterTypeChecker.allVariables =
    new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(
      Parser.Tokenization.Keywords.TrsVariable);

  // Class properties  
  // This is a dictionary with Key = TrsVariable and Value = HashSet containing TrsTypeDefinitionTypeName
  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.typeMappings = new Object();
  // This is the state transition function for the bottom up NFTA
  // ... it is a dictionary with Key = TrsTypeDefinitionTermBase and Value = Array of TrsTypeDefinitionTypeName
  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.transitionFunction = new Object();

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.InitializeLookupTables = function (programIn) {
    
    // Variable mappings
    for (var key in programIn.Statements) {
      if (programIn.Statements[key] instanceof Interpreter.Entities.TypeDefinitions.TrsLimitStatement) {
        var limitStatement = programIn.Statements[key];
        for (var varKey in limitStatement.Variables) {
          var variable = limitStatement.Variables[varKey];
          var currentTypeListPair = null;
          if (!this.typeMappings[variable]) {
            currentTypeListPair = {
              Key: variable,
              Value: new Collections.HashSet()
            };
            this.typeMappings[variable] = currentTypeListPair;
          }
          else currentTypeListPair = this.typeMappings[variable];
          currentTypeListPair.Value.AddElements([limitStatement.TypeDefinition]);
        }
      }
    }

    // Type definitions
    for (var key in programIn.Statements) {
      if (programIn.Statements[key] instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinition) {
        var typeStatement = programIn.Statements[key];
        for (var acceptedTermKey in typeStatement.AcceptedTerms) {
          var acceptedTerm = typeStatement.AcceptedTerms[acceptedTermKey];
          var typeNamesPair = null;
          if (!this.transitionFunction[acceptedTerm]) {
            typeNamesPair = {
              Key: acceptedTerm,
              Value: new Array()
            };
            this.transitionFunction[acceptedTerm] = typeNamesPair;
          }
          else typeNamesPair = this.transitionFunction[acceptedTerm];
          typeNamesPair.Value.push(typeStatement.Name);
        }
      }
    }
  }

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.IsSubstitutionValid = function (substitution) {
    var endStates = null;

    // If variable not bound, it is valid by default
    if (!this.typeMappings[substitution.Variable]) return true;
    else endStates = this.typeMappings[substitution.Variable].Value;

    // Initial and final states
    var termIn = Interpreter.Entities.TrsToTrsTermBaseConverterExtensions.Convert(substitution.SubstitutionTerm);
    this.AddDynamicStates(termIn);

    var testType = new Interpreter.Execution.InterpreterType(termIn);
    var retVal = testType.IsTermValid(this.transitionFunction, endStates);

    // Undo dynamic changes to state machine to cater for $TrsNumber, $TrsConstant, $TrsString and $TrsVariable
    this.RemoveDynamicStates();

    return retVal;
  }

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.AddDynamicStates = function (termIn) {
    var atomsAndVariables = termIn.GetAllAtoms().concat(termIn.GetAllVariables());
    for (var targetSymbolKey in atomsAndVariables) {
      var targetSymbol = atomsAndVariables[targetSymbolKey];
      var nextStateTypeName = null;
      var nsTypeDefs = Interpreter.Entities.TypeDefinitions;
      if (targetSymbol instanceof nsTypeDefs.TrsTypeDefinitionNumber) nextStateTypeName = nsInterpreterTypeChecker.InterpreterTypeChecker.allNumbers;
      else if (targetSymbol instanceof nsTypeDefs.TrsTypeDefinitionString) nextStateTypeName = nsInterpreterTypeChecker.InterpreterTypeChecker.allStrings;
      else if (targetSymbol instanceof nsTypeDefs.TrsTypeDefinitionConstant) nextStateTypeName = nsInterpreterTypeChecker.InterpreterTypeChecker.allConstants;
      else if (targetSymbol instanceof nsTypeDefs.TrsTypeDefinitionVariable) nextStateTypeName = nsInterpreterTypeChecker.InterpreterTypeChecker.allVariables;
      var nextStates = null;
      if (!this.transitionFunction[targetSymbol]) {
        nextStates = {
          Key: targetSymbol,
          Value: new Array()
        };
        this.transitionFunction[targetSymbol] = nextStates;
      }
      else nextStates = this.transitionFunction[targetSymbol];
      nextStates.Value.push(nextStateTypeName);
    }
  }

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.RemoveDynamicStates = function () {
    var cleanupKeys = new Array();
    for (var pairKey in this.transitionFunction) 
    {        
      var itemIndex = 0;
      var pair = this.transitionFunction[pairKey];
      if ((itemIndex = pair.Value.indexOf(nsInterpreterTypeChecker.InterpreterTypeChecker.allConstants)) >= 0) pair.Value.splice(itemIndex,1);
      if ((itemIndex = pair.Value.indexOf(nsInterpreterTypeChecker.InterpreterTypeChecker.allNumbers)) >= 0) pair.Value.splice(itemIndex, 1);
      if ((itemIndex = pair.Value.indexOf(nsInterpreterTypeChecker.InterpreterTypeChecker.allStrings)) >= 0) pair.Value.splice(itemIndex, 1);
      if ((itemIndex = pair.Value.indexOf(nsInterpreterTypeChecker.InterpreterTypeChecker.allVariables)) >= 0) pair.Value.splice(itemIndex, 1);
                
      if (pair.Value.length == 0) cleanupKeys.push(pair.Key);
    }
      
    // Avoid any accidents due to empty next states ...
    for (var key in cleanupKeys) delete this.transitionFunction[cleanupKeys[key]];
  }

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.GetTypeDefinitions = function () {
    // Reverse the type definitions back for printing purposes
    var pivoitToTypeName = new Object(); // Key = TrsTypeDefinitionTypeName, Value = HashSet<TrsTypeDefinitionTermBase>
    for (var pairKey in this.transitionFunction) {
      var pair = this.transitionFunction[pairKey];
      for (var typeNameKey in pair.Value) {
        var typeName = pair.Value[typeNameKey];
        var statesInverse = null;
        if (!pivoitToTypeName[typeName]) {
          statesInverse = {
            Key: typeName,
            Value: new Collections.HashSet()
          };
          pivoitToTypeName[typeName] = statesInverse;
        }
        else statesInverse = pivoitToTypeName[typeName];
        statesInverse.Value.AddElements([pair.Key]);
      }
    }
    var retVal = new Array();
    for (var pairKey in pivoitToTypeName) {
      var pair = pivoitToTypeName[pairKey];
      retVal.push(new Interpreter.Entities.TypeDefinitions.TrsTypeDefinition(pair.Key, pair.Value.ToArray()));
    }
    return retVal;
  }

  nsInterpreterTypeChecker.InterpreterTypeChecker.prototype.GetVariableMappings = function () {
    // Get the inverse end state mappings for the limit statements
    var inverseVariableMappings = new Object(); // Key = TrsTypeDefinitionTypeName, Value = HashSet<TrsVariable>
    for (var pairKey in this.typeMappings) {
      var pair = this.typeMappings[pairKey];
      for (var typeKey in pair.Value) {
        if (!pair.Value.hasOwnProperty(typeKey)) continue;
        var type = pair.Value[typeKey];
        var variables = null;
        if (!inverseVariableMappings[type]) {
          variables = {
            Key: type,
            Value: new Collections.HashSet()
          };
          inverseVariableMappings[type] = variables;
        }
        else variables = inverseVariableMappings[type];
        variables.Value.AddElements([pair.Key]);
      }
    }
    var retArray = new Array();
    for (var pairKey in inverseVariableMappings) {
      var pair = inverseVariableMappings[pairKey];
      retArray.push(new Interpreter.Entities.TypeDefinitions.TrsLimitStatement(pair.Value.ToArray(), pair.Key));
    }
    return retArray;
  }
}
