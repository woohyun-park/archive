import { SIZE } from "../apis/def";
import { HiX } from "react-icons/hi";
import React, { Children, useRef, useState } from "react";
import { useRouter } from "next/router";
import WrapMotion from "../components/wrappers/WrapMotion";
import { useUser } from "../stores/useUser";
import InputIcon from "../components/atoms/InputIcon";
import { updateUser } from "../apis/fbUpdate";
import useCustomRouter from "../hooks/useCustomRouter";
import { AnimatePresence } from "framer-motion";
import BtnIcon from "../components/atoms/BtnIcon";

export default function Search() {
  const router = useCustomRouter();
  const [keyword, setKeyword] = useState("");
  const recentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { curUser } = useUser();

  function updateHistory(keyword: string) {
    if (curUser.history) {
      const index = curUser.history.indexOf(keyword);
      console.log("updateHistory", index, curUser.history[index]);
      index === -1
        ? updateUser({
            ...curUser,
            history: [keyword, ...curUser.history],
          })
        : updateUser({
            ...curUser,
            history: [
              keyword,
              ...curUser.history.slice(0, index),
              ...curUser.history.slice(index + 1, curUser.history.length),
            ],
          });
    } else {
      updateUser({
        ...curUser,
        history: [keyword],
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.currentTarget.value);
  }

  function handleDelete() {
    setKeyword("");
    searchRef.current?.focus();
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      updateHistory(keyword);
      router.push(`/search/${keyword}`);
    }
  }

  function handleDeleteHistoryAll(e: React.MouseEvent<HTMLElement>) {
    updateUser({
      ...curUser,
      history: [],
    });
  }

  function handleDeleteHistory(e: React.MouseEvent<HTMLElement>) {
    const history = curUser.history;
    const id = e.currentTarget.id;
    if (history) {
      updateUser({
        ...curUser,
        history: [
          ...history.slice(0, Number(id)),
          ...history.slice(Number(id) + 1, history.length),
        ],
      });
    }
  }

  return (
    <div className="p-4 pt-2">
      <div className="flex w-full">
        <div className="w-full">
          <InputIcon
            icon="search"
            keyword={keyword}
            onChange={handleChange}
            onDelete={handleDelete}
            onKeyDown={handleSearch}
            style="margin: 0"
            ref={searchRef}
          />
        </div>
        <div
          className="flex items-center justify-end ml-3 mr-1 min-w-fit hover:cursor-pointer"
          onClick={() => router.push("/search")}
        >
          취소
        </div>
      </div>
      <WrapMotion type="fade">
        <div ref={recentRef}>
          <div className="relative">
            <div className="absolute z-10 w-full bg-white">
              <div className="flex justify-between my-4 text-xs text-gray-2">
                <div>최근 검색어</div>
                <div
                  className="hover:cursor-pointer"
                  onClick={handleDeleteHistoryAll}
                >
                  모두 삭제
                </div>
              </div>
              <AnimatePresence>
                {Children.toArray(
                  [...(curUser.history || [])]
                    ?.filter(
                      (each) => keyword === "" || each.indexOf(keyword) === 0
                    )
                    .map((e, i) => (
                      <WrapMotion type="float" key={e}>
                        <div className="flex items-center justify-between my-4 text-sm text-black">
                          <div
                            className="w-full hover:cursor-pointer"
                            onClick={() => {
                              updateHistory(e);
                              router.push(`/search/${e}`);
                            }}
                          >
                            {e}
                          </div>
                          <div
                            className="flex items-center hover:cursor-pointer"
                            id={String(i)}
                            onClick={handleDeleteHistory}
                          >
                            <BtnIcon icon="delete" size={SIZE.iconXs} />
                          </div>
                        </div>
                      </WrapMotion>
                    ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </WrapMotion>
    </div>
  );
}
