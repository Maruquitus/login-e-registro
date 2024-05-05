"use client";
import { Button } from "@/components/Button";

export default function Erro() {
  return (
    <main className="w-full h-screen flex">
      <title>Ops! | Teste técnico</title>
      <div className="self-center max-w-[28rem] p-8 grid mx-auto my-auto w-11/12 sm:w-auto h-auto bg-white/10 backdrop-blur-md shadow-lg rounded-xl shadow-black/10">
        <h1 className="text-white font-bold text-center text-xl sm:text-3xl">
          Ops! Não foi possível encontrar essa página.
        </h1>
        <h2 className="text-white font-medium text-center text-lg sm:text-xl mb-2">
          Tente voltar à tela de login.
        </h2>
        <Button
          text="Fazer login"
          action={() => (window.location.href = "/login")}
        />
      </div>
    </main>
  );
}
