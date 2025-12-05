import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useFormContext } from "../core/FormContext";

export default function Switch3D({
  name,
  position = [0, 0, 0],
  width = 6,
  switchWidth = 1.2,
  height = 0.5,
  borderWidth = 0.05,
  borderDepth = 0.1,
  toggleWidth = 0.6,
}) {
  const toggleRef = useRef();
  const trackRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();

  const { values, setValue } = useFormContext();
  const enabled = values[name] || false;

  const [isHovered, setHovered] = useState(false);
  const borderColor = useRef(new THREE.Color("#a0a0a0"));

  const toggle = () => setValue(name, !enabled);

  useFrame(() => {
    if (!toggleRef.current) return;

    // Toggle handle animation
    const targetX = enabled
      ? switchWidth / 2 - toggleWidth / 2
      : -switchWidth / 2 + toggleWidth / 2;

    toggleRef.current.position.x = THREE.MathUtils.lerp(
      toggleRef.current.position.x,
      targetX,
      0.12
    );

    // Border glow
    const targetBorderColor = new THREE.Color(
      enabled ? "#00ffff" : isHovered ? "#ababab" : "#232323"
    );
    const targetEmissive = new THREE.Color(isHovered ? "#00ffff" : "#000000");
    const targetEmissiveIntensity = enabled ? 1.5 : isHovered ? 0.2 : 0;

    borderColor.current.lerp(targetBorderColor, 0.08);
    [topRef, bottomRef, leftRef, rightRef].forEach((ref) => {
      if (!ref.current) return;
      const mat = ref.current.material;
      mat.color.copy(borderColor.current);
      mat.emissive.lerp(targetEmissive, 0.1);
      mat.emissiveIntensity +=
        (targetEmissiveIntensity - mat.emissiveIntensity) * 0.1;
    });

    // Track glow
    if (trackRef.current) {
      const glow = enabled ? 1.5 : isHovered ? 0.2 : 0.2;
      trackRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        trackRef.current.material.emissiveIntensity,
        glow,
        0.1
      );
    }
  });

  const half = width / 2;

  // Full external width of switch (track + borders)
  const switchTotalWidth = switchWidth;

  // Label aligns by its LEFT EDGE
  const labelX = -half - borderWidth / 2;

  // Switch aligns by its RIGHT EDGE
  const switchX = half - switchTotalWidth / 2;

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={toggle}
    >
      {/* Left-anchored Label */}
      <Text
        castShadow
        receiveShadow
        position={[labelX, 0, 0.1]}
        fontSize={0.4}
        anchorX="left" // <-- edge anchoring
        anchorY="middle"
        color="black"
      >
        {name}
      </Text>

      {/* Right-anchored Switch */}
      <group position={[switchX, 0, 0]}>
        {/* Track Borders */}
        <mesh
          castShadow
          receiveShadow
          ref={topRef}
          position={[0, height / 2 + borderWidth / 2, borderDepth / 2]}
        >
          <boxGeometry args={[switchWidth, borderWidth, borderDepth]} />
          <meshStandardMaterial color={borderColor.current} emissive="#000" />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          ref={bottomRef}
          position={[0, -(height / 2 + borderWidth / 2), borderDepth / 2]}
        >
          <boxGeometry args={[switchWidth, borderWidth, borderDepth]} />
          <meshStandardMaterial color={borderColor.current} emissive="#000" />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          ref={leftRef}
          position={[-(switchWidth / 2 + borderWidth / 2), 0, borderDepth / 2]}
        >
          <boxGeometry
            args={[borderWidth, height + borderWidth * 2, borderDepth]}
          />
          <meshStandardMaterial color={borderColor.current} emissive="#000" />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          ref={rightRef}
          position={[switchWidth / 2 + borderWidth / 2, 0, borderDepth / 2]}
        >
          <boxGeometry
            args={[borderWidth, height + borderWidth * 2, borderDepth]}
          />
          <meshStandardMaterial color={borderColor.current} emissive="#000" />
        </mesh>

        {/* Track */}
        <mesh castShadow receiveShadow ref={trackRef}>
          <boxGeometry args={[switchWidth, height, 0.01]} />
          <meshStandardMaterial
            color={enabled ? "#0ff" : "#555"}
            emissive="#0cc"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Toggle Handle */}
        <mesh
          castShadow
          receiveShadow
          ref={toggleRef}
          position={[-switchWidth / 2 + toggleWidth / 2, 0, borderDepth / 2]}
        >
          <boxGeometry args={[toggleWidth, height, borderDepth]} />
          <meshStandardMaterial color={enabled ? "#0ff" : "#555"} />
        </mesh>
      </group>
    </group>
  );
}
