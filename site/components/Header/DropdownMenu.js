import React from 'react'
import PropTypes from 'prop-types'
import DropdownMenu from '../../ui-components/DropdownMenu'


export default class Menu extends React.Component {

  constructor(props) {
    super()
    this.state = {
      isMenuOpen: false,
      lists: props.lists,
      toggle: props.toggle,
    }
    const lists = props.lists
    this.changeField = {}
    lists.forEach((list) => {
      this.changeField[list] = this.onItemClick.bind(this, list)
    })
    this.onItemClick = this.onItemClick.bind(this)
  }
  static defaultProps = {
    lists: [],
    toggle: '',
  }

  static defaultPropTypes = {
    lists: PropTypes.array,
    toggle: PropTypes.string,
  }

  toggle = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  };

  close = () => {
    this.setState({ isMenuOpen: false })
  };

  onItemClick = (e) => {
    const toggleValue = e.target.innerHTML
    this.setState({
      toggle: toggleValue,
    })
  }

  render() {
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      toggle: <button type="button" onClick={this.toggle}>{this.state.toggle}</button>,
      align: 'center',
    }
    const lists = this.state.lists
    return (
      <DropdownMenu {...menuOptions}>
        {lists.map(list => (
          <li key={list}>
            <a onClick={this.onItemClick}>{list}</a>
          </li>
        ))}
      </DropdownMenu>
    )
  }
}
