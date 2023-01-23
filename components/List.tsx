import { useEffect, useState } from "react";
import { IPost } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Box from "./Box";
import Loader from "./Loader";

interface IListProps {
  data: IPost[];
  type: string;
  loadingRef: [any, any];
}

export default function List({ data, type, loadingRef }: IListProps) {
  const [loading, setLoading] = useState(false);
  const { setLastIntersecting } = useInfiniteScroll("searchPost");

  useEffect(() => {
    setLoading(false);
  }, [loadingRef[0]]);

  useEffect(() => {
    setLoading(true);
  }, [loadingRef[1]]);

  return (
    <>
      {type === "searchPost" && (
        <>
          <div className="grid grid-cols-3 mt-4 gap-y-2 gap-x-2">
            {(data as IPost[]).map((e, i) => (
              <>
                <div>
                  <Box
                    post={{ ...e, id: e.id }}
                    style={"search"}
                    key={e.id}
                  ></Box>
                </div>
                {i === data.length - 1 && <div ref={setLastIntersecting}></div>}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
    </>
  );
}
