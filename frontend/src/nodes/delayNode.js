import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const DelayNode = ({ id }) => {
  return (
    <BaseNode
      title="Delay"
      handles={
        <>
          <Handle type="target" position={Position.Left} id={`${id}-input`} />
          <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </>
      }
    >
      <div>Delay Node</div>
    </BaseNode>
  );
};