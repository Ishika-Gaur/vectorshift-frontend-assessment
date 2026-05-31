import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MathNode = ({ id }) => {
  return (
    <BaseNode
      title="Math"
      handles={
        <>
          <Handle type="target" position={Position.Left} id={`${id}-input`} />
          <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </>
      }
    >
      <div>Math Calculation Node</div>
    </BaseNode>
  );
};