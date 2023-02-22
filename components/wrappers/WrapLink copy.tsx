import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Loader from "../Loader";

interface IWrapRefresh {
  children: React.ReactNode;
  loading: boolean;
  onRefresh: () => Promise<any>;
}

export default function WrapRefreshAndLoad({
  children,
  loading,
  onRefresh,
}: IWrapRefresh) {
  return (
    <>
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<Loader isVisible={true} />}
        isPullable={true}
        className="min-h-[50vh]"
      >
        {children}
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
