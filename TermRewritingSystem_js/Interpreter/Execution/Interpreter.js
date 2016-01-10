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
if (typeof (Interpreter.Execution.Interpreter) == "undefined") {

  var nsInterpreter = Interpreter.Execution;

  nsInterpreter.Interpreter = function (programBlock, nativeFunctions, customUnifiersCalculations) {
    if (nativeFunctions) this.nativeFunctions = nativeFunctions;
    else this.nativeFunctions = new Array();
    this.mguCalculation = new Interpreter.Execution.MguCalculation(customUnifiersCalculations);
    this.initialProgram = programBlock;
    var validator = new Interpreter.Validators.TrsProgramBlockValidator();
    validator.Validate(this.initialProgram);
    this.ValidationMessages = validator.ValidationMessages;
    var errCount = 0;
    for (var i = 0; i < this.ValidationMessages.length; i++) {
      if (this.ValidationMessages[i].MessageType == Interpreter.Execution.InterpreterMessageType.Error) {
        errCount++;
        break;
      }
    }
    this.hasErrors = (errCount > 0);
    this.rewritingTookPlace = true;
    this.ClassifyInput();
  }

  // Properties
  nsInterpreter.Interpreter.prototype.initialProgram = null;
  nsInterpreter.Interpreter.prototype.ValidationMessages = null;
  nsInterpreter.Interpreter.prototype.programRules = null; // array of TrsReductionRule
  nsInterpreter.Interpreter.prototype.executionCache = null; // array of InterpreterTerm
  nsInterpreter.Interpreter.prototype.typeChecker = null;
  nsInterpreter.Interpreter.prototype.hasErrors = false;
  nsInterpreter.Interpreter.prototype.rewritingTookPlace = true;
  nsInterpreter.Interpreter.prototype.nativeFunctions = null;
  nsInterpreter.Interpreter.prototype.mguCalculation = null;

  nsInterpreter.Interpreter.prototype.ClassifyInput = function () {
    this.executionCache = new Array();
    this.programRules = new Array();
    this.typeChecker = new Interpreter.Execution.InterpreterTypeChecker(this.initialProgram);
    for (var statementKey in this.initialProgram.Statements) {
      var statement = this.initialProgram.Statements[statementKey];
      if (statement instanceof Interpreter.Entities.Terms.TrsTermBase) {
        this.executionCache.push(new Interpreter.Execution.InterpreterTerm(statement));
      }
      else if (statement instanceof Interpreter.Entities.Terms.TrsReductionRule) {
        // All rules treated as term prodocuts to simplify rewriting
        var rule = statement;
        if (rule.Head instanceof Interpreter.Entities.Terms.TrsTermProduct) {
          this.programRules.push(rule);
        }
        else {
          this.programRules.push(new Interpreter.Entities.Terms.TrsReductionRule(
            new Interpreter.Entities.Terms.TrsTermProduct([rule.Head]),
            rule.Tail,rule.AstSource));
        }
      }
    }
  }

  nsInterpreter.Interpreter.prototype.GetCurrentRewriteResult = function () {
    var retVal = new Interpreter.Execution.InterpreterResult(this.initialProgram);
    var nsArrExt = Collections.ArrayExtensions;
    var nsTerms = Interpreter.Entities.Terms;
    nsArrExt.AddElements(retVal.Messages, this.ValidationMessages);
    nsArrExt.AddElements(retVal.ProgramOut.Statements, this.typeChecker.GetTypeDefinitions());
    nsArrExt.AddElements(retVal.ProgramOut.Statements, this.typeChecker.GetVariableMappings());
    for (var termKey in this.executionCache) {
      var term = this.executionCache[termKey];
      retVal.ProgramOut.Statements.push(term.RootTerm.CreateCopy());
    }
    for (var ruleKey in this.programRules) {
      var rule = this.programRules[ruleKey];
      // Term products of arity one must be turned back into normal terms
      if (rule.Head instanceof nsTerms.TrsTermProduct
        && rule.Head.TermList.length == 1) {
        retVal.ProgramOut.Statements.push(new nsTerms.TrsReductionRule(rule.Head.TermList[0], rule.Tail));
      }
      else {
        retVal.ProgramOut.Statements.push(rule.CreateCopy());
      }
    }
    return retVal;
  }

  nsInterpreter.Interpreter.prototype.ExecuteRewriteStep = function () {
    if (this.hasErrors || !this.rewritingTookPlace) return false;
    this.rewritingTookPlace = false;
    // Rewrite step
    if (this.executionCache.length > 0) {
      for (var ruleKey in this.programRules) {
        var rule = this.programRules[ruleKey];
        this.ApplyReductionRuleToCache(rule);
      }
      this.RemoveDuplicatesAndDeleted();
    }
    return this.rewritingTookPlace;
  }

  nsInterpreter.Interpreter.prototype.ExecuteRewriteForRule = function (termToRewrite, rule, composedUnifier) {
    var rewritingTookPlaceLocal = false;
    if (composedUnifier.Succeed) {
      if (rule.Tail instanceof Interpreter.Entities.Keywords.TrsNativeKeyword) {
        // Replacing term value with a native function generated value
        var nativeTermInHead = termToRewrite.CurrentSubTerm.CreateCopy().ApplySubstitutions(composedUnifier.Unifier);
        for (var nativeKey in this.nativeFunctions) {
          var native = this.nativeFunctions[nativeKey];
          var processedTerm = native.Evaluate(nativeTermInHead);
          if (!processedTerm) throw "Native function returned null or undefined";
          // If the rewrite result is the same, no rewriting took place ...
          if (nativeTermInHead.toString() != processedTerm.toString()) {
            var newTerm = termToRewrite.RootTerm.CreateCopyAndReplaceSubTerm(termToRewrite.CurrentSubTerm, processedTerm);
            rewritingTookPlaceLocal = true;
            var newTermWrapper = new Interpreter.Execution.InterpreterTerm(newTerm);
            newTermWrapper.IsNewTerm = true;
            this.executionCache.push(newTermWrapper);
          }
        }
      }
      else {
        // Normal rewriting without native eval functions
        var replacementTerm = rule.Tail.CreateCopy().ApplySubstitutions(composedUnifier.Unifier);
        if (termToRewrite.CurrentSubTerm.toString() != replacementTerm.toString()) {
          var newTerm = termToRewrite.RootTerm.CreateCopyAndReplaceSubTerm(termToRewrite.CurrentSubTerm, replacementTerm);
          rewritingTookPlaceLocal = true;
          var newTermWrapper = new Interpreter.Execution.InterpreterTerm(newTerm);
          newTermWrapper.IsNewTerm = true;
          this.executionCache.push(newTermWrapper);
        }
      }
    }
    if (rewritingTookPlaceLocal) {
      this.rewritingTookPlace = true; // stops rewriting on next rewrite step
      termToRewrite.CacheSourceTerm.MustDeletFromCache = true;
    }
  }

  nsInterpreter.Interpreter.prototype.ApplyReductionRuleToCache = function (rule) {
    // This data structure stores the Cartesian product used for term products
    // The length of each sub-List is the size of an alphabet for calculating a "Godel string" of terms.
    // This avoids the need for seperate sub-enumerators.
    var rewriteCandidates = new Array(); //List<List<InterpreterEvaluationTerm>>();

    // Populate the rewriteCandidates
    var ruleHead = rule.Head;
    var productLength = ruleHead.TermList.length;
    for (var termProductIndex = 0; termProductIndex < productLength; termProductIndex++) {
      rewriteCandidates.push(new Array()); // List<InterpreterEvaluationTerm>()
      for (var termInCacheKey in this.executionCache) {
        var termInCache = this.executionCache[termInCacheKey];
        // Do not rewrite new terms, we are doing one rewrite step at a time
        if (termInCache.IsNewTerm) continue;

        // Test all sub-terms
        var expantionStack = new Array(); // Stack<TrsTermBase>();
        expantionStack.push(termInCache.RootTerm);
        while (expantionStack.length > 0) {
          var current = expantionStack.pop();
          // Ignore the "variable only" case to avoid matching all rewrite rules to a sub-term.
          if (current instanceof Interpreter.Entities.Terms.TrsVariable) continue;
          // Type rules applied here
          var unifier = this.mguCalculation.GetUnifier(ruleHead.TermList[termProductIndex], current);
          // Note: Currently only one unification result expected.
          if (unifier.Succeed) {
            var passTypeCheck = true;
            for (var indexTypeCheck = 0; indexTypeCheck < unifier.Unifier.length; indexTypeCheck++) {
              var sub = unifier.Unifier[indexTypeCheck];
              passTypeCheck = passTypeCheck && this.typeChecker.IsSubstitutionValid(sub);
            }
            if (passTypeCheck) rewriteCandidates[termProductIndex].push(new Interpreter.Execution.InterpreterEvaluationTerm(termInCache.RootTerm, current, termInCache, unifier));
          }
          if (current instanceof Interpreter.Entities.Terms.TrsTerm) {
            for (var subTermKey in current.Arguments) {
              var subTerm = current.Arguments[subTermKey];
              expantionStack.push(subTerm);
            }
          }
        }
      }
    }

    // Execute rewite step ... iterate over cartesian term product
    // This iterationCount variable will prevent rewriting in the case where any of the lists are empty
    var iterationCount = rewriteCandidates[0].length;
    for (var termListIndex = 1; termListIndex < rewriteCandidates.length; termListIndex++) {
      var termList = rewriteCandidates[termListIndex];
      iterationCount *= termList.length;
    }
    var matchTupple = new Array();
    for (var tuppleNumber = 0; tuppleNumber < iterationCount; tuppleNumber++) {
      var currDiv = tuppleNumber;
      var currentUnifier = null;
      var testUnifier = null;
      matchTupple.length = 0;
      // In order to do a substitution, all variables must bind to the same values across the tupple members
      for (var termColumn = 0; termColumn < rewriteCandidates.length; termColumn++) {
        var currMod = currDiv % rewriteCandidates[termColumn].length;
        currDiv = Math.floor(currDiv / rewriteCandidates[termColumn].length);
        var targetTerm = rewriteCandidates[termColumn][currMod];
        currentUnifier = targetTerm.Unifier;
        if (testUnifier == null) testUnifier = currentUnifier;
        matchTupple.push(targetTerm);
      }
      var unifiers = new Array();
      for (var unifKey in matchTupple) {
        var unif = matchTupple[unifKey].Unifier;
        unifiers.push(unif);
      }
      var termProductUnifier = this.ComposeUnifiers(unifiers);
      if (termProductUnifier.Succeed) {
        for (var termKey in matchTupple) {
          var term = matchTupple[termKey];
          this.ExecuteRewriteForRule(term, rule, termProductUnifier);
        }
      }
    }
  }

  nsInterpreter.Interpreter.prototype.ComposeUnifiers = function (unifierList) {
    if (unifierList.length == 1) return unifierList[0];
    var retVal = new Interpreter.Execution.UnificationResult();
    var composedUnifier = new Object(); //Dictionary, Key = TrsVariable, Value = TrsTermBase
    for (var unifierKey in unifierList) {
      var unifier = unifierList[unifierKey];
      for (var substitutionKey in unifier.Unifier) {
        var substitution = unifier.Unifier[substitutionKey];
        var subValue = null;
        if (!composedUnifier[substitution.Variable])
        {
          composedUnifier[substitution.Variable] = {
            Key: substitution.Variable,
            Value: substitution.SubstitutionTerm
          };
        }
        else {
          var subValue = composedUnifier[substitution.Variable].Value;
          if (subValue.toString() != substitution.SubstitutionTerm.toString()) {
            // Conflicting mapping found.
            retVal.Succeed = false;
            return retVal;
          }
        }
      }
    }
    retVal.Succeed = true;
    retVal.Unifier = new Array(); // of substitution
    for (var key in composedUnifier) {
      var pair = composedUnifier[key];
      var newSub = new Interpreter.Execution.Substitution();
      newSub.Variable = pair.Key;
      newSub.SubstitutionTerm = pair.Value;
      retVal.Unifier.push(newSub);
    }
    return retVal;
  }

  nsInterpreter.Interpreter.prototype.RemoveDuplicatesAndDeleted = function () {
    var uniqueSet = new Collections.HashSet();
    for (var cacheKey in this.executionCache) {
      var cacheTerm = this.executionCache[cacheKey];
      if (!cacheTerm.MustDeletFromCache) uniqueSet.AddElements([cacheTerm.RootTerm]);
    }
    this.executionCache.length = 0;
    for (var cacheKey in uniqueSet) {
      if (!uniqueSet.hasOwnProperty(cacheKey) || (uniqueSet[cacheKey] instanceof Function)) continue;
      var term = uniqueSet[cacheKey];
      var newElement = new Interpreter.Execution.InterpreterTerm(term);
      this.executionCache.push(newElement);
    }
  }

  nsInterpreter.Interpreter.prototype.ClearExecutionCache = function () {
    this.rewritingTookPlace = true; // this must be set to true to allow rewriting to take place. When is is false, the interpreter assumes that nothing further can be done.
    this.executionCache.length = 0;
  }

  nsInterpreter.Interpreter.prototype.LoadTerms = function (terms) {
    for (var termKey in terms) {
      var term = terms[termKey];
      this.executionCache.push(new Interpreter.Execution.InterpreterTerm(term));
    }
  }

  nsInterpreter.Interpreter.prototype.GetTypeChecker = function () {
    return this.typeChecker;
  }
}
