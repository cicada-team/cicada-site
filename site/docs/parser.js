/**
 * parse markdown to js object
 */
const FrontMatter = require('front-matter')
const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')
const slug = require('limax')

/**
 * highlight.js config
 * @param {*} str 
 * @param {*} lang 
 */
const highlight = (str, lang) => {
  if (lang != null && hljs.getLanguage(lang)) {
    try {
      const code = hljs.highlight(lang, str, true).value
      return `<pre class="hljs"><code>${code}</code></pre>`
    } catch (_error) {
      throw _error
    }
  }
  try {
    return hljs.highlightAuto(str).value
  } catch (_error) {
    throw _error
  }
}

const mdConfig = () => {
  const mdOptions = {
    html: true,
    linkify: true,
    typographer: true,
    highlight,
  }
  const anchorOptions = {
    slugify: string => slug(string),
  }
  const md = new MarkdownIt(mdOptions)
  /* eslint-disable */
  md.use(require('markdown-it-anchor'), anchorOptions)
  return md
}

const titleToUrl = (title) => {
  const dashedLowerCase = title.replace(/\s+/g, '-').toLowerCase()
  const url = slug(dashedLowerCase)
  return url
}

/**
 * Generate table of content for single file 
 * @param {*} string 
 */
const parserToc = (string) => {
  const regex = /<h2.*?id="([^"]*?)".*?>(.*?)<\/h2>/g
  let matched
  let res = []
  while ((matched = regex.exec(string)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matched.index === regex.lastIndex) {
      regex.lastIndex++
    }
    // matched is the object 
    const id = matched['1']
    const value = matched['2']
    const pair = {
      id: id,
      value: value,
    } 
    res.push(pair)
   }
  return res
}

const parseToObject = (data, fileName) => {
  if (data === undefined || data.length === 0) {
    return
  }
  const mdObject = FrontMatter(data)
  const body = mdObject.body
  // doc content and meta data
  const content = mdConfig().render(body)
  const meta = mdObject.attributes

  // add default title
  if (!('title' in meta)) {
    meta.title = fileName
  }
  // add default url
  if (!('url' in meta)) {
    meta.url = titleToUrl(meta.title)
  }
  // add default toc
  if (!('toc' in meta)) {
    meta.toc = parserToc(content)
  }
  // flaten the md object
  /* eslint-disable */
  const result = Object.assign({}, meta, { content });
  return result;
} 


// TODO edit on github
module.exports = parseToObject
