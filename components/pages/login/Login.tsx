import { WrapMotionFloat } from "components/wrappers/motion";
import Image from "next/image";
import { Children, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiGoogleFill } from "react-icons/ri";
import { SIZE } from "apis/def";
import { useCustomRouter } from "hooks";
import { AUTH_ONBOARDING_MESSAGE } from "consts/auth";

type Props = {
  onSocialLogin: () => void;
};

export default function Login({ onSocialLogin }: Props) {
  const [page, setPage] = useState(0);
  const router = useCustomRouter();

  useEffect(() => {
    if (router.pathname !== "/") router.push("/");
  }, []);

  return (
    <div className="flex flex-col w-full h-[100vh] p-4 justify-between overflow-hidden">
      <h1 className="z-10 hover:cursor-pointer title-logo">archive</h1>
      <div className="flex flex-col items-center mt-8 mb-16 text-3xl absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        {Children.toArray(
          AUTH_ONBOARDING_MESSAGE.map((e, i) =>
            i === page ? (
              <WrapMotionFloat>
                <Image
                  src={e[1]}
                  alt=""
                  className="w-full bg-white min-h-[20rem]"
                />
                <div className="mb-8 -mt-8 text-lg leading-5 text-center">
                  {e[0]}
                </div>
              </WrapMotionFloat>
            ) : (
              <></>
            )
          )
        )}
        <div className="flex justify-between m-auto mt-2 mb-[4rem] w-14">
          {Children.toArray(
            AUTH_ONBOARDING_MESSAGE.map((e, i) =>
              i === page ? (
                <motion.div
                  className="w-6 h-3 duration-300 ease-in-out rounded-full bg-gray-2f hover:cursor-pointer"
                  onClick={() => setPage(i)}
                ></motion.div>
              ) : (
                <motion.div
                  className="w-3 h-3 duration-300 ease-in-out rounded-full bg-gray-3 hover:cursor-pointer"
                  onClick={() => setPage(i)}
                ></motion.div>
              )
            )
          )}
        </div>
        <div className="flex justify-center mt-4 mb-8">
          <button
            className="relative flex items-center justify-between w-48 p-2 m-2 text-white bg-black rounded-full"
            onClick={onSocialLogin}
          >
            <RiGoogleFill size={SIZE.iconSm} />
            <div className="w-full text-sm -translate-x-2">구글로 로그인</div>
          </button>
        </div>
      </div>
    </div>
  );
}
