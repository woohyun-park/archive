import { forwardRef } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { IDict } from "../../apis/def";
interface ITextareaProps {
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
  style?: IDict<string>;
}

export default forwardRef<HTMLTextAreaElement, ITextareaProps>(
  function Textarea({ value, placeholder, onChange, autoFocus, style }, ref) {
    return (
      <>
        <ReactTextareaAutosize
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          ref={ref}
          autoFocus={autoFocus}
          style={style}
          className="textarea-base"
        />
      </>
    );
  }
);
