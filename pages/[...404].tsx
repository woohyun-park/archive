import PageError from "../components/templates/PageError";

// 원래 next.js에서는 pages/404 파일을 만들면 매칭되지 않는 페이지로 이동할때 해당 페이지를 띄워주는데,
// 무슨 이유에서인지 'attempted to hard navigate to the same URL'이라는 에러가 발생했다.
// pages/[...404]와 같은 형식으로 파일을 만들면 custom 404 page와 비슷하게 동작한다는 workaround를 발견하여 적용하였다.

// 참조: https://github.com/vercel/next.js/issues/43088

export default function ErrorPage() {
  return <PageError />;
}
