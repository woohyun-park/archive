import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { Children, useEffect, useState } from "react";
import { auth, db } from "../apis/firebase";
import Nav from "./Nav";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { COLOR, DEFAULT, IAlarm, IUser, SIZE } from "../libs/custom";
import { useUser } from "../stores/useUser";
import Btn from "../components/atoms/Btn";
import { motion } from "framer-motion";
import Image from "next/image";
import WrapMotion from "./wrappers/WrapMotion";
import { RiAppleFill, RiGoogleFill, RiKakaoTalkLine } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import ScrollTop from "./atoms/ScrollTop";
import ModalLoader from "./ModalLoader";
import { useStatus } from "../stores/useStatus";
import onboarding_1 from "../imgs/onboarding_1.svg";
import onboarding_2 from "../imgs/onboarding_2.svg";
import onboarding_3 from "../imgs/onboarding_3.svg";
import { readAlarm } from "../apis/fbRead";
import useCustomRouter from "../hooks/useCustomRouter";
import Modal from "./Modal";
import icon_smile from "../imgs/icon_smile.svg";

interface ILayoutProps {
  children: React.ReactNode;
}

interface ILogin {
  email: string;
  password: string;
  isNewAccount: boolean;
  isLoggedIn: boolean | null;
  error: string;
}

export default function Layout({ children }: ILayoutProps) {
  const provider = new GoogleAuthProvider();
  const router = useCustomRouter();
  const { getCurUser } = useUser();
  const { modalLoader, logoutLoader } = useStatus();
  const [login, setLogin] = useState<ILogin>({
    email: "",
    password: "",
    isNewAccount: false,
    isLoggedIn: null,
    error: "",
  });
  const { curUser, hasNewAlarms, setHasNewAlarms } = useUser();

  const path = router.asPath;

  useEffect(() => {
    auth.onAuthStateChanged(async (authState) => {
      if (authState) {
        const user = await getCurUser(authState.uid);
        setLogin({ ...login, isLoggedIn: true });
      } else {
        setLogin({ ...login, isLoggedIn: false });
      }
    });
  }, []);

  useEffect(() => {
    const hasNewAlarms =
      curUser.alarms?.filter((alarm) => !alarm.isViewed).length === 0
        ? false
        : true;
    setHasNewAlarms(hasNewAlarms);
  }, [curUser.alarms]);

  // useEffect(() => {
  //   !login.isLoggedIn && router.replace("/");
  // }, [login.isLoggedIn]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const user = res.user;
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.data()) {
          const tempUser: IUser = {
            ...DEFAULT.user,
            id: user.uid,
            email: String(user.email),
            displayName: `아카이버-${user.uid.slice(0, 11)}`,
          };
          await setDoc(doc(db, "users", user.uid), tempUser);
        }
        router.push("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (login.isNewAccount) {
        const res = await createUserWithEmailAndPassword(
          auth,
          login.email,
          login.password
        );
        const user = res.user;
        const tempUser: IUser = {
          ...DEFAULT.user,
          id: user.uid,
          email: String(user.email),
          displayName: `아카이버-${user.uid.slice(0, 11)}`,
        };
        await setDoc(doc(db, "users", user.uid), tempUser);
      } else {
        await signInWithEmailAndPassword(auth, login.email, login.password);
      }
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        setLogin({ ...login, error: e.message });
      }
    }
  }

  const [page, setPage] = useState(0);
  const message: [JSX.Element, string][] = [
    [
      <>
        나의 일상과 취향을
        <br />
        한곳에 아카이브해요
      </>,
      onboarding_1,
    ],
    [
      <>
        나만의 태그를 통해
        <br />
        손쉽게 분류하고 검색해요
      </>,
      onboarding_2,
    ],
    [
      <>
        같은 관심사를 가진 사람들의
        <br />
        아카이브를 둘러봐요
      </>,
      onboarding_3,
    ],
  ];
  return (
    <>
      <Modal
        isVisible={modalLoader || logoutLoader}
        // isVisible={true}
        content={
          <div className="flex flex-col items-center justify-center w-full h-full max-w-[480px] bg-white -mt-4">
            <WrapMotion type="roll">
              <div className="w-16">
                <Image src={icon_smile} alt="" />
              </div>
            </WrapMotion>
            <div className="-mt-1 text-sm">LOADING</div>
          </div>
        }
      />
      {login.isLoggedIn === null ? (
        <></>
      ) : login.isLoggedIn ? (
        <>
          <div className="">{children}</div>
          {router.pathname === "/" && <ScrollTop />}
          <Nav />
        </>
      ) : (
        <>
          {logoutLoader ? (
            <></>
          ) : (
            <div className="flex flex-col w-full h-[100vh] p-4 justify-between overflow-hidden">
              <h1 className="hover:cursor-pointer title-logo">archive</h1>
              <div className="flex flex-col items-center mt-8 mb-16 text-3xl">
                {Children.toArray(
                  message.map((e, i) =>
                    i === page ? (
                      <WrapMotion type="float">
                        <Image
                          src={e[1]}
                          alt=""
                          className="w-full bg-white min-h-[20rem]"
                        />
                        <div className="mb-8 -mt-8 text-lg leading-5 text-center">
                          {e[0]}
                        </div>
                      </WrapMotion>
                    ) : (
                      <></>
                    )
                  )
                )}
                <div className="flex justify-between m-auto mt-2 mb-20 w-14">
                  {Children.toArray(
                    message.map((e, i) =>
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
                    onClick={handleSocialLogin}
                  >
                    <RiGoogleFill size={SIZE.iconSm} />
                    <div className="w-full text-sm -translate-x-2">
                      구글로 로그인
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <style jsx global>
        {`
          #__next {
            width: 100%;
          }
          #layout_naver {
            color: ${COLOR["black"]};
            transform: scale(1.2);
          }
          :root {
            display: flex;
            justify-content: center;
            width: 100%;
            background-color: ${COLOR["gray-4f"]};
          }
          body {
            overflow: ${router.pathname === "/search/[keyword]" ||
            router.pathname === "/profile/[uid]"
              ? "hidden"
              : "scroll"};
            margin: 0;
            width: 100vw;
            max-width: 480px;
            min-height: ${!login.isLoggedIn
              ? "100vh"
              : router.pathname === "/setting" ||
                router.pathname === "/add" ||
                router.pathname === "/post/[id]"
              ? "100vh"
              : "calc(100vh - 72px)"};
            max-height: ${router.pathname === "/setting" ? "100vh" : ""};
            background-color: ${COLOR["white"]};
            box-sizing: border-box;
            display: ${login.isLoggedIn ? "" : "flex"};
            justify-content: center;
            align-items: center;
          }
          body::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
}
