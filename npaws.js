#!/usr/bin/env node

//(function(){
   
   /* Things */
   Thing = function() {
      this.members = [] }
   Execution = function(code) {
      Thing.call(this)
      if (typeof code === 'function') {
         this.native = code }
      else {
         this.code = code
         this.stack = []
         this.locals = new Thing() } }
   Label = function(text) {
      Thing.call(this)
      this.text = text }
   Association = function(key, value) {
      this.key = key
      this.value = value }
      
   /* Bytecode */
   GetLocals = function() {
      this.type = 'locals' }
   Juxtapose = function() {
      this.type = 'juxtapose' }
   Value = function(contents) {
      this.type = 'value'
      this.contents = contents }
   
   /* Parsing */
   parse = function(text) { var i = 0
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
   Thing.prototype.handler = new Execution(function(left, right, context) {
      for (var i = 0; i < left.members.length; i++) {
         if (left.members[i].key.text === right.text) { Stage.stage(context, left.members[i].value) } }
         return null; })
   Execution.prototype.handler = new Execution(function(left, right, context) { var instruction
      if (left.code) {
         left.stack.push(right)
         while (left.code.length > 0) { instruction = left.code.shift()
            switch (instruction.type) {
               case 'locals':
                  left.stack.push(left.locals);
               break; case 'value':
                  left.stack.push(instruction.contents);
               break; case 'juxtapose':
                  var b = left.stack.pop()
                    , a = left.stack.pop()
                  Stage.stage(a, b, left)
                  return } } } })
   
   /* Staging */
   Stage = {}
   Stage.queue = []
   
   Staging = function(stagee, value, context) {
      this.stagee = stagee
      this.value = value
      this.context = context }
   
   Stage.stage = function(stagee, value, context) {
      Stage.queue.push(new Staging(stagee, value, context)) }
   
   Stage.next = function() {
      var staging = Stage.queue.shift()
      if (staging.stagee.native) {
         staging.stagee.native(staging.value, staging.context) }
      else if (staging.stagee.handler.native) {
         staging.stagee.handler.native(staging.stagee, staging.value, staging.context) } }
      
   /* Wrap it all up */
   run = function(text) { var execution = new Execution(parse(text))
      execution.locals.members.push(new Association(new Label('print'), new Execution(function(label) {
         console.log(label.text) })))
      Stage.stage(execution, null)
      while (Stage.queue.length > 0) {
         Stage.next() } }
   
   /* Testing */
   
   run('print asdf')
   
   /*t = new Thing()
   t.members.push(new Association(new Label('hi'), new Label('hello')))
   console.log(t.handler.native(t, new Label('hi')))*/
   
//})();