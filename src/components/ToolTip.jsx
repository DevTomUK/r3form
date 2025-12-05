import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCameraController } from "../core/useCameraController";

let activeTooltip = null;

export default function ToolTip({ position, id, text = "This is a tooltip", yOffset }) {
  const toolTipRef = useRef();
  const groupRef = useRef();
  const boxRef = useRef();
  const textRef = useRef();
  const boxWidthRef = useRef(1.5); // initial width

  const [isHovered, setHovered] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const { setCameraTarget } = useCameraController();

  // Center the "?" text
  useLayoutEffect(() => {
    const textMesh = toolTipRef.current;
    if (!textMesh) return;
    textMesh.geometry.computeBoundingBox();
    const bbox = textMesh.geometry.boundingBox;
    textMesh.position.x -= (bbox.max.x + bbox.min.x) / 2;
    textMesh.position.y -= (bbox.max.y + bbox.min.y) / 2;
    textMesh.position.z -= (bbox.max.z + bbox.min.z) / 2;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !boxRef.current) return;

    // Group Z lerp
    const targetZ = isClicked ? 0.5 : 0;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.1;

    // Scale
    const targetScale = isClicked ? 2 : isHovered ? 1.2 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Spin when clicked
    const targetRotation = isClicked ? state.clock.getElapsedTime() * Math.PI : 0;
    groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;

    // Box position lerp
    const targetBoxPos = isClicked
      ? [position[0] + 1, position[1], position[2] + 1]
      : [0, 0, 20];
    boxRef.current.position.lerp(new THREE.Vector3(...targetBoxPos), 0.1);
  });

  const handleClick = (e) => {
    e.stopPropagation();

    if (activeTooltip && activeTooltip !== id) {
      activeTooltip.setClicked(false);
    }

    setClicked(true);
    activeTooltip = { id, setClicked };

    if (textRef.current && boxRef.current) {
      // Measure text width
      textRef.current.geometry.computeBoundingBox();
      const bbox = textRef.current.geometry.boundingBox;
      const textWidth = bbox.max.x - bbox.min.x;
      const padding = 0.5;
      const newWidth = textWidth + padding;
      boxWidthRef.current = newWidth;

      // Update box geometry
      boxRef.current.children[0].geometry.dispose();
      boxRef.current.children[0].geometry = new THREE.BoxGeometry(newWidth, 0.6, 0.1);

      // Center text inside box
      textRef.current.position.x = -(newWidth / 2) + (padding / 2);
      textRef.current.position.y = -(bbox.max.y + bbox.min.y) / 2;
      textRef.current.position.z = 0.06;
    }

    // Move camera
    setCameraTarget(
      new THREE.Vector3(position[0], yOffset, 6),
      new THREE.Vector3(position[0] / 2, yOffset, 0)
    );
  };

  return (
    <>
      {/* "?" Icon */}
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <Text3D
          ref={toolTipRef}
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.01}
          receiveShadow
          castShadow
        >
          ?
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </Text3D>
      </group>

      {/* Tooltip Box (left-anchored) */}
      <group ref={boxRef} position={[position[0] + 0.5, position[1], 20]}>
        <mesh>
          <boxGeometry args={[boxWidthRef.current, 0.6, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" emissive="#444" />
        </mesh>
        <Text3D
          ref={textRef}
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.15}
          height={0.01}
        >
          {text}
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </Text3D>
      </group>
    </>
  );
}
