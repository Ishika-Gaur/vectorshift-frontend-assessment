import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const APINode = ({ id }) => {
  return (
    <BaseNode
      title="API"
      handles={
        <>
          <Handle type="target" position={Position.Left} id={`${id}-input`} />
          <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </>
      }
    >
      <div>API Request Node</div>
    </BaseNode>
  );
};