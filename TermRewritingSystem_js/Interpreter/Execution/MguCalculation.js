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
if (typeof (Interpreter.Execution.MguCalculation) == "undefined") {

  var nsMguCalculation = Interpreter.Execution;

  // Construct & Inherit
  nsMguCalculation.MguCalculation = function (customUnifiers) {
    nsMguCalculation.ITrsUnifierCalculation.call(this);
    if (customUnifiers != null) this.customUnifiers = customUnifiers;
    else this.customUnifiers = new Array();
  }
  nsMguCalculation.MguCalculation.prototype = new nsMguCalculation.ITrsUnifierCalculation();
  nsMguCalculation.MguCalculation.constructor = nsMguCalculation.MguCalculation;

  // Methods
  nsMguCalculation.MguCalculation.prototype.CustomFail = function (retVal, mgu, currentProblem, currEq, variableNamesToPreserve) {
    var fail = function () {
      retVal.Succeed = false;
      mgu.length = 0;
      currentProblem.length = 0;
    };
    // First try custom unifiers ... use the first one that works.
    // TODO: Provide for multiple unifiers
    var currentResult = null;
    for (var unifFuncKey in this.customUnifiers) {
      var unifFunc = this.customUnifiers[unifFuncKey];
      // Prevent overwriting of input terms ...
      var input = currEq.CreateCopy();
      currentResult = unifFunc.GetUnifier(input.Lhs, input.Rhs);
      if (currentResult.Succeed) break;
    }
    if (currentResult == null || !currentResult.Succeed) {
      fail();
    }
    else {
      var succeed = true;
      for (var customSubstitutionKey in currentResult.Unifier) {
        var customSubstitution = currentResult.Unifier[customSubstitutionKey];
        // Do occurs check
        if (customSubstitution.SubstitutionTerm.ContainsVariable(customSubstitution.Variable)) {
          succeed = false;
          break;
        }
        // Prevent conflicting mappings
        for (var substitutionKey in mgu) {
          var substitution = mgu[substitutionKey];
          if (substitution.Variable.toString() == customSubstitution.Variable.toString()
            && substitution.SubstitutionTerm.toString() != customSubstitution.SubstitutionTerm.toString()) {
            succeed = false;
            break;
          }
        }
      }
      // Apply the subtitutions
      if (!succeed) fail();
      else
      {
        for (var substitutionKey in currentResult.Unifier) {
          var substitution = currentResult.Unifier[substitutionKey];
          var eq = new  Interpreter.Execution.Equation();
          eq.Lhs = substitution.Variable;
          eq.Rhs = substitution.SubstitutionTerm;
          this.ProcessSubstitutionStep(mgu, currentProblem, eq, variableNamesToPreserve);
        }
      }
    }
  }

  nsMguCalculation.MguCalculation.prototype.GetMgu = function (unificationProblem, variableNamesToPreserve) {
    
    var nsTerms = Interpreter.Entities.Terms;
    var initialEquation = unificationProblem.CreateCopy();

    // Assume succeed until fail
    var mgu = new Array(); // List<Substitution>();
    var retVal = new nsMguCalculation.UnificationResult();
    retVal.Succeed = true;
    retVal.Unifier = mgu;
    var currentProblem = new Array(); // List<Equation>();
    currentProblem.push(initialEquation);
    while (currentProblem.length > 0) {
      var currEq = currentProblem.pop();
      if (currEq.Lhs.toString() == currEq.Rhs.toString()) {
      }
      else if (currEq.Lhs instanceof nsTerms.TrsAtom && currEq.Rhs instanceof nsTerms.TrsAtom) {
        if (currEq.Lhs.toString() != currEq.Rhs.toString())
          this.CustomFail(retVal, mgu, currentProblem, currEq, variableNamesToPreserve);
      }
      else if (currEq.Lhs instanceof nsTerms.TrsAtom && currEq.Rhs instanceof nsTerms.TrsTerm
        || currEq.Lhs instanceof nsTerms.TrsTerm && currEq.Rhs instanceof nsTerms.TrsAtom) {
        this.CustomFail(retVal, mgu, currentProblem, currEq, variableNamesToPreserve);
      }
      else if (currEq.Lhs instanceof nsTerms.TrsTerm && currEq.Rhs instanceof nsTerms.TrsTerm) {
        var lhs = currEq.Lhs;
        var rhs = currEq.Rhs;
        if (lhs.Name != rhs.Name || lhs.Arguments.length != rhs.Arguments.length)
          this.CustomFail(retVal, mgu, currentProblem, currEq, variableNamesToPreserve);
        else {
          for (var i = 0; i < lhs.Arguments.length; i++) {
            var newEq = new Interpreter.Execution.Equation();
            newEq.Lhs = lhs.Arguments[i];
            newEq.Rhs = rhs.Arguments[i];
            currentProblem.push(newEq);
          }
        }
      }
      else if (!(currEq.Lhs instanceof Interpreter.Entities.Terms.TrsVariable) 
        && (currEq.Rhs instanceof Interpreter.Entities.Terms.TrsVariable))
      {
        var lhsSwap = currEq.Lhs;
        currEq.Lhs = currEq.Rhs;
        currEq.Rhs = lhsSwap;
        currentProblem.push(currEq);
      }
      else if (currEq.Lhs instanceof Interpreter.Entities.Terms.TrsVariable)
      {
        // Occurs check
        if (currEq.Rhs.ContainsVariable(currEq.Lhs)) {
          CustomFail(retVal, mgu, currentProblem, currEq, variableNamesToPreserve);
        }
        else this.ProcessSubstitutionStep(mgu, currentProblem, currEq, variableNamesToPreserve);
      }
    }
    if (!retVal.Succeed) retVal.Unifier = null;
    else retVal.Unifier = mgu;
    return retVal;
  }

  nsMguCalculation.MguCalculation.prototype.ProcessSubstitutionStep = function (mgu, currentProblem, currEq, variableNamesToPreserve) {
    // LHS will always be variable here ... preserve matched term variables
    var newSub = null;
    if (currEq.Rhs instanceof Interpreter.Entities.Terms.TrsVariable
      && variableNamesToPreserve.indexOf(currEq.Lhs) >= 0) {
      newSub = new Interpreter.Execution.Substitution();
      newSub.Variable = currEq.Rhs;
      newSub.SubstitutionTerm = currEq.Lhs;
    }
    else {
      newSub = new Interpreter.Execution.Substitution();
      newSub.Variable = currEq.Lhs;
      newSub.SubstitutionTerm = currEq.Rhs;
    }

    this.ComposeSubstitutions(mgu, newSub);
    for (var eqKey in currentProblem) {
      var eq = currentProblem[eqKey];
      eq.Lhs = eq.Lhs.ApplySubstitutions(mgu);
      eq.Rhs = eq.Rhs.ApplySubstitutions(mgu);
    }
  }

  nsMguCalculation.MguCalculation.prototype.ComposeSubstitutions = function (existingSubstitutions, newSubstitution) {
    var found = false;
    for (var subKey in existingSubstitutions) {
      var sub = existingSubstitutions[subKey];
      sub.SubstitutionTerm = sub.SubstitutionTerm.ApplySubstitutions([newSubstitution]);
      if (sub.Variable.toString() == sub.SubstitutionTerm.toString()) {
        delete existingSubstitutions[subKey];
      }
      else found = sub.Variable.toString() == newSubstitution.Variable.toString();
    }
    if (!found) existingSubstitutions.push(newSubstitution);
  }

  nsMguCalculation.MguCalculation.prototype.GetUnifier = function (termHead, matchTerm) {
    var initialEq = new Interpreter.Execution.Equation();
    initialEq.Lhs = termHead;
    initialEq.Rhs = matchTerm;
    return this.GetMgu(initialEq, matchTerm.GetVariables());
  }
}
