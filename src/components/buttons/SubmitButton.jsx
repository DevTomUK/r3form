import { useFormContext } from "../../core/FormContext";
import BaseButton from "./BaseButton";

export default function SubmitButton({ heightPos }) {
  const { submit } = useFormContext();
  return (
    <BaseButton
      label="Submit"
      onClick={submit}
      color="#00cc88"
      hoverColor="#00ffaa"
      heightPos={heightPos}
    />
  );
}
