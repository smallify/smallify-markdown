const Smallify = require('smallify')

const smallify = Smallify({
  pino: {
    level: 'debug',
    prettyPrint: true
  }
})

smallify.register(require('./index'), {
  dir: '.out-normal'
})

smallify.route({
  url: '/test',
  method: 'GET',
  schema: {
    body: {
      type: 'object'
    },
    query: {
      type: 'object'
    },
    params: {
      type: 'object'
    },
    response: {
      type: 'object'
    }
  },
  markdown: {
    name: 'test',
    desc: 'test desc'
  },
  async handler (req) {}
})

smallify.route({
  url: '/:math/add',
  method: 'GET',
  schema: {
    body: {
      type: 'object'
    },
    query: {
      type: 'object'
    },
    params: {
      type: 'object'
    },
    response: {
      type: 'object'
    }
  },
  markdown: {
    name: 'math',
    desc: 'math desc'
  },
  async handler (req) {}
})
