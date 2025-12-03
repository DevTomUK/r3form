import React, { useState, useEffect, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFormContext } from "../core/FormContext";

export default function Input3D({ name, position = [0, 0, 0], width = 6, height = 1 }) {
  const { values, setValue, focusedInput, setFocusedInput } = useFormContext();
  const value = values[name] || "";
  const isActive = focusedInput === name;

  const groupRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  const borderColor = useRef(new THREE.Color("#a0a0a0"));

  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHovered, setHovered] = useState(false);

  useFrame((state) => {
    // caret blink
    if (isActive) {
      const t = state.clock.getElapsedTime();
      setCursorVisible(Math.floor(t * 2) % 2 === 0);
    }

    // border color lerp
    const targetColor = new THREE.Color(
      isActive ? "#00ffff" : isHovered ? "#ababab" : "#232323"
    );
    borderColor.current.lerp(targetColor, 0.08);

    [topRef, bottomRef, leftRef, rightRef].forEach(ref => {
      if (ref.current) ref.current.material.color.copy(borderColor.current);
    });
  });

  useEffect(() => {
    if (!isActive) return;

    function handleKey(e) {
      if (e.key === "Backspace") setValue(name, value.slice(0, -1));
      else if (e.key.length === 1) setValue(name, value + e.key);
      e.preventDefault();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isActive, value]);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        setFocusedInput(name);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Borders */}
      <mesh ref={topRef} position={[0, height / 2 + 0.05 / 2, 0.1]}>
        <boxGeometry args={[width + 0.1 * 2, 0.1, 0.2]} />
        <meshStandardMaterial color={borderColor.current} />
      </mesh>
      <mesh ref={bottomRef} position={[0, -(height / 2 + 0.05 / 2), 0.1]}>
        <boxGeometry args={[width + 0.1 * 2, 0.1, 0.2]} />
        <meshStandardMaterial color={borderColor.current} />
      </mesh>
      <mesh ref={leftRef} position={[-(width / 2 + 0.05 / 2), 0, 0.1]}>
        <boxGeometry args={[0.1, height + 0.1 * 2, 0.2]} />
        <meshStandardMaterial color={borderColor.current} />
      </mesh>
      <mesh ref={rightRef} position={[(width / 2 + 0.05 / 2), 0, 0.1]}>
        <boxGeometry args={[0.1, height + 0.1 * 2, 0.2]} />
        <meshStandardMaterial color={borderColor.current} />
      </mesh>

      {/* Label */}
      <Text position={[-width / 2, height, 0]} fontSize={0.45} anchorX="left">{name}:</Text>

      {/* Input box */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Text */}
      <Text position={[-width / 2 + 0.2, 0, 0.15]} fontSize={0.45} anchorX="left" anchorY="middle">{value}</Text>

      {/* Caret */}
      {isActive && (
        <mesh visible={cursorVisible} position={[-width / 2 + 0.2 + value.length * 0.35, 0, 0.2]}>
          <boxGeometry args={[0.08, height * 0.7, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
    </group>
  );
}
