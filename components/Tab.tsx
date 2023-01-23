import { useEffect, useState } from "react";
import Box from "./Box";
import {
  IPost,
  IUser,
  IDict,
  SIZE,
  ITag,
  IType,
  IRoute,
  getRoute,
} from "../custom";
import { HiArrowLeft } from "react-icons/hi";
import Cont from "./Cont";
import MotionFloat from "../motions/motionFloat";
import ProfileSmall from "./ProfileSmall";
import { getData } from "../apis/firebase";
import { RiHashtag } from "react-icons/ri";
import List from "./List";
import { useStore } from "../apis/zustand";
import { useRouter } from "next/router";

interface ITabProps {
  data?: IDict<any[] | IDict<any>>;
  tab: string[][];
}

export default function Tab({ data, tab }: ITabProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { gSearch, gPage } = useStore();
  const router = useRouter();
  const route = getRoute(router);

  return (
    <>
      <div className="flex justify-around mb-4">
        {tab.map((each, i) => (
          <div
            className="w-full py-2 text-center border-b-2 text-gray-2 hover:cursor-pointer"
            id={selectedTab === i ? "d1" : ""}
            onClick={() => setSelectedTab(i)}
            key={i}
          >
            {each[0]}
          </div>
        ))}
      </div>
      {tab.map((each, i) => {
        const [key, type] = each;
        if (selectedTab === i) {
          if (type === "post") {
            return (
              <>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                  {data &&
                    data[key].map((e: IPost) => (
                      <>
                        <Box
                          post={{ ...e, id: e.id }}
                          style={`${route}`}
                          key={e.id}
                        ></Box>
                      </>
                    ))}
                </div>
              </>
            );
          } else if (type === "list") {
            return (
              <List
                data={gSearch.tags}
                type="tag"
                loadingRef={[gPage.search.tag, gSearch.tags]}
                key={i}
              />
            );
          }
          // TODO: cont를 클릭했을때 화면이 위로 가는현상 고치기
          else if (type === "cont") {
            return (
              <>
                {/* <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                  {selected[key] !== "" && (
                    <div className="mb-2 hover:cursor-pointer">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, [key]: "" })}
                      />
                    </div>
                  )}
                  {(() => {
                    const datas = data[key] as IDict<any>;
                    if (selected[key] === "") {
                      const result = [];
                      for (const data in datas) {
                        result.push(
                          <Cont
                            tag={data}
                            posts={datas[data]}
                            onClick={() =>
                              setSelected({ ...selected, [key]: data })
                            }
                          />
                        );
                      }
                      return result;
                    } else {
                      return (
                        <>
                          {datas[selected[key]].map((e: IPost) => (
                            <Box post={e} style="profile" key={e.id} />
                          ))}
                        </>
                      );
                    }
                  })()}
                </div> */}
              </>
            );
          } else if (type === "user") {
            return (
              <>
                {data &&
                  data[key].map((user: IUser) => (
                    <MotionFloat key={user.id}>
                      <ProfileSmall user={user} type="post" key={user.id} />
                    </MotionFloat>
                  ))}
              </>
            );
          }
        }
      })}

      <style jsx>{`
        #d1 {
          font-weight: bold;
          color: black;
        }
      `}</style>
    </>
  );
}
