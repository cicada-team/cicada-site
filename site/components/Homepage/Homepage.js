import React, { Component } from 'react'
import 'particles.js/particles'
import { Helmet } from 'react-helmet'
import styles from './style.less'

export default class Homepage extends Component {
  constructor(props) {
    super()
    this.state = {
      content: props.content,
    }
  }
  /*eslint-disable */
  initParticlesjs() {
    if (document.getElementById("particles-js") !== undefined) {
      const Particlesjs = window.particlesJS;
      // CAUTION 2nd argurment is the public path base on the index.html (setting in webpack config), which is executed in the browser
      Particlesjs.load("particles-js", "./assets/particles.json", () => {
      });
    }
  }

  componentDidMount() {
    // init particles.js
    this.initParticlesjs();
  }
  componentDidUpdate() { }

  render() {
    return (
      <div className={styles.container}>
        <Helmet title="Cicada Homepage" 
          meta={[
            { name: 'keywords', content: 'cicada engine' },
          ]}
        />
        <section className={styles.bg}>
          <div className={styles.star}>
            <object data="/assets/star.svg" type="image/svg+xml" />
          </div>
          <div className={styles.circle}>
            <object className={styles.rotate} data="/assets/circle-2.svg" type="image/svg+xml" />
          </div>
          <div className={styles.welcome}>
            <div className={styles.center}>
              <h1>金蝉，一个声明式组件渲染框架</h1>
              <h1>Declarative React Framework</h1>
            </div>
            <div className={styles.center}>
              <button className={styles.topButton}>开始使用</button>
            </div>
          </div>
          <div id="particles-js" className={styles.particles} />

        </section>
        <section className={styles.lightSection}>
          <div className={styles.svgLeft}>
            <object data="/assets/hp-section1.svg" type="image/svg+xml" />
          </div>
          <div className={styles.svgIntroRight} >
            <div className={styles.sectionTitle}>强大的引擎</div>
            <div className={styles.sectionIntro}>为开发性能和效率提供了夯实的基础</div>
            <button className={styles.button}>查看</button>
          </div>
        </section>
        <section className={styles.greySection}>
          <div className={styles.svgIntroLeft} >
            <div className={styles.sectionTitle}>重新定义组件规范</div>
            <div className={styles.sectionIntro}>声明式的组件为复杂的应用场景提供了更多操作的可能性</div>
            <button className={styles.button}>查看</button>
          </div>
          <div className={styles.svgRight}>
            <object data="/assets/hp-section2.svg" type="image/svg+xml" />
          </div>
        </section>
        <section className={styles.lightSection}>
          <div className={styles.svgLeft}>
            <object data="/assets/hp-section3.svg" type="image/svg+xml" />
          </div>
          <div className={styles.svgIntroRight} >
            <div className={styles.sectionTitle}>充实插件市场</div>
            <div className={styles.sectionIntro}>提供诸如表单验证，国际化的功能，减少代码工作量，为扩展提供更多可能性</div>
            <button className={styles.button}>查看</button>
          </div>
        </section>

      </div>
    )
  }
}

