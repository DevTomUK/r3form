import React, { useState, useEffect, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFormContext } from "../core/FormContext";

export default function Input3D({
  name,
  position = [0, 0, 0],
  width = 6,
  height = 1,
  borderWidth = 0.05,
  borderDepth = 0.1,
  hoverDepth = 0.1,
  showFieldBackground = false,
  heightPos = 0,
}) {
  // Context (value, focus control)
  const { values, setValue, focusedInput, setFocusedInput } = useFormContext();
  const value = values[name] || "";
  const isActive = focusedInput === name;

  // Refs
  const groupRef = useRef();
  const borders = {
    top: useRef(),
    bottom: useRef(),
    left: useRef(),
    right: useRef(),
  };
  const inputTextRef = useRef();
  const caretRef = useRef();
  const labelRef = useRef();
  const borderColor = useRef(new THREE.Color("#a0a0a0"));

  // State
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHovered, setHovered] = useState(false);
  const [movePlaceholder, setMovePlaceholder] = useState(false);

  // Animated parameters (targets + current)
  const targetLabelPos = useRef(new THREE.Vector3(-width / 2 + 0.05, 0, 0.2));
  const labelPos = useRef(new THREE.Vector3(-width / 2 + 0.05, 0, 0.2));
  const targetFontSize = useRef(0.4);
  const currentFontSize = useRef(0.4);
  const topTargetScale = useRef(1);
  const topTargetPos = useRef(0);

  // Placeholder should float when active or filled
  useEffect(() => {
    setMovePlaceholder(isActive || value.length > 0);
  }, [isActive, value]);

  // Update targets based on placeholder state
  useEffect(() => {
    if (!labelRef.current) return;

    const labelWidth = labelRef.current.geometry.boundingBox.max.x * 1.5;

    if (movePlaceholder) {
      // Move label upward
      targetLabelPos.current.set(-width / 2 + 0.05, 0.6, borderDepth / 2);
      targetFontSize.current = 0.3;

      // Shrink top border
      const shrink = (labelWidth + 0.4) / 2;
      topTargetScale.current = (width - shrink) / width;
      topTargetPos.current = shrink / 2;
    } else {
      // Return label
      targetLabelPos.current.set(-width / 2 + 0.05, 0, borderDepth / 2);
      targetFontSize.current = 0.4;
      topTargetScale.current = 1;
      topTargetPos.current = 0;
    }
  }, [movePlaceholder, width]);

  // Keyboard typing
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e) => {
      if (e.key === "Backspace") {
        setValue(name, value.slice(0, -1));
      } else if (e.key.length === 1) {
        setValue(name, value + e.key);
      }
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isActive, value, name, setValue]);

  // Animation Loop
  useFrame((state) => {
    // Caret blink
    if (isActive) setCursorVisible(Math.floor(state.clock.getElapsedTime() * 2) % 2 === 0);

    // Caret follows text width
    if (caretRef.current && inputTextRef.current) {
      const textWidth = inputTextRef.current.geometry.boundingBox.max.x || 0;
      caretRef.current.position.x = textWidth - width / 2 + 0.3;
    }

    // Border color + emissive
    const targetColor = new THREE.Color(isActive ? "#00ffff" : isHovered ? "#ffffff" : "#232323");
    const targetEmissive = new THREE.Color(isActive ? "#00ffff" : isHovered ? "#444444" : "#000000");
    const emissiveIntensity = isActive ? 1.5 : isHovered ? 0.6 : 0;

    borderColor.current.lerp(targetColor, 0.08);

    Object.values(borders).forEach((ref) => {
      if (!ref.current) return;
      const mat = ref.current.material;
      mat.color.copy(borderColor.current);
      mat.emissive.lerp(targetEmissive, 0.1);
      mat.emissiveIntensity += (emissiveIntensity - mat.emissiveIntensity) * 0.1;
    });

    // Top border animation
    if (borders.top.current) {
      borders.top.current.scale.x += (topTargetScale.current - borders.top.current.scale.x) * 0.1;
      borders.top.current.position.x += (topTargetPos.current - borders.top.current.position.x) * 0.1;
    }

    // Label animation
    if (labelRef.current) {
      labelPos.current.lerp(targetLabelPos.current, 0.1);
      labelRef.current.position.copy(labelPos.current);

      currentFontSize.current += (targetFontSize.current - currentFontSize.current) * 0.1;
      labelRef.current.fontSize = currentFontSize.current;
    }

    // Hover lift
    const targetZ = isHovered ? hoverDepth : 0;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.1;
  });

  return (
    <group
      ref={groupRef}
      position={[0, heightPos, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        setFocusedInput(name);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Borders */}
      <mesh ref={borders.top} position={[0, height / 2 + borderWidth / 2, borderDepth / 2]}>
        <boxGeometry args={[width, borderWidth, borderDepth]} />
        <meshStandardMaterial emissive="black" emissiveIntensity={0} />
      </mesh>

      <mesh ref={borders.bottom} position={[0, -(height / 2 + borderWidth / 2), borderDepth / 2]}>
        <boxGeometry args={[width + borderWidth * 2, borderWidth, borderDepth]} />
        <meshStandardMaterial emissive="black" emissiveIntensity={0} />
      </mesh>

      <mesh ref={borders.left} position={[-(width / 2 + borderWidth / 2), 0, borderDepth / 2]}>
        <boxGeometry args={[borderWidth, height + borderWidth * 2, borderDepth]} />
        <meshStandardMaterial emissive="black" emissiveIntensity={0} />
      </mesh>

      <mesh ref={borders.right} position={[width / 2 + borderWidth / 2, 0, borderDepth / 2]}>
        <boxGeometry args={[borderWidth, height + borderWidth * 2, borderDepth]} />
        <meshStandardMaterial emissive="black" emissiveIntensity={0} />
      </mesh>

      {/* Label */}
      <Text ref={labelRef} anchorX="left" color="black">
        {name}
      </Text>

      {/* Background */}
      <mesh
        visible={showFieldBackground}
        position={[0, 0, borderDepth / 2 - 0.01]}
      >
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Text */}
      <Text
        ref={inputTextRef}
        position={[-width / 2 + 0.2, 0, borderDepth / 2]}
        fontSize={0.45}
        anchorX="left"
        anchorY="middle"
        color="black"
      >
        {value}
      </Text>

      {/* Caret */}
      {isActive && (
        <mesh ref={caretRef} visible={cursorVisible} position={[-width / 2 + 0.3, 0, borderDepth / 2]}>
          <boxGeometry args={[0.08, height * 0.7, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
    </group>
  );
}
