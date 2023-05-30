import React, { useState } from "react";

export default function useFormTag(initTags: string[] = []) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(initTags ? initTags : []);
  const [error, setError] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTag(e.target.value);
  }
  function onDelete(e: React.MouseEvent<HTMLSpanElement>) {
    const tag = e.currentTarget.id;
    const tagIndex = tags.findIndex((elem) => elem === tag);
    const tempTags = [
      ...[...tags].slice(0, tagIndex),
      ...[...tags].slice(tagIndex + 1, [...tags].length),
    ];
    setTags(tempTags);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (
      e.key === "Enter" &&
      !e.nativeEvent.isComposing &&
      (e.target as HTMLElement).id !== "txt"
    ) {
      e.preventDefault();
      addTag();
    }
  }
  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    addTag();
  }

  function addTag() {
    const newTag = tag;
    if (tags.length === 5) {
      setError("태그는 최대 5개까지 추가할 수 있습니다.");
      return;
    } else if (newTag.includes(" ")) {
      setError("태그에는 공백 문자를 포함할 수 없습니다.");
      return;
    }
    let tempTags = [...tags];
    const tagIndex = tempTags.findIndex((tempTag) => {
      return tempTag === newTag;
    });
    if (tagIndex === -1) {
      tempTags.push(newTag);
    } else {
      tempTags = [
        ...tempTags.slice(0, tagIndex),
        ...tempTags.slice(tagIndex + 1, tempTags.length),
      ];
      tempTags.unshift(newTag);
    }
    setTags(tempTags);
    setTag("");
    setError("");
  }

  return { tag, tags, error, onChange, onDelete, onKeyDown, onClick, setTag };
}
