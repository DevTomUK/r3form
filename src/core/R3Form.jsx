import React from "react";
import { Canvas } from "@react-three/fiber";
import { FormProvider } from "./FormContext";
import { OrbitControls } from "@react-three/drei";
import Background from "./Background";
import getCameraPosition from "../utils/getCameraPosition";

export default function R3Form({
  children,
  onSubmit,
  width = "100%",
  height = "100%",
  cameraPosition = "front",
  shadows = true,
  background = true,
  formColor = "#ffd700",
  backgroundColor = "#defdfe",
  formWidth = 6,
  formHeight = 6,
  padding = 1,
  gap = 0.5,
  zoom = 1
}) {

  let cameraDistance = formHeight + 2 * (1 / zoom)

  return (
    <FormProvider onSubmit={onSubmit}>
      <div style={{ width, height, backgroundColor }}>
        <Canvas
          shadows={shadows}
          camera={{ position: getCameraPosition(cameraPosition, cameraDistance, formHeight) }}
        >
          <OrbitControls />
            <Background visible={background} formHeight={formHeight} formWidth={formWidth} padding={padding} formColor={formColor} />
          
          <ambientLight intensity={0.8} />
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

{React.Children.map(children, (child, index) => {
  const yOffset = formHeight / 2 - ((1 + gap) * index);
  return React.cloneElement(child, { width: formWidth, heightPos: yOffset });
})}

        </Canvas>
      </div>
    </FormProvider>
  );
}
