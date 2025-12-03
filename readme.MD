# R3Form

#### A React Three Fiber-based 3D form system for interactive UI elements in 3D space.  
---
![R3Form Preview](https://raw.githubusercontent.com/DevTomUK/r3form/refs/heads/main/dist/form.png)
---
#### ***`R3Form` allows you to build 3D forms with interactive inputs, dynamic borders, camera targeting, and smooth hover/press animations.***
---

## Features

- Fully 3D interactive form fields with text input.
- Structured form data is created automatically on submit.
- Dynamic borders that respond to hover, press, and active states.
- Smooth color and position animations using `lerp`.
- Automatic camera targeting when a field is focused.
- Compatible with `@react-three/fiber` and `@react-three/drei`.

---

## Installation

```bash
npm install r3form
# or
yarn add r3form
```

---

## Usage

![How to use R3Form](https://raw.githubusercontent.com/DevTomUK/r3form/refs/heads/main/dist/R3Form.png)
***Sorry, my Adobe membership ran out XD.***


Import required components from `r3form`.

```jsx
import { R3Form, Input3D, Button3D } from "r3form";
```


Inside your component, use the R3Form elements:
```jsx
function App() {
  return (
    <R3Form onSubmit={(vals) => submitForm(vals)}>
      <Input3D name="Username" position={[0, 2, 0]} />
      <Input3D name="Password" position={[0, 0, 0]} />
      <Button3D type="Submit" position={[0, -2, 0]}>
        Submit
      </Button3D>
    </R3Form>
  );
}
```
Structured form values are automatically passed to the onSubmit callback as an object:
```jsx
  function submitForm(vals) {
  }
```

Example:
```json
{
  "Username": "exampleUser",
  "Password": "examplePassword"
}
```


### Components

#### `<R3Form />`

The main container for your 3D form. Provides context for inputs, manages camera targeting, and handles submission.

**Props:**

- `children` (ReactNode) – The form fields/components (e.g., `<Input3D />`, `<Button3D />`).
- `onSubmit` (Function) – Callback that receives the form values object when submitting the form.
- `width` (string, default `"100%"`) – Width of the canvas.
- `height` (number, default `400`) – Height of the canvas.

**Usage Example:**

```jsx
<R3Form width="100%" height={500} onSubmit={(vals) => console.log(vals)}>
  ...
</R3Form>
```

---

#### `<Input3D />`

A 3D interactive input field.

**Props:**

- `name` (string) – Unique name of the field.
- `position` ([x, y, z], default `[0,0,0]`) – 3D position of the field.
- `width` (number, default `6`) – Width of the field.
- `height` (number, default `1`) – Height of the field.
- `borderWidth` (number, default `0.05`) – Thickness of the border.
- `borderHeight` (number, default `0.2`) – Z-height of the border.
- `setCameraTarget` (function, optional) – Callback to control the camera.
- `children` (function) – Render prop to render the 3D mesh with hover/active state.

```jsx
<Input3D name="Username" position={[0, 2, 0]} />
<Input3D name="Password" position={[0, 0, 0]} />

```

---

#### `<Button3D />`

A 3D interactive button.

**Props:**

- `type` (string, default `"button"`) – Button type, `"submit"` or `"button"`.
- `position` ([x, y, z], default `[0,0,0]`) – 3D position of the button.
- `children` (ReactNode) – Button label/content.

```jsx
<Button3D type="Submit" position={[0, -2, 0]}>Submit</Button3D>
```

---

### License

MIT © Tom H

---

### Notes

- Designed to work with stacked 3D elements; calculates maximum width and total height automatically for proper background sizing.
- Supports smooth hover and press animations with `lerp` for performance-friendly interactions.
- Integrates seamlessly with `@react-three/fiber` and `@react-three/drei`.
