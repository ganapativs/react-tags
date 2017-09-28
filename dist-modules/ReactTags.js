"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = require("react-dnd-html5-backend");

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _Suggestions = require("./Suggestions");

var _Suggestions2 = _interopRequireDefault(_Suggestions);

var _Tag = require("./Tag");

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Constants
var Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

var DefaultClassNames = {
    tags: 'ReactTags__tags',
    tagInput: 'ReactTags__tagInput',
    tagInputField: 'ReactTags__tagInputField',
    selected: 'ReactTags__selected',
    tag: 'ReactTags__tag',
    remove: 'ReactTags__remove',
    suggestions: 'ReactTags__suggestions',
    tagLabel: 'ReactTags__tagLabel'
};

var ReactTags = function (_React$Component) {
    _inherits(ReactTags, _React$Component);

    function ReactTags() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ReactTags);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactTags.__proto__ || Object.getPrototypeOf(ReactTags)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            suggestions: _this.props.suggestions,
            query: "",
            selectedIndex: -1,
            selectionMode: false
        }, _this.filteredSuggestions = function (query, suggestions) {
            if (_this.props.handleFilterSuggestions) {
                return _this.props.handleFilterSuggestions(query, suggestions);
            }

            return suggestions.filter(function (item) {
                return (Object.prototype.toString.call(item) === '[object Object]' ? item.text : item).toLowerCase().indexOf(query.toLowerCase()) === 0;
            });
        }, _this.handleDelete = function (i, e) {
            _this.props.handleDelete(i);
            _this.setState({ query: "" });
        }, _this.handleChange = function (e) {
            var str = e.target.value;
            while (str.indexOf("  ") !== -1) {
                str = str.replace(/  /g, " ");
            }
            if (str.indexOf(' ') === 0) {
                str = str.replace(/ /, "");
            }
            if (_this.props.handleInputChange) {
                _this.props.handleInputChange(str);
            }

            var query = str;
            var suggestions = _this.filteredSuggestions(query, _this.props.suggestions);
            var selectedIndex = _this.state.selectedIndex;
            // if our selected entry is gonna disappear, select the last entry we will have
            if (selectedIndex >= suggestions.length) {
                selectedIndex = suggestions.length - 1;
            }
            _this.setState({
                query: query,
                suggestions: suggestions,
                selectedIndex: selectedIndex
            });
        }, _this.handleBlur = function (e) {
            var value = e.target.value.trim();
            if (_this.props.handleInputBlur) {
                _this.props.handleInputBlur(value);
                _this.refs.input.value = "";
            }
        }, _this.handleKeyDown = function (e) {
            var _this$state = _this.state,
                query = _this$state.query,
                selectedIndex = _this$state.selectedIndex,
                suggestions = _this$state.suggestions;

            // hide suggestions menu on escape

            if (e.keyCode === Keys.ESCAPE) {
                e.preventDefault();
                e.stopPropagation();
                _this.setState({
                    selectedIndex: -1,
                    selectionMode: false,
                    suggestions: []
                });
            }

            // When one of the terminating keys is pressed, add current query to the tags.
            // If no text is typed in so far, ignore the action - so we don't end up with a terminating
            // character typed in.
            if (_this.props.delimiters.indexOf(e.keyCode) !== -1 && !e.shiftKey) {
                if (e.keyCode !== Keys.TAB || query !== "") {
                    e.preventDefault();
                }

                if (query !== "") {
                    if (_this.state.selectionMode && _this.state.selectedIndex != -1) {
                        query = _this.state.suggestions[_this.state.selectedIndex];
                    }
                    _this.addTag(query);
                }
            }

            // when backspace key is pressed and query is blank, delete tag
            if (e.keyCode === Keys.BACKSPACE && query == "" && _this.props.allowDeleteFromEmptyInput) {
                _this.handleDelete(_this.props.tags.length - 1);
            }

            // up arrow
            if (e.keyCode === Keys.UP_ARROW) {
                e.preventDefault();
                var selectedIndex = _this.state.selectedIndex;
                // last item, cycle to the top
                if (selectedIndex <= 0) {
                    _this.setState({
                        selectedIndex: _this.state.suggestions.length - 1,
                        selectionMode: true
                    });
                } else {
                    _this.setState({
                        selectedIndex: selectedIndex - 1,
                        selectionMode: true
                    });
                }
            }

            // down arrow
            if (e.keyCode === Keys.DOWN_ARROW) {
                e.preventDefault();
                _this.setState({
                    selectedIndex: (_this.state.selectedIndex + 1) % suggestions.length,
                    selectionMode: true
                });
            }
        }, _this.handlePaste = function (e) {
            e.preventDefault();

            // See: http://stackoverflow.com/a/6969486/1463681
            var escapeRegex = function escapeRegex(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            };

            // Used to determine how the pasted content is split.
            var delimiterChars = escapeRegex(_this.props.delimiters.map(function (delimiter) {
                // See: http://stackoverflow.com/a/34711175/1463681
                var chrCode = delimiter - 48 * Math.floor(delimiter / 48);
                return String.fromCharCode(96 <= delimiter ? chrCode : delimiter);
            }).join(''));

            var clipboardData = e.clipboardData || window.clipboardData;
            var string = clipboardData.getData('text');
            var regExp = new RegExp("[" + delimiterChars + "]+");
            string.split(regExp).forEach(function (tag) {
                return _this.props.handleInputChange ? _this.handleChange({ target: { value: string } }) : _this.props.handleAddition(tag);
            });
        }, _this.addTag = function (tag) {
            var input = _this.refs.input;

            if (_this.props.autocomplete) {
                var possibleMatches = _this.filteredSuggestions(tag, _this.props.suggestions);

                if (_this.props.autocomplete === 1 && possibleMatches.length === 1 || _this.props.autocomplete === true && possibleMatches.length) {
                    tag = possibleMatches[0];
                }
            }

            // call method to add
            _this.props.handleAddition(tag);

            // reset the state
            _this.setState({
                query: "",
                selectionMode: false,
                selectedIndex: -1
            });

            // focus back on the input box
            input.value = "";
            input.focus();
        }, _this.handleSuggestionClick = function (i, e) {
            _this.addTag(_this.state.suggestions[i]);
        }, _this.handleSuggestionHover = function (i, e) {
            _this.setState({
                selectedIndex: i,
                selectionMode: true
            });
        }, _this.moveTag = function (id, afterId) {
            var tags = _this.props.tags;

            // locate tags
            var tag = tags.filter(function (t) {
                return t.id === id;
            })[0];
            var afterTag = tags.filter(function (t) {
                return t.id === afterId;
            })[0];

            // find their position in the array
            var tagIndex = tags.indexOf(tag);
            var afterTagIndex = tags.indexOf(afterTag);

            // call handler with current position and after position
            _this.props.handleDrag(tag, tagIndex, afterTagIndex);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ReactTags, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.setState({
                classNames: _extends({}, DefaultClassNames, this.props.classNames)
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            if (this.props.autofocus && !this.props.readOnly) {
                this.refs.input.focus();
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(props) {
            var suggestions = this.filteredSuggestions(this.state.query, props.suggestions);
            this.setState({
                suggestions: suggestions,
                classNames: _extends({}, DefaultClassNames, props.classNames)
            });
        }
    }, {
        key: "render",
        value: function render() {
            var moveTag = this.props.handleDrag ? this.moveTag : null;
            var tagItems = this.props.tags.map(function (tag, i) {
                return _react2.default.createElement(_Tag2.default, { key: i,
                    tag: tag,
                    labelField: this.props.labelField,
                    onDelete: this.handleDelete.bind(this, i),
                    moveTag: moveTag,
                    removeComponent: this.props.removeComponent,
                    readOnly: this.props.readOnly,
                    classNames: this.state.classNames,
                    handleTagClick: this.props.handleTagClick });
            }.bind(this));

            // get the suggestions for the given query
            var query = this.state.query.trim(),
                selectedIndex = this.state.selectedIndex,
                suggestions = this.state.suggestions,
                placeholder = this.props.placeholder;

            var tagInput = !this.props.readOnly ? _react2.default.createElement(
                "div",
                { className: this.state.classNames.tagInput },
                _react2.default.createElement("input", { ref: "input",
                    className: this.state.classNames.tagInputField,
                    type: "text",
                    placeholder: placeholder,
                    "aria-label": placeholder,
                    onBlur: this.handleBlur,
                    value: this.state.query,
                    onChange: this.handleChange,
                    onKeyDown: this.handleKeyDown,
                    onPaste: this.handlePaste }),
                _react2.default.createElement(_Suggestions2.default, { query: query,
                    suggestions: suggestions,
                    selectedIndex: selectedIndex,
                    handleClick: this.handleSuggestionClick,
                    handleHover: this.handleSuggestionHover,
                    minQueryLength: this.props.minQueryLength,
                    shouldRenderSuggestions: this.props.shouldRenderSuggestions,
                    classNames: this.state.classNames })
            ) : null;

            return _react2.default.createElement(
                "div",
                { className: this.state.classNames.tags },
                _react2.default.createElement(
                    "div",
                    { className: this.state.classNames.selected },
                    tagItems,
                    this.props.inline && tagInput
                ),
                !this.props.inline && tagInput
            );
        }
    }]);

    return ReactTags;
}(_react2.default.Component);

