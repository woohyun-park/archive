import InputIcon from "components/atoms/InputIcon";
import useForwardRef from "hooks/useForwardRef";
import { forwardRef, Ref } from "react";
import { AnimatePresence } from "framer-motion";
import { WrapMotionSlide } from "components/wrappers/motion";
import { useCustomRouter } from "hooks";
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.currentTarget.value);
  }

  function handleClear() {
    setKeyword("");
    forwardRef.current.focus();
  }

  const router = useCustomRouter();
  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

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
            console.log(await refetch());
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
