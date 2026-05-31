import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const FilterNode = ({ id }) => {
  return (
    <BaseNode
      title="Filter"
      handles={
        <>
          <Handle type="target" position={Position.Left} id={`${id}-input`} />
          <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </>
      }
    >
      <div>Filter Node</div>
    </BaseNode>
  );
};