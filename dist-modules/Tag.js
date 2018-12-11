"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

var _lodash = require("lodash.flow");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemTypes = { TAG: "tag" };

var tagSource = {
  beginDrag: function beginDrag(props) {
    return { id: props.tag.id };
  },
  canDrag: function canDrag(props) {
    return props.moveTag && !props.readOnly;
  }
};

var tagTarget = {
  hover: function hover(props, monitor) {
    var draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      props.moveTag(draggedId, props.tag.id);
    }
  },
  canDrop: function canDrop(props) {
    return !props.readOnly;
  }
};

var dragSource = function dragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

var dropCollect = function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

var Tag = function (_Component) {
  _inherits(Tag, _Component);

  function Tag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tag.__proto__ || Object.getPrototypeOf(Tag)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this2 = _this,
          props = _this2.props;

      var label = props.tag[props.labelField];
      var connectDragSource = props.connectDragSource,
          isDragging = props.isDragging,
          connectDropTarget = props.connectDropTarget,
          readOnly = props.readOnly,
          handleTagClick = props.handleTagClick,
          tagRenderer = props.tagRenderer;

      var CustomRemoveComponent = props.removeComponent;

      var RemoveComponent = function (_React$Component) {
        _inherits(RemoveComponent, _React$Component);

        function RemoveComponent() {
          _classCallCheck(this, RemoveComponent);

          return _possibleConstructorReturn(this, (RemoveComponent.__proto__ || Object.getPrototypeOf(RemoveComponent)).apply(this, arguments));
        }

        _createClass(RemoveComponent, [{
          key: "render",
          value: function render() {
            if (readOnly) {
              return _react2.default.createElement("span", null);
            }
            if (CustomRemoveComponent) {
              return _react2.default.createElement(CustomRemoveComponent, this.props);
            }
            return _react2.default.createElement(
              "a",
              this.props,
              String.fromCharCode(215)
            );
          }
        }]);

        return RemoveComponent;
      }(_react2.default.Component);

      var tagComponent = _react2.default.createElement(
        "span",
        {
          style: { opacity: isDragging ? 0 : 1 },
          className: props.classNames.tag },
        _react2.default.createElement(
          "span",
          {
            className: props.classNames.tagLabel,
            onClick: handleTagClick.bind(null, props.tag) },
          tagRenderer && typeof tagRenderer === "function" ? tagRenderer(props.tag) : label
        ),
        _react2.default.createElement(RemoveComponent, {
          className: props.classNames.remove,
          onClick: props.onDelete
        })
      );
      return connectDragSource(connectDropTarget(tagComponent));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Tag;
}(_react.Component);

Tag.propTypes = {
  labelField: _propTypes2.default.string,
  onDelete: _propTypes2.default.func.isRequired,
  tag: _propTypes2.default.object.isRequired,
  moveTag: _propTypes2.default.func,
  removeComponent: _propTypes2.default.func,
  classNames: _propTypes2.default.object,
  readOnly: _propTypes2.default.bool,
  connectDragSource: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  connectDropTarget: _propTypes2.default.func.isRequired,
  tagRenderer: _propTypes2.default.func
};
Tag.defaultProps = {
  labelField: "text",
  readOnly: false
};
exports.default = (0, _lodash2.default)((0, _reactDnd.DragSource)(ItemTypes.TAG, tagSource, dragSource), (0, _reactDnd.DropTarget)(ItemTypes.TAG, tagTarget, dropCollect))(Tag);