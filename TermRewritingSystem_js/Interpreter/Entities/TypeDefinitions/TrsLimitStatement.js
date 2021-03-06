﻿/*
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
if (typeof (Interpreter.Entities.TypeDefinitions) == "undefined") Interpreter.Entities.TypeDefinitions = {};
if (typeof (Interpreter.Entities.TypeDefinitions.TrsLimitStatement) == "undefined") {

  var nsTrsLimitStatement = Interpreter.Entities.TypeDefinitions;

  // Construct & inherit
  nsTrsLimitStatement.TrsLimitStatement = function (variables,typeDefinition, astSource) {
    Interpreter.Entities.TrsStatement.call(this);
    this.AstSource = astSource;
    this.TypeDefinition = typeDefinition;
    this.Variables = variables;
  }
  nsTrsLimitStatement.TrsLimitStatement.prototype = new Interpreter.Entities.TrsStatement();
  nsTrsLimitStatement.TrsLimitStatement.constructor = nsTrsLimitStatement.TrsLimitStatement;

  // Overrides
  nsTrsLimitStatement.TrsLimitStatement.prototype.CreateCopy = function () {
    var newVars = new Array();
    for (var i = 0; i < this.Variables.length; i++) {
      newVars.push(this.Variables[i].CreateCopy());
    }
    return new nsTrsLimitStatement.TrsLimitStatement(newVars, this.TypeDefinition.CreateCopy(), this.AstSource);
  }
  nsTrsLimitStatement.TrsLimitStatement.prototype.ToSourceCode = function () {
    var retVal = new String();
    retVal += Parser.Tokenization.Keywords.Limit;
    retVal += " ";
    retVal += this.Variables[0].ToSourceCode();
    for (var i = 1; i < this.Variables.length; i++) {
      retVal += ",";
      retVal += this.Variables[i].ToSourceCode();
    }
    retVal += " ";
    retVal += Parser.Tokenization.Keywords.To;
    retVal += " ";
    retVal += this.TypeDefinition.ToSourceCode();
    return retVal;
  }
}
