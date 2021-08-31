const fs = require('fs')
const path = require('path')

function isProd () {
  const env = process.env.NODE_ENV
  return env === 'production' || env === 'prod'
}

function deleteDir (dir) {
  const children = fs.readdirSync(dir)
  for (const child of children) {
    const cPath = path.join(dir, child)
    const cStat = fs.statSync(cPath)
    if (cStat.isDirectory()) {
      deleteDir(cPath)
    } else {
      fs.unlinkSync(cPath)
    }
  }
  fs.rmdirSync(dir)
}

function preUrl (baseRouterPrefix, route) {
  let { url } = route

  if (url.indexOf(baseRouterPrefix) === 0) {
    url = url.substr(baseRouterPrefix.length)
  }

  return url
}

module.exports = async function (smallify, opts) {
  if (isProd()) {
    smallify.$log.info('skipping the generate .md docs')
    return
  }

  const oDir = path.join(process.cwd(), opts.dir || 'apis')
  const mPath = path.join(oDir, 'README.md')
  const mTitle = opts.title || 'API Docs'
  const cWriter = opts.customWriter

  if (fs.existsSync(oDir)) {
    deleteDir(oDir)
  }
  fs.mkdirSync(oDir)
  fs.writeFileSync(mPath, `# ${mTitle} \r\n\r\n`)

  smallify.addHook('onRoute', function (route) {
    const md = route.markdown || route.md

    if (!md) {
      return
    }

    const url = preUrl(smallify.$root.$routePrefix, route)

    let fName = url.replace(/\//g, '.')
    fName = fName.replace(/.:/g, '.@')

    if (fName.indexOf('.@') === 0) {
      fName = fName.substr(1)
    }

    const aPath = path.join(oDir, `${fName}.md`)
    const rPath = aPath.replace(oDir, '.')

    if (fs.existsSync(aPath)) {
      return
    }

    fs.writeFileSync(aPath, `# ${md.name || 'unknown'} \r\n\r\n`)
    fs.appendFileSync(aPath, `${md.description || md.desc || ''} \r\n\r\n`)

    // route options
    fs.appendFileSync(aPath, '## Options \r\n\r\n')
    fs.appendFileSync(aPath, `- \`URL\`: ${url} \r\n`)
    fs.appendFileSync(aPath, `- \`method\`: ${route.method} \r\n\r\n`)

    if (cWriter) {
      cWriter(aPath)
    }

    // beanify-ajv beanify-url
    const schema = route.schema
    if (schema) {
      if (schema.params) {
        fs.appendFileSync(aPath, '## Params \r\n\r\n')
        fs.appendFileSync(aPath, '```json\r\n')
        fs.appendFileSync(aPath, JSON.stringify(schema.params, null, '  '))
        fs.appendFileSync(aPath, '\r\n```\r\n\r\n')
      }

      if (schema.query) {
        fs.appendFileSync(aPath, '## Query \r\n\r\n')
        fs.appendFileSync(aPath, '```json\r\n')
        fs.appendFileSync(aPath, JSON.stringify(schema.query, null, '  '))
        fs.appendFileSync(aPath, '\r\n```\r\n\r\n')
      }

      if (schema.body) {
        fs.appendFileSync(aPath, '## Body \r\n\r\n')
        fs.appendFileSync(aPath, '```json\r\n')
        fs.appendFileSync(aPath, JSON.stringify(schema.body, null, '  '))
        fs.appendFileSync(aPath, '\r\n```\r\n\r\n')
      }

      if (schema.response) {
        fs.appendFileSync(aPath, '## Response \r\n\r\n')
        fs.appendFileSync(aPath, '```json\r\n')
        fs.appendFileSync(aPath, JSON.stringify(schema.response, null, '  '))
        fs.appendFileSync(aPath, '\r\n```\r\n\r\n')
      }
    }

    fs.appendFileSync(mPath, `- [${md.name}](${rPath.replace(/\\/g, '/')})\r\n`)
  })
}
