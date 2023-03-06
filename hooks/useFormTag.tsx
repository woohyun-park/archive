import { useState } from "react";

export const useFormTag = (initTags: string[] = []) => {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(initTags ? initTags : []);
  const [error, setError] = useState("");
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const newTag = e.target.value.split(" ")[0];
    if (newTag === " ") {
      setTag("");
    } else if (e.target.value.split(" ").length === 1) {
      if (newTag.length > 16) {
        return;
      }
      setTag(newTag);
    } else {
      if (tags.length === 5) {
        setError("태그는 최대 5개까지 추가할 수 있습니다.");
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
    }
    setError("");
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
  function checkKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && (e.target as HTMLElement).id !== "txt")
      e.preventDefault();
  }

  return { tag, tags, error, onChange, onDelete, setTag };
};
