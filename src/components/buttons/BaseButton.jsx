import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export default function BaseButton({
  width = 2,
  height = 0.8,
  depth = 0.2,
  radius = 0.1,
  smoothness = 4,
  color = "lightblue",
  hoverColor = "deepskyblue",
  pressDepth = -0.05,
  label = "Button",
  fontSize = 0.3,
  heightPos = 0,
  onClick = () => {},
}) {
  const meshRef = useRef();
  const groupRef = useRef();
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;

    // Color lerp
    const targetColor = hoveredRef.current ? new THREE.Color(hoverColor) : new THREE.Color(color);
    meshRef.current.material.color.lerp(targetColor, 0.1);

    // Press animation
    const targetZ = pressedRef.current ? pressDepth : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
  });

  return (
    <group
      ref={groupRef}
      position={[0, heightPos, 0]}
      onPointerOver={() => (hoveredRef.current = true)}
      onPointerOut={() => (hoveredRef.current = false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        pressedRef.current = true;
        onClick?.();
      }}
      onPointerUp={() => (pressedRef.current = false)}
    >
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={radius}
        smoothness={smoothness}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />
      </RoundedBox>

      <Text
        position={[0, 0, depth / 2 + 0.05]}
        fontSize={fontSize}
        anchorX="center"
        anchorY="middle"
        color="black"
      >
        {label}
      </Text>
    </group>
  );
}
