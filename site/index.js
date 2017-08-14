import React from 'react'
import ReactDOM from 'react-dom'
import connect from '@cicada/render/lib/connect'
import { mapValues } from '@cicada/render/lib/util'
import Render from '@cicada/render/lib/Render'
import { BrowserRouter, HashRouter, Route } from 'react-router-dom'
import createStateTree from '@cicada/render/lib/createStateTree'
import createAppearance from '@cicada/render/lib/createAppearance'
import createBackground from '@cicada/render/lib/createBackground'
import applyStateTreeSubscriber from '@cicada/render/lib/applyStateTreeSubscriber'
import * as businessBackground from '@cicada/render/lib/background/utility/business'
import * as validationBackground from '@cicada/render/lib/background/utility/validation'
import * as stateTreeBackground from '@cicada/render/lib/background/utility/stateTree'
import * as appearanceBackground from '@cicada/render/lib/background/utility/appearance'
import * as listenerBackground from '@cicada/render/lib/background/utility/listener'
import * as mapBackgroundToStateJob from '@cicada/render/lib/background/job/mapBackgroundToState'
import * as visibleJob from '@cicada/render/lib/background/job/visibility'
import * as interpolationJob from '@cicada/render/lib/background/job/interpolation'

import * as Homepage from './components/Homepage'
import * as LandingPage from './components/LandingPage'
import * as Doc from './components/Doc'
import * as Blog from './components/Blog'
import * as Api from './components/Api'
import * as SnippetPlayground from './components/SnippetPlayground'
import * as Contribution from './components/Contribution'
import Layout from './components/Layout/Layout'

// load json data
import docJson from './docs/output/doc/doc.json'
import docCatJson from './docs/output/doc/doc-Catalog.json'
import blogJson from './docs/output/blog/blog.json'
import apiJson from './docs/output/api/api.json'
import apiCatalog from './docs/output/api/api-Catalog.json'
import contributionJson from './docs/output/common/common.json'

import * as Test from './components/Test'
import './styles/base.less'
// load code samples
import demo from './config/demos'

const C = mapValues({
  Homepage,
  Doc,
  Blog,
  SnippetPlayground,
  Api,
  Test,
  LandingPage,
  Contribution,
},
  connect)

const stateTree = applyStateTreeSubscriber(createStateTree)()
const appearance = createAppearance()

window.stateTree = stateTree

const background = createBackground(
  {
    utilities: {
      validation: validationBackground,
      stateTree: stateTreeBackground,
      appearance: appearanceBackground,
      business: businessBackground,
      listener: listenerBackground,
    },
    jobs: {
      mapBackgroundToState: mapBackgroundToStateJob,
      visible: visibleJob,
      interpolation: interpolationJob,
    },
  },
  stateTree,
  appearance,
)


const DocComp = ({ match }) => {
  function getContent(title) {
    if (title === '') return { content: '', toc: [], githubLink: '' }
    // const doc = JSON.parse(docJson[title])
    const doc = docJson[title]
    const content = {
      title: doc.title,
      content: doc.content,
      toc: doc.toc,
      githubLink: doc.githubLink,
    }
    return content
  }
  function changeContent({ state }) {
    stateTree.set('doc.main', getContent(state.value))
  }
  const sideBar = docCatJson
  const title = match.params.title || 'kai1-shi3-zhi1-qian2'
  const content = getContent(title)
  console.log(content)
  return (
    <C.Doc
      bind="doc"
      getInitialState={() => ({
        sideBar,
        main: content,
      })}
      listeners={{ onTitleClick: { fns: [{ fn: changeContent }] } }}
    />
  )
}
const ApiComp = ({ match }) => {
  function getContent(title) {
    if (title === '') return { content: '', toc: [] }
    const api = JSON.parse(apiJson[title])
    const content = {
      content: api.content,
      toc: api.toc,
    }
    return content
  }
  function changeContent({ state }) {
    stateTree.set('api.main', getContent(state.value))
  }
  const sideBar = apiCatalog
  const title = match.params.title || ''
  const content = getContent(title)
  return (
    <C.Api
      bind="api"
      getInitialState={() => ({
        sideBar,
        main: content,
      })}
      listeners={{ onTitleClick: { fns: [{ fn: changeContent }] } }}
    />
  )
}

const HomePageComp = () => {
  return <C.Homepage getInitialState={() => ({})} />
}
const BlogComp = () => {
  const blog = blogJson
  return <C.Blog getInitialState={() => ({ posts: blog })} />
}

const ContributeComp = () => {
  const data = contributionJson['can1-yu3-gong4-xian4']
  return <C.Contribution getInitialState={() => ({ data })} />
}
const SnippetPlaygroundComp = () => {
  return <C.SnippetPlayground getInitialState={() => ({ code: demo.EchoInput })} />
}
const TestComp = () => {
  return (
    <C.Test />
  )
}
ReactDOM.render(
  <HashRouter >
    <Layout>
      <Render
        stateTree={stateTree}
        appearance={appearance}
        background={background}
      >
        <div>
          <Route exact path="/" component={HomePageComp} />
          <Route path="/docs/:title?" component={DocComp} />
          <Route path="/blog" component={BlogComp} />
          <Route path="/api/:title?" component={ApiComp} />
          <Route path="/examples" component={SnippetPlaygroundComp} />
          <Route path="/contribution" component={ContributeComp} />
          <Route path="/something-exciting" component={C.LandingPage} />
          <Route path="/test" component={TestComp} />
        </div>
      </Render>
    </Layout>
  </HashRouter>,
  document.getElementById('root'),
)
