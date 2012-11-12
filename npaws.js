#!/usr/bin/env node

(function(){
   
   /* Bytecode */
   function GetLocals() {
      this.type = 'locals' }
   function Juxtapose() {
      this.type = 'juxtapose' }
   function Scope(contents) {
      this.type = 'scope'
      this.contents = contents }
   function Label(string) {
      this.type = 'label'
      this.contents = string }
   
   /* Parsing */
   function parse(text) { var i = 0
      , character = function(c){ return text[i] === c && ++i }
      , whitespace = function(){ while (character(' ')); return true }
      , bracket = function(begin, end) { var result
         return whitespace() && character(begin) && (result = expr()) &&
                whitespace() && character(end) &&
                result }
      
      , paren = function() {
         return bracket('(', ')') }
      , scope = function() { var result
         return (result = bracket('{', '}')) && [new Scope(result)] }
      , label = function(){ whitespace(); var result = ''
           while ( text[i] && /[^(){} ]/.test(text[i]) )
              result = result.concat(text[i++])
           return result && [new Label(result)] }
      
      , expr = function(){ var term, result = [new GetLocals()]
         while (term = paren() || scope() || label())
            result = result.concat(term).concat(new Juxtapose())
         return result }
      
      return expr() }
   
   console.log(parse('hi (a b c) {c d f (a b)}'))
})();