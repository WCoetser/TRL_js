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
if (typeof (Interpreter.Entities.AstToTrsConverterExtensions) == "undefined") {

  // Static class
  Interpreter.Entities.AstToTrsConverterExtensions = {};

  Interpreter.Entities.AstToTrsConverterExtensions.Convert = function (astIn) {
    if (astIn instanceof Parser.AbstractSyntaxTree.Keywords.AstNativeKeyword) {
      return new Interpreter.Entities.Keywords.TrsNativeKeyword(astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstConstant) {
      var token = astIn.AtomName;
      return new Interpreter.Entities.Terms.TrsConstant(token.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstNumber) {
      var token = astIn.Number;
      return new Interpreter.Entities.Terms.TrsNumber(token.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstString) {
      var token = astIn.StringContent;
      return new Interpreter.Entities.Terms.TrsString(token.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstTermProduct) {
      var termList = new Array();
      for (var i = 0; i < astIn.TermList.length; i++) {
        termList.push(Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.TermList[i]));
      }
      return new Interpreter.Entities.Terms.TrsTermProduct(termList, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionTerm) {
      var typeList = new Array();
      for (var i = 0; i < astIn.SubTypeArgumentNames.length; i++) {
        typeList.push(Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.SubTypeArgumentNames[i]));
      }
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTerm(astIn.TermName.GetTokenString(), typeList, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionVariable) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionVariable(astIn.VariableName.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstTerm) {
      var tokenTermName = astIn.TermName;
      var args = new Array();
      for (var i = 0; i < astIn.TermArguments.Arguments.length; i++) {
        args.push(Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.TermArguments.Arguments[i]));
      }
      return new Interpreter.Entities.Terms.TrsTerm(tokenTermName.GetTokenString(), args, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstVariable) {
      var token = astIn.VariableName;
      return new Interpreter.Entities.Terms.TrsVariable(token.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.Terms.AstReductionRule) {
      var head = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.Head);
      var tail = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.Tail);
      return new Interpreter.Entities.Terms.TrsReductionRule(head, tail, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.AstProgramBlock) {
      var trsProgramBlock = new Interpreter.Entities.TrsProgramBlock(astIn);
      for (var i = 0; i < astIn.Statements.length; i++) {
        var converted = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.Statements[i]);
        trsProgramBlock.Statements.push(converted);
      }
      return trsProgramBlock;
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionName) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionTypeName(astIn.TermName.GetTokenString(), astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionStatement) {
      var convertedTypeName = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.TypeName);
      var condidateTerms = new Array();
      for (var i = 0; i < astIn.CandidateTerms.length; i++) {
        var convCandidate = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.CandidateTerms[i]);
        condidateTerms.push(convCandidate);
      }
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinition(convertedTypeName, condidateTerms, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstLimitStatement) {
      var argVars = new Array();
      for (var i = 0; i < astIn.Variables.length; i++) {
        var convertedArg = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.Variables[i]);
        argVars.push(convertedArg);
      }
      var convTypeName = Interpreter.Entities.AstToTrsConverterExtensions.Convert(astIn.TypeName);
      return new Interpreter.Entities.TypeDefinitions.TrsLimitStatement(argVars, convTypeName, astIn);
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionConstant) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionConstant(astIn.SourceToken.GetTokenString());
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionNumber) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionNumber(astIn.SourceToken.GetTokenString());
    }
    else if (astIn instanceof Parser.AbstractSyntaxTree.TypeDefinitions.AstTypeDefinitionString) {
      return new Interpreter.Entities.TypeDefinitions.TrsTypeDefinitionString(astIn.SourceToken.GetTokenString());
    }
  }

}
