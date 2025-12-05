import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "../core/FormContext";
import { Text } from "@react-three/drei";

export default function Slider3D({ name, width = 4 }) {
  const { values, setValue } = useFormContext();

  const sliderRailRef = useRef();
  const [sliderSize, setSliderSize] = useState(width - 2);

  // Compute geometry width once the mesh exists
  useEffect(() => {
    if (!sliderRailRef.current) return;

    const geom = sliderRailRef.current.geometry;
    if (!geom.attributes.position) return; // safety check

    geom.computeBoundingBox();
    const bbox = geom.boundingBox;

    const actualWidth = bbox.max.x - bbox.min.x;
    setSliderSize(actualWidth);
  }, []);

const handleClick = (e) => {
  e.stopPropagation();
  if (!sliderRailRef.current) return;

  // Convert world click point to rail's local coordinates
  const localPoint = sliderRailRef.current.worldToLocal(e.point.clone());

  // Normalize: -width/2 → 0, +width/2 → 1
  const normalized = (localPoint.x + sliderSize / 2) / sliderSize;

  console.log("Normalized value (0–1):", normalized);

  // Optionally, set value in form
  setValue(name, normalized);
};


  return (
    <>
      <Text
        anchorX="left"
        position={[-width / 2, 0, 0.1]}
        fontSize={0.4}
        castShadow
        receiveShadow
        color="black"
      >
        {name}
      </Text>

      <group
        position={[width / 2 - sliderSize / 2, 0, 0]}
        onPointerDown={handleClick}
      >
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color="grey" />
        </mesh>

        <mesh castShadow receiveShadow ref={sliderRailRef}>
          <boxGeometry args={[width - 2, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </>
  );
}
