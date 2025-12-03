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
  // Context
  const { values, setValue, focusedInput, setFocusedInput } = useFormContext();

  // Value of specific element in context values
  const value = values[name] || "";

  // If element is Active (focused on)
  const isActive = focusedInput === name;

  // Refs for 3D objects
  const groupRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  const inputTextRef = useRef();
  const caretRef = useRef();
  const labelRef = useRef();
  const borderColor = useRef(new THREE.Color("#a0a0a0"));

  // React states
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHovered, setHovered] = useState(false);
  const [movePlaceholder, setMovePlaceholder] = useState(true);

  // Animated values
  const targetLabelPos = useRef(new THREE.Vector3(-width / 2 + 0.05, 0, 0.2));
  const labelPos = useRef(new THREE.Vector3(-width / 2 + 0.05, 0, 0.2));
  const targetFontSize = useRef(0.6);
  const labelFontSize = useRef(0.4);
  const topTargetScale = useRef(1);
  const topTargetPos = useRef(0);

  // Handles if placeholder/border is moved when active/complete
  useEffect(() => {
    if (isActive || value.length > 0) {
      setMovePlaceholder(true);
    } else {
      setMovePlaceholder(false);
    }
  }, [focusedInput, value]);

  // Change values of the animated targets when placeholder moves
  useEffect(() => {
    if (!labelRef.current) return;
    const labelWidth = labelRef.current.geometry.boundingBox.max.x * 1.5;
    if (movePlaceholder) {
      // Move label position and font size
      targetLabelPos.current.set(-width / 2 + 0.05, 0.6, borderDepth / 2);
      targetFontSize.current = 0.3;

      // Shrink top border and offset it
      topTargetScale.current = (width - (labelWidth + 0.4) / 2) / width;
      topTargetPos.current = (labelWidth + 0.4) / 4; // half of the removed width / 2
    } else {
      // Return label position and font size
      targetLabelPos.current.set(-width / 2 + 0.05, 0, borderDepth / 2);
      targetFontSize.current = 0.4;

      // Grow top border and zero offset
      topTargetScale.current = 1;
      topTargetPos.current = 0;
    }
  }, [movePlaceholder, width]);

  // Handle keyboard input
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

  // Main animation loop
  useFrame((state) => {
    // Caret blinking
    if (isActive) {
      const t = state.clock.getElapsedTime();
      setCursorVisible(Math.floor(t * 2) % 2 === 0);
    }

    // Caret position
    if (caretRef.current && inputTextRef.current) {
      const textWidth = inputTextRef.current.geometry.boundingBox.max.x;
      caretRef.current.position.x = textWidth - width / 2 + 0.3;
    }

    // Border color + emissive glow
    const targetColor = new THREE.Color(
      isActive ? "#00ffff" : isHovered ? "#ababab" : "#232323"
    );
    const targetEmissive = new THREE.Color(
      isActive ? "#00ffff" : isHovered ? "#444444" : "#000000"
    );
    const targetEmissiveIntensity = isActive ? 1.5 : isHovered ? 0.6 : 0;

    borderColor.current.lerp(targetColor, 0.08);

    [topRef, bottomRef, leftRef, rightRef].forEach((ref) => {
      if (!ref.current) return;
      const mat = ref.current.material;
      mat.color.copy(borderColor.current);
      mat.emissive = mat.emissive || new THREE.Color(0, 0, 0);
      mat.emissive.lerp(targetEmissive, 0.1);
      if (mat.emissiveIntensity === undefined) mat.emissiveIntensity = 0;
      mat.emissiveIntensity +=
        (targetEmissiveIntensity - mat.emissiveIntensity) * 0.1;
    });

    // Top border scale + position
    if (topRef.current) {
      topRef.current.scale.x +=
        (topTargetScale.current - topRef.current.scale.x) * 0.1;
      topRef.current.position.x +=
        (topTargetPos.current - topRef.current.position.x) * 0.1;
    }

    // Label movement + font size
    if (labelRef.current) {
      labelPos.current.lerp(targetLabelPos.current, 0.1);
      labelRef.current.position.copy(labelPos.current);
      labelFontSize.current +=
        (targetFontSize.current - labelFontSize.current) * 0.1;
      labelRef.current.fontSize = labelFontSize.current;
    }

    // Hover Z-offset lerp
    const targetZ = isHovered ? hoverDepth : 0;
    groupRef.current.position.z +=
      (targetZ - groupRef.current.position.z) * 0.1;
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
        <mesh
          castShadow
          receiveShadow
          ref={topRef}
          position={[0, height / 2 + borderWidth / 2, borderDepth / 2]}
        >
          <boxGeometry args={[width, borderWidth, borderDepth]} />
          <meshStandardMaterial
            color={borderColor.current}
            emissive={"black"}
            emissiveIntensity={0}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          ref={bottomRef}
          position={[0, -(height / 2 + borderWidth / 2), borderDepth / 2]}
        >
          <boxGeometry
            args={[width + borderWidth * 2, borderWidth, borderDepth]}
          />
          <meshStandardMaterial
            color={borderColor.current}
            emissive={"black"}
            emissiveIntensity={0}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          ref={leftRef}
          position={[-(width / 2 + borderWidth / 2), 0, borderDepth / 2]}
        >
          <boxGeometry
            args={[borderWidth, height + borderWidth * 2, borderDepth]}
          />
          <meshStandardMaterial
            color={borderColor.current}
            emissive={"black"}
            emissiveIntensity={0}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          ref={rightRef}
          position={[width / 2 + borderWidth / 2, 0, borderDepth / 2]}
        >
          <boxGeometry
            args={[borderWidth, height + borderWidth * 2, borderDepth]}
          />
          <meshStandardMaterial
            color={borderColor.current}
            emissive={"black"}
            emissiveIntensity={0}
          />
        </mesh>

        {/* Label */}
        <Text
          castShadow
          receiveShadow
          ref={labelRef}
          anchorX="left"
          color="black"
        >
          {name}
        </Text>

        {/* Input background */}

        <mesh
          visible={showFieldBackground}
          castShadow
          receiveShadow
          position={[0, 0, borderDepth / 2 - 0.01]}
        >
          <boxGeometry args={[width, height, 0.01]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* Input text */}
        <Text
          color="black"
          castShadow
          receiveShadow
          ref={inputTextRef}
          position={[-width / 2 + 0.2, 0, borderDepth / 2]}
          fontSize={0.45}
          anchorX="left"
          anchorY="middle"
        >
          {value}
        </Text>

        {/* Caret */}
        {isActive && (
          <mesh
            castShadow
            receiveShadow
            ref={caretRef}
            visible={cursorVisible}
            position={[-width / 2 + 0.3, 0, borderDepth / 2]}
          >
            <boxGeometry args={[0.08, height * 0.7, 0.05]} />
            <meshStandardMaterial color="black" />
          </mesh>
        )}
      </group>
  );
}
