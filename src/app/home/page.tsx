"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSignOut, useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.ts";

export default function Home() {
  const [signOut, _, __] = useSignOut(auth as any);
  const [user, userLoading] = useAuthState(auth as any);

  //Redirecionar usuários para a tela de login dependendo da autenticação
  if (!userLoading && !user) {
    document.location.href = "/login";
  }

  return (
    <main className="w-full h-screen flex ">
      <img
        src="backdrop.jpg"
        className="h-screen w-screen absolute pointer-events-none"
        alt=""
      />
      <div
        onClick={async () => {
          signOut();
          window.location.href = "/login";
        }}
        className="absolute top-2 left-2 flex hover:scale-105 duration-200 cursor-pointer"
      >
        <FontAwesomeIcon
          className="text-white z-10 w-6 h-6 my-auto"
          icon={faArrowLeft}
        />
        <h2 className="font-semibold select-none text-lg my-auto text-white ml-1">
          Sair
        </h2>
      </div>

      <div className="self-center transition-[height] duration-1000 max-w-[25rem] p-8 grid mx-auto my-auto w-11/12 sm:w-auto h-auto bg-white/10 backdrop-blur-md shadow-lg rounded-xl shadow-black/10">
        <h1 className="text-4xl text-white font-bold text-center">
          Bem-vindo à página inicial!
        </h1>
      </div>
    </main>
  );
}
