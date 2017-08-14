import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import utils from './util'
import styles from './style.less'

let timeInterval = null
export default class LandingPage extends React.Component {
  constructor(props) {
    super()
    this.state = {
      deadline: props.deadline,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  static propTypes = {
    deadline: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const deadline = new Date(Date.parse(new Date()) + (15 * 24 * 60 * 60 * 1000))
    const updateClock = () => {
      const t = utils.getTimeRemaining(deadline)
      this.setState({
        days: t.days,
        hours: (`0${t.hours}`).slice(-2),
        minutes: (`0${t.minutes}`).slice(-2),
        seconds: (`0${t.seconds}`).slice(-2),
      })
      if (t.total <= 0) clearInterval(timeInterval)
    }
    updateClock()
    timeInterval = setInterval(updateClock, 1000)
  }
  componentWillUnmount() {
    clearInterval(timeInterval)
  }

  render() {
    return (
      <div className={styles.container}>
        <Helmet title="期待更多: 金蝉 IDE" />
        <div className={styles.main}>
          <div className={styles.intro} >
            <h1>敬起期待</h1>
          </div>
          <div className={styles.clock}>
            <div className={styles.clockItem}>
              <div className={styles.day}>{this.state.days}</div>
              <div className={styles.smalltext}>Days</div>
            </div>
            <div className={styles.clockItem}>
              <div >{this.state.hours}</div>
              <div>Hours</div>
            </div>
            <div className={styles.clockItem}>
              <div >{this.state.minutes}</div>
              <div >Minutes</div>
            </div>
            <div className={styles.clockItem}>
              <div>{this.state.seconds}</div>
              <div>Seconds</div>
            </div>
          </div>
          <div className={styles.subscribe}>
            <div>Subscribe</div>
            <span>邮箱<input type="text" /></span>
            <button>订阅</button>
          </div>
        </div>
      </div>
    )
  }
}
