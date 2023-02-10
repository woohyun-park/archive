import { Children } from "react";
import { HiX } from "react-icons/hi";

interface IFormTag {
  tag: string;
  tags: string[];
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  orderFirst?: "tag" | "input";
}

export default function FormTag({
  tag,
  tags,
  error,
  onChange,
  onDelete,
}: IFormTag) {
  return (
    <>
      <div className="inputForm">
        <div className="inputForm_left">
          <label className="mr-1 inputForm_label">태그</label>
          <div className="inputForm_txt">{!error && `${tags.length}/5`}</div>
        </div>
        <div
          className={
            tag.length === 0 || error !== ""
              ? "inputForm_txt inputForm_txt-invalid "
              : "inputForm_txt"
          }
        >
          {!error ? `${tag.length}/16` : error}
        </div>
      </div>
      <div className="flex flex-wrap">
        {Children.toArray(
          tags.map((each) => (
            <span className="flex my-1 mr-1 button-black w-fit hover:cursor-pointer">
              <span className="mr-1">{each}</span>
              <span className="text-white" id={each} onClick={onDelete}>
                <HiX />
              </span>
            </span>
          ))
        )}
      </div>
      <input
        onChange={onChange}
        value={tag}
        maxLength={17}
        id="tag"
        className="mb-4 input-base"
      />
    </>
  );
}
