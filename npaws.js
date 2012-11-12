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
   Thing.prototype.handler = new Execution(function(value) { /*
      for (var i = 0; i < this.properties.length; i++) {
         if (this.properties[i].key.string === value.string) return this.members[i].value }
      return null; */ })
   Execution.prototype.handler = new Execution(function(value) {
      })
   
   /* Staging */
   Stage = {}
   Stage.queue = []
   
   function Staging(stagee, value) {
      this.stagee = stagee
      this.value = value }
   
   Stage.stage = function(stagee, value) {
      Stage.queue.push(new Staging(stagee, value)) }
   
   Stage.next = function() {
      var staging = Stage.queue.shift()
      if (staging.stagee.native) {
         staging.execution.native(staging.value) }
      else if (staging.execution.handler.native) {
         staging.execution.handler.native(staging.value) } }
      
   /* Wrap it all up */
   function run(text) {
      stage(new Execution(parse(text)), null)
      while (queue.length > 0) {
         Stage.next() } }
   
   /* Testing */
   var print = new Execution(function(label) { console.log(label.string) })
   Stage.stage(print, new Label('hi'))
   Stage.next()
   
})();