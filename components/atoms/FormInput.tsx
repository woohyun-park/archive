import { UseFormRegister, UseFormWatch } from "react-hook-form";
import ReactTextareaAutosize from "react-textarea-autosize";

interface IFormInput {
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
  type: "textarea";
  name: string;
  maxLength?: number;
  minRows?: number;
}

export default function FormInput({
  watch,
  register,
  name,
  maxLength = 2000,
  minRows = 10,
}: IFormInput) {
  return (
    <>
      <div className="inputForm">
        <label className="inputForm_label">내용 *</label>
        <div
          className={
            watch(name).length === 0
              ? "inputForm_txt inputForm_txt-invalid "
              : "inputForm_txt"
          }
        >{`${watch(name).length}/${maxLength}`}</div>
      </div>
      <ReactTextareaAutosize
        {...register("txt", { required: true, maxLength })}
        maxLength={maxLength}
        minRows={minRows}
        id={name}
        className="h-32 resize-none inputForm_input"
      />
    </>
  );
}
