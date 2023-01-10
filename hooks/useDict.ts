import {
  useState,
  useCallback,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { FUNC, IDict } from "../custom";

type IUseDict = [Array<unknown>, Dispatch<SetStateAction<string[]>>];

const useDict = (data: IDict<boolean>): IUseDict => {
  const [dict, setDict] = useState(() => {
    const result = [];
    for (const each in FUNC.filterFalse(data)) {
      result.push(each);
    }
    return result;
  });

  return [dict, setDict];
};

export default useDict;
