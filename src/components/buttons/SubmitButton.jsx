import React from "react";
import { useFormContext } from "../../core/FormContext";
import BaseButton from "./BaseButton";

export default function SubmitButton({
  width,
  height,
  depth,
  radius,
  smoothness,
  color,
  hoverColor,
  pressDepth,
  label = "Submit",
  fontSize,
  heightPos = 0,
}) {
  const { submit } = useFormContext();

  return (
    <BaseButton
      width={width}
      height={height}
      depth={depth}
      radius={radius}
      smoothness={smoothness}
      color={color || "#00cc88"}
      hoverColor={hoverColor || "#00ffaa"}
      pressDepth={pressDepth}
      label={label}
      fontSize={fontSize}
      heightPos={heightPos}
      onClick={submit}
    />
  );
}
