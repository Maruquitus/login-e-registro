"use client";
import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";
import { auth } from "../firebase.ts";
import { useEffect, useState } from "react";
import { erros } from "../errorMessages.ts";
import { Link } from "@/components/Link.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [user, userLoading] = useAuthState(auth as any);
  const [visible, setVisible] = useState(false);

  //Redirecionar usuários para a tela de home dependendo da autenticação
  if (!userLoading && user) {
    document.location.href = "/home";
  }

  //Desabilitar reload do form
  useEffect(() => {
    document
      .querySelector("form")
      ?.addEventListener("submit", function (event) {
        event.preventDefault();
      });
  }, []);

  /**
   * Lê os valores do formulário (email, senha) e realiza o login do usuário com o Firebase.
   */
  const realizarLogin = async () => {
    setErro("");
    //Verificação das inputs
    if (email.length != 0 && senha.length != 0) {
      setLoading(true);

      //Realizar login do usuário no Firebase
      auth
        .signInWithEmailAndPassword(email, senha)
        .then(async () => {
          setErro("");
          setLoading(false);
          document.location.href = "/home";
        })
        .catch((err: { code: string }) => {
          let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
          setErro(mensagem);
          setLoading(false);
        });
    } else {
      setErro(erros["vazio"]);
    }
  };

  //Renderizar página
  return (
    <main className="w-full h-screen flex">
      <title>Login | Teste técnico</title>
      <div className="self-center max-w-[25rem] p-8 grid mx-auto my-auto w-11/12 sm:w-auto h-auto bg-white/10 backdrop-blur-md shadow-lg rounded-xl shadow-black/10">
        <FontAwesomeIcon
          className="w-16 block mx-auto text-white"
          size="4x"
          icon={faLeaf}
        />
        <h1 className="text-white font-bold text-2xl text-center">
          Olá! Entre na sua conta.
        </h1>
        <form className="space-y-3">
          <Input setState={setEmail} id="email" título="Email" tipo="text" />
          <Input
            setState={setSenha}
            id="senha"
            título="Senha"
            tipo={visible ? "text" : "password"}
          />
          <div className="flex-row">
            <input
              className="accent-green-400"
              type="checkbox"
              onChange={(e) => setVisible(e.target.checked)}
            ></input>
            <label className="text-gray-50 font-semibold ml-1">
              Mostrar senha
            </label>
          </div>
          <div className="flex justify-center">
            <Button
              style={{ cursor: loading ? "wait" : "pointer" }}
              action={() => realizarLogin()}
              text="Entrar"
            />
          </div>
        </form>
        <span className="text-gray-50 text-center font-semibold mt-1">
          Ainda não tem uma conta?
          <Link className="ml-1" text="Registre-se!" destination="/signup" />
        </span>
        <span className="text-red-500 text-center font-semibold">{erro}</span>
      </div>
    </main>
  );
}
