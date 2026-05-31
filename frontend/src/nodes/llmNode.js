// llmNode.js

import { Handle, Position } from 'reactflow';
import { BaseNode } from "./BaseNode";

export const LLMNode = ({ id, data }) => {

  return (
  <BaseNode
    title="LLM"
    handles={
      <>
        <Handle
          type="target"
          position={Position.Left}
          id={`${id}-system`}
          style={{ top: `${100 / 3}%` }}
        />

        <Handle
          type="target"
          position={Position.Left}
          id={`${id}-prompt`}
          style={{ top: `${200 / 3}%` }}
        />

        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-response`}
        />
      </>
    }
  >
    <div>This is a LLM.</div>
  </BaseNode>
);
}
