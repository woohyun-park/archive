import { useRouter } from "next/router";

export default function Tag({}) {
  const router = useRouter();
  const params = router.query.params || [];
  console.log(params);
  return (
    <div>
      <h4>tag</h4>
    </div>
  );
}

// export function getServerSideProps({ params: { params } }) {
//   return {
//     props: {
//       params,
//     },
//   };
// }
