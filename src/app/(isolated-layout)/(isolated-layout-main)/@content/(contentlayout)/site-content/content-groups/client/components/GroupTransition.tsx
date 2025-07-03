"use client"
import { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { v1 } from "uuid";
import TransitionItem from "./TransitionItem";

const GroupTransition = () => {
  const initialState = [
    { id: v1(), title: "item 1" },
    { id: v1(), title: "item 2" }
  ];

  const [state, setState] = useState(initialState);
  const [stableCount, setStableCount] = useState(0);
  return (
    <div className="group-list">
      <button
        onClick={() =>
        {
          setState([
            ...state,
            { id: v1(), title: `item ${state.length + 1}` }
          ])
          setStableCount(stableCount + 1)
        }
        }
      >
        Add more items
      </button>
      <div className="list">
        <TransitionGroup className="group flex flex-col divide-y divide-gray-200 ">
          {state.map(({ id, title }, i) => {
            const zIndex = state.length - i;
            return (
              <TransitionItem
               className={`flex flex-row gap-2 justify-between items-center bg-background  px-2 hover:bg-primary/10 py-1.5 my-1`}
              key={id} {...{ id, title, state, setState, zIndex, stableCount, setStableCount }} />
            );
          })}
        </TransitionGroup>
      </div>
    </div>
  );
};

export { GroupTransition };
