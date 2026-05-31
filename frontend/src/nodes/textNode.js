import { useState, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{name}} {{city}} {{email}}");

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Find variables like {{input}}, {{name}}, {{city}}
  const variables = useMemo(() => {
    const matches = currText.match(/{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g) || [];

    return matches.map((m) =>
      m.replace("{{", "").replace("}}", "").trim()
    );
  }, [currText]);
  console.log("variables", variables);

  const dynamicHandles = variables.map((variable, index) => (
    <Handle
      key={variable}
      type="target"
      position={Position.Left}
      id={`${id}-${variable}`}
      style={{
        top: `${((index + 1) * 100) / (variables.length + 1)}%`,
      }}
    />
  ));

  return (
    <BaseNode
      title="Text"
      handles={
        <>
          {dynamicHandles}

          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-output`}
          />
        </>
      }
    >
      <div>
        <label>
          Text:
          <textarea
  value={currText}
  onChange={handleTextChange}
  rows={Math.max(3, currText.split("\n").length)}
  style={{
    minWidth: "200px",
    maxWidth: "300px",
    resize: "none",
  }}
/>
        </label>
      </div>
    </BaseNode>
  );
};