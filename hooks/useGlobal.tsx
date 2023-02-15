import { useEffect, useState } from "react";
import { IDict, IPost } from "../libs/custom";
import { IFetchType } from "../libs/queryLib";
import { useCache } from "../stores/useCache";
import { useFeed } from "../stores/useFeed";
import { useSearch } from "../stores/useSearch";

export const useGlobal = () => {
  const feed = useFeed();
  const search = useSearch();
  const { cachedPosts, setCachedPosts } = useCache();

  useEffect(() => {
    feed.setPosts(feed.posts.map((post) => cachedPosts[post.id || ""]));
    feed.setFilteredPosts(
      feed.filteredPosts.map((post) => cachedPosts[post.id || ""])
    );
    search.setPosts(search.posts.map((post) => cachedPosts[post.id || ""]));
  }, [cachedPosts]);

  function updateCachedPosts(newPosts: IPost[]) {
    const updatedPosts: IDict<IPost> = { ...cachedPosts };
    newPosts.forEach((post) => (updatedPosts[post.id || ""] = post));
    setCachedPosts(updatedPosts);
  }

  async function getFeed(type: IFetchType, uid: string) {
    const newPosts = await feed.getPosts(type, uid);
    updateCachedPosts(newPosts);
  }

  async function getFilteredFeed(type: IFetchType, uid: string, tag: string) {
    const newPosts = await feed.getFilteredPosts(type, uid, tag);
    updateCachedPosts(newPosts);
  }

  async function getSearch(type: IFetchType) {
    const newPosts = await search.getPosts(type);
    updateCachedPosts(newPosts);
  }

  return { getFeed, getFilteredFeed, getSearch };
};
