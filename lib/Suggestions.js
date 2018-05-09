import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { isEqual } from 'lodash';

const maybeScrollSuggestionIntoView  = (suggestionEl, suggestionsContainer) => {
  const containerHeight = suggestionsContainer.offsetHeight
  const suggestionHeight = suggestionEl.offsetHeight
  const relativeSuggestionTop = suggestionEl.offsetTop - suggestionsContainer.scrollTop

  if (relativeSuggestionTop + suggestionHeight  >= containerHeight) {
    suggestionsContainer.scrollTop += (relativeSuggestionTop - containerHeight) + suggestionHeight
  }
  else if (relativeSuggestionTop < 0) {
    suggestionsContainer.scrollTop += relativeSuggestionTop
  }
}

const markIt = (input, query) => {
  const escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  return {
    __html: input.replace(RegExp(escapedRegex, "gi"), "<mark>$&</mark>")
  }
}

class Suggestions extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    suggestions: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    handleHover: PropTypes.func.isRequired,
    minQueryLength: PropTypes.number,
    shouldRenderSuggestions: PropTypes.func,
    classNames: PropTypes.object,
    suggestionsRenderer: PropTypes.func
  };

  static defaultProps = {
    suggestionsRenderer: (item, query) => {
      const m = markIt(Object.prototype.toString.call(item) === '[object Object]' ? item.text : item, query)
      return <Fragment>
        <span dangerouslySetInnerHTML={ m } />
        {
          Object.prototype.toString.call(item) === '[object Object]' && item.addon
            ?
              <span style={{color: '#aaa', fontSize: '75%', float: 'right', marginTop: 4}}>{item.addon}</span>
            :
              null
        }
      </Fragment>;
    }
  }

  shouldComponentUpdate = nextProps => {
    const { props } = this;
    const shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
    return !isEqual(this.props.suggestions, nextProps.suggestions) || shouldRenderSuggestions(props.query);
  }

  componentDidUpdate = prevProps => {
    const suggestionsContainer = this.refs.suggestionsContainer
    if (suggestionsContainer && prevProps.selectedIndex !== this.props.selectedIndex) {
      const activeSuggestion = suggestionsContainer.querySelector('.active')

      if (activeSuggestion) {
        maybeScrollSuggestionIntoView(activeSuggestion, suggestionsContainer)
      }
    }
  }

  shouldRenderSuggestions = (query) => {
    const { props } = this;
    const minQueryLength = props.minQueryLength || 2;
    return (props.query.length >= minQueryLength);
  }

  render = () => {
    const { props } = this;
    const suggestions = props.suggestions.map(function (item, i) {
      return (
          <li key={i}
              onMouseDown={props.handleClick.bind(null, i) }
              onMouseOver={props.handleHover.bind(null, i) }
              className={i == props.selectedIndex ? "active" : ""}>
            {props.suggestionsRenderer(item, props.query)}
          </li>
      )
    }.bind(this));

    // use the override, if provided
    const shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
    if (suggestions.length === 0 || !shouldRenderSuggestions(props.query)) {
      return null;
    }

    return (
        <div ref="suggestionsContainer" className={this.props.classNames.suggestions}>
          <ul> { suggestions } </ul>
        </div>
    )
  }
}

export default Suggestions;
