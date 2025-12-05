import * as React from "react";

export interface R3FormProps {
  children?: React.ReactNode;
  onSubmit?: (formValues: Record<string, any>) => void;
  width?: string | number;
  height?: string | number;
  cameraPosition?: "front" | "back" | "left" | "right" | string;
  shadows?: boolean;
  background?: boolean;
  formColor?: string;
  backgroundColor?: string;
  formWidth?: number;
  formHeight?: number;
  padding?: number;
  gap?: number;
  zoom?: number;
}

export const R3Form: React.FC<R3FormProps>;

export interface Input3DProps {
  name: string;
  position?: [number, number, number];
  width?: number;
  height?: number;
  borderWidth?: number;
  borderDepth?: number;
  hoverDepth?: number;
  showFieldBackground?: boolean;
  heightPos?: number;
}

export const Input3D: React.FC<Input3DProps>;

export interface Switch3DProps {
  name: string;
  position?: [number, number, number];
  width?: number;
  switchWidth?: number;
  height?: number;
  borderWidth?: number;
  borderDepth?: number;
  toggleWidth?: number;
  heightPos?: number;
}

export const Switch3D: React.FC<Switch3DProps>;

export interface FormContextType {
  values: Record<string, any>;
  setValue: (name: string, value: any) => void;
  submit: () => void;
}

export const FormProvider: React.FC<{ onSubmit?: (data: any) => void }>;
export function useFormContext(): FormContextType;

export interface BaseButtonProps {
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  smoothness?: number;
  color?: string;
  hoverColor?: string;
  pressDepth?: number;
  label?: string;
  fontSize?: number;
  heightPos?: number;
  onClick?: () => void;
}

export const BaseButton: React.FC<any>;

export interface SubmitButtonProps
  extends Omit<BaseButtonProps, "label" | "onClick"> {
  heightPos?: number;
}

export const SubmitButton: React.FC<SubmitButtonProps>;
