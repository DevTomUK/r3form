import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";

export function useCameraController() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const [active, setActive] = useState(false);

  const setCameraTarget = (pos, lookAt) => {
    targetPos.current.copy(pos);
    targetLookAt.current.copy(lookAt);
    setActive(true);
  };

  useFrame(() => {
    if (!active) return;

    // Smoothly move camera position
    camera.position.lerp(targetPos.current, 0.01);

    // Smoothly rotate camera to look at target
    const desiredQuat = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    desiredQuat.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(camera.position, targetLookAt.current, up)
    );
    camera.quaternion.slerp(desiredQuat, 0.01);
  });

  return { setCameraTarget };
}
