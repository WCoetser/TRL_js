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
if (typeof (Interpreter.Entities.TrsToTrsTermBaseConverterExtensions) == "undefined") {

  // This is a static helper class
  Interpreter.Entities.TrsToTrsTermBaseConverterExtensions = {};

  Interpreter.Entities.TrsToTrsTermBaseConverterExtensions.Convert = function (termIn) {
    if (termIn instanceof Interpreter.Entities.Terms.TrsConstant) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionConstant(termIn.Value);
    }
    else if (termIn instanceof Interpreter.Entities.Terms.TrsString) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionString(termIn.Value);
    }
    else if (termIn instanceof Interpreter.Entities.Terms.TrsNumber) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionNumber(termIn.Value);
    }
    else if (termIn instanceof Interpreter.Entities.Terms.TrsVariable) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionVariable(termIn.Name);
    }
    else if (termIn instanceof Interpreter.Entities.Terms.TrsTerm) {
      var args = new Array();
      for (var i = 0; i < termIn.Arguments.length; i++) {
        args.push(Interpreter.Entities.TrsToTrsTermBaseConverterExtensions.Convert(termIn.Arguments[i]));
      }
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTerm(termIn.Name, args);
    }
  }
}
