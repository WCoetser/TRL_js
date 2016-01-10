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
if (typeof (Interpreter.Execution.InterpreterType) == "undefined") {

  // NB:
  // ---
  // transitionFunction is a abject that represents a dictionary,
  // with 
  // Key = source code version of type def term (also used for hashing/equality)
  // Value = list of next states, ie. type definition type names.

  var nsInterpreterType = Interpreter.Execution;
  
  // Constructor
  nsInterpreterType.InterpreterType = function (sourceTypeDefinition, parentNode) {
    this.ParentNode = parentNode;
    this.CurrentNode = sourceTypeDefinition;
    this.ArgumentMatchedTypes = new Array();
    this.CurrentNodeMatchedTypes = new Collections.HashSet();
    if (sourceTypeDefinition instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTerm) {
      for (var i = 0; i < sourceTypeDefinition.ArgumentTypes.length; i++) {
        var arg = sourceTypeDefinition.ArgumentTypes[i];
        this.ArgumentMatchedTypes.push(new nsInterpreterType.InterpreterType(arg, this));
      }
    }
  }

  nsInterpreterType.InterpreterType.prototype.CurrentNodeMatchedTypes = new Collections.HashSet();

  nsInterpreterType.InterpreterType.prototype.IsTermValid = function (transitionFunction, endStates) {
    this.CurrentNodeMatchedTypes.Clear();

    // Match leaf nodes
    for (var i = 0; i < this.ArgumentMatchedTypes.length; i++) {
      var arg = this.ArgumentMatchedTypes[i];
      arg.IsTermValid(transitionFunction, endStates);
    }

    // If this is a type name, simply add: it is a result in itself
    if (this.CurrentNode instanceof Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName) {
      this.CurrentNodeMatchedTypes.AddElements([this.CurrentNode]);
    }

    this.ProcessLeafNodes(transitionFunction);
    this.ProcessEmptyTransitions(transitionFunction);

    // Only the root node has a meaningful test case for end states
    if (!this.ParentNode)
    {
      // Compile list of matched end states.      
      var matchedEndStates = this.CurrentNodeMatchedTypes.Intersect(endStates);
      return matchedEndStates.GetElementCount() == endStates.GetElementCount();
    }
    else return true;
  }

  nsInterpreterType.InterpreterType.prototype.ProcessLeafNodes = function (transitionFunction) {
    // Match this node
    var currentNodeTerm = this.CurrentNode;
    for (var key in transitionFunction) {

      // Match current node as leaf node
      var termTypePair = transitionFunction[key];
      var nextStates = termTypePair.Value;
      if (transitionFunction[currentNodeTerm]) {
        this.CurrentNodeMatchedTypes.AddElements(termTypePair.Value);
      }

      // Match current node as a term
      var matchTerm = termTypePair.Key;
      if (matchTerm && currentNodeTerm
        && matchTerm.TermName == currentNodeTerm.TermName) {
        var allFound = true;
        for (var argIndex = 0; argIndex < this.ArgumentMatchedTypes.Count; argIndex++) {
          allFound = allFound &&
            this.ArgumentMatchedTypes[argIndex].CurrentNodeMatchedTypes[matchTerm.ArgumentTypes[argIndex]];
        }
        if (allFound) {
          for (var typeNameKey in termTypePair.Value) {
            this.CurrentNodeMatchedTypes.AddElements([termTypePair.Value[typeNameKey]]);
          }
        }
      }
    }
  }

  nsInterpreterType.InterpreterType.prototype.ProcessEmptyTransitions = function (transitionFunction) {
    var found = true;
    var processed = new Collections.HashSet();
    while (found) {
      found = false;
      var addTypes = new Collections.HashSet();
      for (var key in this.CurrentNodeMatchedTypes) {
        var typeName = this.CurrentNodeMatchedTypes[key];
        if (!processed[typeName]) {
          processed.AddElements([typeName]);
          if (transitionFunction[typeName]) {
            var nextStates = transitionFunction[typeName].Value;
            found = true;
            addTypes.AddElements(nextStates);
          }
        }
      }
      this.CurrentNodeMatchedTypes.AddElements(addTypes);
    }
  }
}
