import { UseFormRegister, UseFormWatch } from "react-hook-form";
import ReactTextareaAutosize from "react-textarea-autosize";

interface IFormInput {
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  type: "text" | "textarea";
  name: string;
  txt: string;
  required?: boolean;
  maxLength?: number;
  minRows?: number;
}

export default function FormInput({
  watch,
  register,
  type,
  name,
  txt,
  required = true,
  maxLength = 32,
  minRows = 10,
}: IFormInput) {
  return (
    <>
      <div className="inputForm">
        <label className="inputForm_label">
          {txt} {required && "*"}
        </label>
        <div
          className={
            watch(name).length === 0
              ? "inputForm_txt inputForm_txt-invalid "
              : "inputForm_txt"
          }
        >{`${watch(name).length}/${maxLength}`}</div>
      </div>
      {type === "text" && (
        <input
          {...register(name, { required: true, maxLength })}
          type="text"
          maxLength={32}
          id={name}
          className="inputForm_input"
        />
      )}
      {type === "textarea" && (
        <ReactTextareaAutosize
          {...register(name, {
            required: true,
            maxLength,
          })}
          maxLength={maxLength}
          minRows={minRows}
          id={name}
          className="h-32 resize-none inputForm_input"
        />
      )}
    </>
  );
}