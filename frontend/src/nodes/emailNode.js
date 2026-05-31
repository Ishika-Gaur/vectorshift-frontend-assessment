import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const EmailNode = ({ id }) => {
  return (
    <BaseNode
      title="Email"
      handles={
        <>
          <Handle type="target" position={Position.Left} id={`${id}-input`} />
          <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </>
      }
    >
      <div>Email Sender Node</div>
    </BaseNode>
  );
};