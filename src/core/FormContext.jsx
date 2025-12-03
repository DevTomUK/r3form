import React, { createContext, useContext, useState } from "react";

const FormContext = createContext(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be inside <R3Form>");
  return ctx;
}

export function FormProvider({ children, onSubmit }) {
  const [values, setValues] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const setValue = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const submit = () => onSubmit?.(values);

  return (
    <FormContext.Provider
      value={{
        values,
        setValue,
        focusedInput,
        setFocusedInput,
        submit,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
