import React, { Component } from 'react'
import 'particles.js/particles'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import styles from './style.less'

const Sidebar = ({ toc = {} }) => {
  return (
    <div className={styles.sidebar}>
      <ul>
        {toc.map(item =>
          <li key={item.id} >
            <a href={`#${item.id}`}>{item.value}</a>
          </li>,
        )}
      </ul>
    </div>
  )
}

const Content = ({ content = '' }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
export default class Homepage extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }
  componentDidMount() {
  }
  componentDidUpdate() { }

  render() {
    const data = this.props.data
    console.log(data)
    return (
      <div className={styles.container}>
        <Helmet title="参与社区贡献"
          meta={[
            { name: 'keywords', content: 'contribution guide' },
          ]}
        />
        <Sidebar toc={data.toc} />
        <Content content={data.content} />
      </div>
    )
  }
}

