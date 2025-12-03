import React from "react";
import { useFormContext } from "./FormContext";

export default function Background({ formHeight, formWidth, padding, visible, formColor }) {
  const { setFocusedInput } = useFormContext();

  // Unfocus any active input
  const handleBlur = (e) => {
    e.stopPropagation();
    setFocusedInput(null);
  };

  return (
    <mesh
      castShadow
      receiveShadow
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={handleBlur}
      visible={visible}
    >
      <planeGeometry args={[formWidth + (padding * 2), formHeight + (padding * 2)]} />
      <meshStandardMaterial
        color={formColor}
        metalness={0.1}
        roughness={0.8}
        envMapIntensity={1}
      />
    </mesh>
  );
}
