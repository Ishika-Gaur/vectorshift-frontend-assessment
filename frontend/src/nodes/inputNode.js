// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

 return (
  <BaseNode
    title="Input"
    handles={
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-value`}
      />
    }
  >
    <label>
      Name:
      <input
        type="text"
        value={currName}
        onChange={handleNameChange}
      />
    </label>

    <br />

    <label>
      Type:
      <select value={inputType} onChange={handleTypeChange}>
        <option value="Text">Text</option>
        <option value="File">File</option>
      </select>
    </label>
  </BaseNode>
);
}
