import React, { Children } from "react";
import { HiX } from "react-icons/hi";

interface IFormTag {
  tag: string;
  tags: string[];
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
}

export default function FormTag({
  tag,
  tags,
  error,
  onChange,
  onDelete,
  onClick,
  isActive,
}: IFormTag) {
  return (
    <>
      <div className="inputForm">
        <div className="inputForm_left">
          <label className="mr-1 inputForm_label">태그</label>
          <div className="inputForm_txt">{`${tags.length}/5`}</div>
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
      <div className="flex items-center justify-end w-full mb-4">
        <input
          onChange={onChange}
          value={tag}
          maxLength={16}
          id="tag"
          className="input-base"
        />
        <div
          className={
            isActive
              ? "absolute m-2 text-2xl font-bold hover:cursor-pointer text-black"
              : "absolute m-2 text-2xl font-bold hover:cursor-pointer text-gray-2"
          }
          onClick={onClick}
        >
          +
        </div>
      </div>
    </>
  );
}
