import { Children, useState } from "react";
import PostBox from "./PostBox";
import { IPost, IUser, IDict, ITag, IRoute, getRoute } from "../libs/custom";
import WrapMotion from "./wrappers/WrapMotion";
import ProfileSmall from "./Profile";
import List from "./views/List";

interface ITabProps {
  data: IDict<IPost[] | ITag[] | IUser[] | IDict<IPost[]>>;
  tab: string[][];
  route: IRoute;
}

export default function Tab({ data, tab, route }: ITabProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <div className="flex justify-around mb-4">
        {Children.toArray(
          tab.map((each, i) => (
            <div
              className="w-full py-2 text-center border-b-2 text-gray-2 hover:cursor-pointer"
              id={selectedTab === i ? "d1" : ""}
              onClick={() => setSelectedTab(i)}
            >
              {each[0]}
            </div>
          ))
        )}
      </div>
      {Children.toArray(
        tab.map((each, i) => {
          const [key, type] = each;
          if (selectedTab === i) {
            if (type === "post") {
              return (
                <>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                    {(data[key] as IPost[]).map((e) => (
                      <>
                        <PostBox
                          post={{ ...e, id: e.id }}
                          includeTitle
                        ></PostBox>
                      </>
                    ))}
                  </div>
                </>
              );
            } else if (type === "list") {
              return (
                <>
                  <List data={data[key] as ITag[]} type="tag" route={route} />
                </>
              );
            }
            // TODO: cont를 클릭했을때 화면이 위로 가는현상 고치기
            else if (type === "cont") {
              return (
                <>
                  {key === "tag" && (
                    <List
                      data={data[key] as IDict<IPost[]>}
                      type="tag"
                      route={route}
                    />
                  )}
                  {key === "scrap" && (
                    <List
                      data={data[key] as IDict<IPost[]>}
                      type="scrap"
                      route={route}
                    />
                  )}
                </>
              );
            } else if (type === "user") {
              return (
                <>
                  {(data[key] as IUser[]).map((user) => (
                    <WrapMotion type="float">
                      <ProfileSmall user={user} info="intro" />
                    </WrapMotion>
                  ))}
                </>
              );
            }
          }
        })
      )}

      <style jsx>{`
        #d1 {
          font-weight: bold;
          color: black;
        }
      `}</style>
    </>
  );
}
