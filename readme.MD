# R3Form

#### A React Three Fiber-based 3D form system for interactive UI elements in 3D space.  
---
![R3Form Preview](https://github.com/DevTomUK/r3form/blob/main/r3form.png?raw=true)
---
#### ***`R3Form` allows you to build 3D forms with interactive inputs, dynamic borders, camera targeting, and smooth hover/press animations.***
---

## Features

- Fully 3D interactive form fields with text or switch input.
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

Click below to watch the video guide, or follow the steps below:

[![Watch the video](https://github.com/DevTomUK/r3form/blob/main/r3formYT.png?raw=true)](https://youtu.be/YyEQybPI8i0)


Import required components from `r3form`.

```jsx
import { R3Form, Input3D, SubmitButton } from "r3form";
```


Inside your component, use the R3Form elements:
```jsx
function App() {
  return (
    <R3Form onSubmit={(vals) => submitForm(vals)}>
      <Input3D name="First Name" />
      <Input3D name="Surname" />
      <SubmitButton type="Submit">
        Submit
      </SubmitButton>
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
  "First Name": "Tom",
  "Surname": "H"
}
```


### Components

#### `<R3Form />`

The main container for your 3D form. Provides context for inputs, manages camera targeting, styling, and handles submission.

**Props:**

- `children` (ReactNode) – The form fields/components (e.g., `<Input3D />`, `<Button3D />`).
- `onSubmit` (Function) – Callback that receives the form values object when submitting the form.
- `width` (string || number, default `"100%"`) – Width of the canvas container.
- `height` (string || number, default `100%`) – Height of the canvas container.
- `cameraPosition` (string, default `"front"`) – Camera position relative to the form (e.g., `"front"`, `"back"`, `"left"`, `"right"`).
- `shadows` (boolean, default `true`) – Enable or disable shadows in the 3D scene.
- `background` (boolean, default `true`) – Enable or disable the 3D background.
- `formColor` (string, default `"#ffd700"`) – Color of the 3D form plane.
- `backgroundColor` (string, default `"#defdfe"`) – Background color of the container.
- `formWidth` (number, default `6`) – Width of the 3D form in scene units.
- `formHeight` (number, default `6`) – Height of the 3D form in scene units.
- `padding` (number, default `1`) – Padding around the form in 3D space.
- `gap` (number, default `0.5`) – Vertical gap between form elements in 3D space.
- `zoom` (number, default `1`) – Zoom factor for calculating camera distance from the form.


**Usage Example:**

```jsx
<R3Form width="100%" height="200px" onSubmit={(vals) => console.log(vals)}>
  ...
</R3Form>
```

---

#### `<Input3D />`

A 3D interactive input field.

**Props:**

- `name` (string) – Unique name of the input field.
- `position` ([x, y, z], default `[0, 0, 0]`) – 3D position of the field in the scene.
- `width` (number, default `6`) – Width of the field.
- `height` (number, default `1`) – Height of the field.
- `borderWidth` (number, default `0.05`) – Thickness of the field border.
- `borderDepth` (number, default `0.1`) – Z-depth of the border.
- `hoverDepth` (number, default `0.1`) – Z-offset applied on hover.
- `showFieldBackground` (boolean, default `false`) – Whether to display a background plane behind the input.
- `heightPos` (number, default `0`) – Vertical position offset in the 3D form layout.


```jsx
<Input3D name="Username" />
<Input3D name="Password" />

```

---

#### `<SubmitButton />`

A 3D interactive button.

**Props:**

- `width` (number, optional) – Width of the button. Defaults to BaseButton default if not provided.
- `height` (number, optional) – Height of the button. Defaults to BaseButton default if not provided.
- `depth` (number, optional) – Depth (Z-size) of the button. Defaults to BaseButton default if not provided.
- `radius` (number, optional) – Corner radius of the button. Defaults to BaseButton default if not provided.
- `smoothness` (number, optional) – Number of segments for the rounded corners. Defaults to BaseButton default if not provided.
- `color` (string, optional, default `"#00cc88"`) – Button color when not hovered.
- `hoverColor` (string, optional, default `"#00ffaa"`) – Button color on hover.
- `pressDepth` (number, optional) – Z-offset applied when the button is pressed. Defaults to BaseButton default.
- `label` (string, optional, default `"Submit"`) – Text displayed on the button.
- `fontSize` (number, optional) – Size of the text label. Defaults to BaseButton default if not provided.
- `heightPos` (number, optional, default `0`) – Vertical position of the button in the 3D scene.


```jsx
<SubmitButton>Submit</SubmitButton>
```

---

### License

MIT © Tom H

---

### Notes

- Designed to work with stacked 3D elements; calculates height position and gaps for elements from form height.
- Supports smooth hover and press animations with `lerp` for performance-friendly interactions.
- Integrates seamlessly with `@react-three/fiber` and `@react-three/drei`.
- Still in development - please fork the repo if you'd like to contribute!