import { useEffect, forwardRef } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { IDict } from "../../libs/custom";
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
          id="textarea_t1"
          style={style}
          className="block w-full px-2 py-1 text-base font-normal transition ease-in-out border-2 border-solid rounded-lg resize-none form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none"
        />
      </>
    );
  }
);
