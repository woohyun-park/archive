import InputIcon from "components/atoms/InputIcon";
import { WrapMotionSlide } from "components/wrappers/motion";
import { AnimatePresence } from "framer-motion";
import { useForwardRef } from "hooks";
import { forwardRef, Ref } from "react";

type Props = {
  keyword: string;
  setKeyword: Function;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  onSearch: () => void;
  refetch: Function;
};

const SearchBar = (
  {
    keyword,
    setKeyword,
    isSearching,
    setIsSearching,
    onSearch,
    refetch,
  }: Props,
  ref: Ref<HTMLDivElement>
) => {
  const forwardRef = useForwardRef<HTMLDivElement>(ref);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value);
  };
  const handleClear = () => {
    setKeyword("");
    forwardRef.current.focus();
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && onSearch();
  };

  return (
    <div className="flex p-4" ref={forwardRef}>
      <div className="w-full">
        <InputIcon
          icon="search"
          keyword={keyword}
          onChange={handleChange}
          onClear={handleClear}
          onKeyDown={handleKeyDown}
          onFocus={async () => {
            await refetch();
            setIsSearching(true);
          }}
        />
      </div>
      <AnimatePresence>
        {isSearching && (
          <WrapMotionSlide
            className="flex items-center justify-end w-12 hover:cursor-pointer"
            key="searchBarSearch_cancel"
            direction="x"
            offset="48px"
            onClick={() => setIsSearching(false)}
          >
            취소
          </WrapMotionSlide>
        )}
      </AnimatePresence>
    </div>
  );
};
export default forwardRef<HTMLDivElement, Props>(SearchBar);
