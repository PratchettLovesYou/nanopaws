#!/usr/bin/env node

(function(){
   
   /* Things */
   function Thing() {
      this.members = [] }
   function Execution(code) {
      Thing.call(this)
      if (typeof code === 'function') {
         this.native = code }
      else {
         this.code = code
         this.stack = []
         this.locals = new Thing() } }
   function Label(string) {
      Thing.call(this)
      this.string = string }
   
   Thing.prototype.handler = function(argument) {
      for (var i = 0; i < this.properties.length; i++) {
         if (this.properties[i].key.string === argument.string) return this.members[i].value }
      return null; }
   
   /* Bytecode */
   function GetLocals() {
      this.type = 'locals' }
   function Juxtapose() {
      this.type = 'juxtapose' }
   function Value(contents) {
      this.type = 'value'
      this.contents = contents }
   
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
         return (result = bracket('{', '}')) && [new Value(new Execution(result))] }
      , label = function(){ whitespace(); var result = ''
           while ( text[i] && /[^(){} ]/.test(text[i]) )
              result = result.concat(text[i++])
           return result && [new Value(new Label(result))] }
      
      , expr = function(){ var term, result = [new GetLocals()]
         while (term = paren() || scope() || label())
            result = result.concat(term).concat(new Juxtapose())
         return result }
      
      return expr() }
   
   /* Execution */
      
   /* TODO */
      
   /* Staging */
      
   /* TODO */
      
   /* Wrap it all up */
      
   function run(text) {
      /* TODO */ }
   
   console.log(parse('hi (a b c) {c d f (a b)}'))
})();