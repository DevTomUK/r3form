import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { FormProvider } from "./FormContext";
import Background from "./Background";
import MeasuredWrapper from "./MeasuredWrapper";
import getCameraPosition from "../utils/getCameraPosition";

export default function R3Form({
  children,
  onSubmit,
  width = "100%",
  height = "100%",
  cameraPosition = "front",
  shadows = true,
  background = true,
  formColor = "#e7da8f",
  backgroundColor = "#defdfe",
  formWidth = 6,
  padding = 1,
  gap = 0.5,
  zoom = 1
}) {
  const [childHeights, setChildHeights] = useState([]);

  const handleMeasure = (index, height) => {
    setChildHeights((prev) => {
      const newHeights = [...prev];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const allMeasured = childHeights.length === React.Children.count(children);
  const totalFormHeight = allMeasured
    ? childHeights.reduce((sum, h) => sum + h, 0) + gap * (childHeights.length - 1) + padding * 2
    : 6;

  const cameraDistance = totalFormHeight + 2 * (1 / zoom);

  // Stack children dynamically with top and bottom padding
  let cumulativeHeight = padding;
  const stackedChildren = React.Children.map(children, (child, index) => {
    const height = childHeights[index] || 1;
    const yOffset = totalFormHeight / 2 - (cumulativeHeight + height / 2);
    cumulativeHeight += height + gap;

    return (
      <MeasuredWrapper key={index} index={index} onMeasure={handleMeasure}>
        {React.cloneElement(child, { width: formWidth, heightPos: yOffset })}
      </MeasuredWrapper>
    );
  });

  return (
    <FormProvider onSubmit={onSubmit}>
      <div style={{ width, height, backgroundColor }}>
        <Canvas
          shadows={shadows}
          camera={{ position: getCameraPosition(cameraPosition, cameraDistance, totalFormHeight) }}
        >
          <Background
            visible={background}
            formHeight={totalFormHeight}
            formWidth={formWidth}
            padding={padding}
            formColor={formColor}
          />

          <ambientLight intensity={1} />
          <directionalLight
            position={[15, 20, 40]}
            intensity={0.4}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {stackedChildren}
        </Canvas>
      </div>
    </FormProvider>
  );
}
