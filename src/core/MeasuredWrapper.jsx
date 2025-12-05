import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function MeasuredWrapper({ index, onMeasure, children }) {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      onMeasure(index, size.y);
    }
  }, [children]);

  return <group ref={groupRef}>{children}</group>;
}

export default MeasuredWrapper;
