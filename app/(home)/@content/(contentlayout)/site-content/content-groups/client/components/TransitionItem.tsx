"use client";

import { Transition } from "react-transition-group";
import { useRef } from "react";
import { EllipsisCircleFill } from "framework7-icons/react";

const TransitionItem = (props: any) => {
  const duration = 300;
  const nodeRef = useRef<HTMLDivElement>(null); // DOM referansı

  const transitionStyles = {
    entering: {
      opacity: 1,
      transition: `opacity ${duration}ms ease-in-out, margin-top ${duration}ms ease-in-out`,
    },
    entered: {},
    exiting: {
      opacity: 0,
      transition: `opacity ${duration}ms ease-in-out, margin-top ${duration}ms ease-in-out`,
    },
    exited: {},
  };

  function onEnter() {
    const node = nodeRef.current;
    if (node) {
      node.style.marginTop = `-${node.clientHeight}px`;
      node.style.opacity = "0";
    }
  }

  function onEntering() {
    const node = nodeRef.current;
    if (node) {
      node.style.marginTop = "0";
    }
  }

  function onExit() {
    const node = nodeRef.current;
    if (node) {
      node.style.marginTop = "0";
      node.style.opacity = "1";
    }
  }

  function onExiting() {
    const node = nodeRef.current;
    if (node) {
      node.style.marginTop = `-${node.clientHeight}px`;
    }
  }

  return (
    <Transition
      in={props.in}
      timeout={duration}
      unmountOnExit
      nodeRef={nodeRef}
      onEnter={onEnter}
      onEntering={onEntering}
      onExit={onExit}
      onExiting={onExiting}
    >
      {(status) => (
        <div
          ref={nodeRef}
          className={` ${props.className}`}
          style={{
            ...transitionStyles[status as keyof typeof transitionStyles],
            zIndex: props.zIndex
          }}
        >
          {props.title}
          <button
            onClick={() =>
            {
              props.setState(
                props.state.filter((item: any) => item.id !== props.id)
              )
              props.setStableCount(props.stableCount - 1) 
            }
            }
          >
            <EllipsisCircleFill className="text-gray-300"/>
          </button>
        </div>
      )}
    </Transition>
  );
};

export default TransitionItem;
