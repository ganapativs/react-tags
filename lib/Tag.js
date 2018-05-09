import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { flow } from 'lodash';

const ItemTypes = { TAG: 'tag' };

const tagSource = {
  beginDrag: (props) => { return { id: props.tag.id } },
  canDrag: (props) => props.moveTag && !props.readOnly
};

const tagTarget = {
  hover: (props, monitor) => {
    var draggedId = monitor.getItem().id;
    if (draggedId !== props.id) {
      props.moveTag(draggedId, props.tag.id);
    }
  },
  canDrop: (props) => !props.readOnly
};

const dragSource = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const dropCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Tag extends Component {
  static propTypes = {
    labelField: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    tag: PropTypes.object.isRequired,
    moveTag: PropTypes.func,
    removeComponent: PropTypes.func,
    classNames: PropTypes.object,
    readOnly: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    tagRenderer: PropTypes.func
  }

  static defaultProps =  {
    labelField: 'text',
    readOnly: false
  }

  render = () => {
    const { props } = this;
    const label = props.tag[props.labelField];
    const { connectDragSource, isDragging, connectDropTarget, readOnly, handleTagClick, tagRenderer } = props;
    const CustomRemoveComponent = props.removeComponent;

    class RemoveComponent extends React.Component {
      render() {
        if (readOnly) {
          return <span/>;
        }
        if (CustomRemoveComponent) {
          return <CustomRemoveComponent {...this.props} />;
        }
        return <a {...this.props}>{String.fromCharCode(215)}</a>;
      }
    }

    const tagComponent = (
      <span style={{opacity: isDragging ? 0 : 1}} className={props.classNames.tag}>
        <span className={props.classNames.tagLabel} onClick={handleTagClick.bind(null, props.tag)}>
          {
            tagRenderer && typeof tagRenderer === 'function'
              ? tagRenderer(props.tag)
              : label
          }
        </span>
        <RemoveComponent className={props.classNames.remove} onClick={props.onDelete} />
      </span>
    );
    return connectDragSource(connectDropTarget(tagComponent));
  }
}

export default flow(
  DragSource(ItemTypes.TAG, tagSource, dragSource),
  DropTarget(ItemTypes.TAG, tagTarget, dropCollect)
)(Tag);