ReactTags.propTypes = {
    tags: _propTypes2.default.array,
    placeholder: _propTypes2.default.string,
    labelField: _propTypes2.default.string,
    suggestions: _propTypes2.default.array,
    delimiters: _propTypes2.default.array,
    autofocus: _propTypes2.default.bool,
    inline: _propTypes2.default.bool,
    handleDelete: _propTypes2.default.func.isRequired,
    handleAddition: _propTypes2.default.func.isRequired,
    handleDrag: _propTypes2.default.func,
    handleFilterSuggestions: _propTypes2.default.func,
    allowDeleteFromEmptyInput: _propTypes2.default.bool,
    handleInputChange: _propTypes2.default.func,
    handleInputBlur: _propTypes2.default.func,
    minQueryLength: _propTypes2.default.number,
    shouldRenderSuggestions: _propTypes2.default.func,
    removeComponent: _propTypes2.default.func,
    autocomplete: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
    readOnly: _propTypes2.default.bool,
    classNames: _propTypes2.default.object,
    handleTagClick: _propTypes2.default.func
};
ReactTags.defaultProps = {
    placeholder: 'Add new tag',
    tags: [],
    suggestions: [],
    delimiters: [Keys.ENTER, Keys.TAB],
    autofocus: true,
    inline: true,
    allowDeleteFromEmptyInput: true,
    minQueryLength: 2,
    autocomplete: false,
    readOnly: false,
    handleTagClick: function handleTagClick() {}
};


module.exports = {
    WithContext: (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(ReactTags),
    WithOutContext: ReactTags,
    Keys: Keys
};