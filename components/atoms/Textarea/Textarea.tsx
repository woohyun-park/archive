import ReactTextareaAutosize from "react-textarea-autosize";
import { forwardRef } from "react";
type Props = {
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { value, placeholder, onChange },
  ref
) {
  return (
    <ReactTextareaAutosize
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      minRows={5}
      className="block w-full h-8 px-2 py-2 text-base leading-5 transition ease-in-out border-2 border-solid rounded-lg resize-none text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none"
    />
  );
});

export default Textarea;
