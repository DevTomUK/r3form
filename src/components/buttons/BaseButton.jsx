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
  color = "#35b625",
  hoverColor = "#3ec02d",
  glowColor = "#a0ff50", 
  pressDepth = -0.05,
  label = "Button",
  fontSize = 0.3,
  onClick = () => {},
}) {
  const groupRef = useRef();
  const materialRef = useRef();
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);

  useFrame(() => {
    if (!groupRef.current || !materialRef.current) return;

    // Smoothly animate main color
    const targetColor = hoveredRef.current ? new THREE.Color(hoverColor) : new THREE.Color(color);
    materialRef.current.color.lerp(targetColor, 0.1);

    // Smoothly animate emissive glow
    const targetEmissive = hoveredRef.current ? new THREE.Color(glowColor) : new THREE.Color(0x000000);
    materialRef.current.emissive.lerp(targetEmissive, 0.2); 

    // Animate press depth
    const targetZ = pressedRef.current ? pressDepth : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
  });

  return (
    <group
      ref={groupRef}
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
        args={[width, height, depth]}
        radius={radius}
        smoothness={smoothness}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={0x000000} 
          emissiveIntensity={1.5} 
          toneMapped={false}
        />
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
