export default function getCameraPosition(cameraPosition, cameraDistance, formHeight) {

  const half = formHeight / 2

  switch (cameraPosition) {

    case "front":
      return [0, 0, cameraDistance];
    case "top":
      return [0, half, cameraDistance];
    case "left":
      return [-half, 0, cameraDistance];
    case "right":
      return [half, 0, cameraDistance];
    case "bottom":
      return [0, -half, cameraDistance];
    case "top-left":
      return [-half, half, cameraDistance];
    case "top-right":
      return [half, half, cameraDistance];
    case "bottom-left":
      return [-half, -half, cameraDistance];
    case "bottom-right":
      return [half, -half, cameraDistance];

    default:
      return [0, 0, cameraDistance];
  }
}
