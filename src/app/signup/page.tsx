"use client";
import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";
import { auth, db } from "../firebase.ts";
import { getDocs } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import { erros } from "../errorMessages.ts";
import { Link } from "@/components/Link.tsx";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignUp() {
  const [erro, setErro] = useState("");
  const [visible, setVisible] = useState(false);
  const [username, setName] = useState("");
  let name: any[] | SetStateAction<string>,
    email: string,
    senha: string,
    confirmarSenha,
    botão: HTMLButtonElement;

  //Desabilitar reload do form
  useEffect(() => {
    document
      .querySelector("form")
      ?.addEventListener("submit", function (event) {
        event.preventDefault();
      });
  }, []);

  /**
   * Realiza verificações para determinar se o nome de usuário é válido.
   * @param username
   * @returns Validade do nome
   */
  async function checkNameValidity(username: string) {
    // Verifica se o nome de usuário contém apenas caracteres alfanuméricos e underscores
    const validCharacters = /^[a-zA-Z0-9_]+$/;
    if (!validCharacters.test(username)) {
      setErro(erros["caracteresnome"]);
      return false;
    }

    // Verifica se o tamanho do nome de usuário está dentro dos limites (entre 4 e 20 caracteres)
    if (username.length < 4 || username.length > 20) {
      setErro(erros["tamanhonome"]);
      return false;
    }

    // Se passar por todas as verificações, o nome de usuário é considerado válido
    return true;
  }

  /**
   * Checa a validade das inputs colocadas no formulário: email, senha e confirmarSenha.
   * @see checkUsernameAndEmailAvailable(name,email) Verifica se o username ou email já existe na base de dados.
   * Também checa algumas regras básicas de segurança, como a quantidade de caracteres da senha.
   * @returns Validade das inputs
   */
  async function checkInputValidity() {
    let nameEl = document.getElementById("name") as HTMLInputElement;
    name = nameEl ? nameEl.value : "";
    setName(name);
    let emailEl = document.getElementById("email") as HTMLInputElement;
    let senhaEl = document.getElementById("senha") as HTMLInputElement;
    let confirmarSenhaEl = document.getElementById(
      "confirmarSenha"
    ) as HTMLInputElement;
    email = emailEl.value;
    senha = senhaEl.value;
    confirmarSenha = confirmarSenhaEl.value;
    botão = document.getElementById("botão") as HTMLButtonElement;

    //Checa se o usuário preencheu todos os campos
    if (
      email.length == 0 ||
      senha.length == 0 ||
      confirmarSenha.length == 0 ||
      name.length == 0
    ) {
      setErro(erros["vazio"]);
      return false;
    }

    //Checa se o nome de usuário é válido.
    let validName = await checkNameValidity(name);

    //Checa se o nome de usuário e email estão disponíveis.
    let usernameOrEmailAvailable;
    if (validName) {
      usernameOrEmailAvailable = await checkUsernameAndEmailAvailable(
        name,
        email
      );
    }

    if (!usernameOrEmailAvailable || !validName) {
      return false;
    }

    if (confirmarSenha == senha) {
      return true;
    } else {
      setErro(erros["senhasdiferentes"]);
      return false;
    }
  }

  /**
   * Checa a disponibilidade do nome de usuário e email.
   * @param username Nome do usuário.
   * @param email Email do usuário.
   */
  async function checkUsernameAndEmailAvailable(
    username: string,
    email: string
  ) {
    //Carregar informações dos usuários
    const usersCol = db.collection("/Users");
    let res = await getDocs(usersCol);
    let passed = true;
    res.forEach((doc) => {
      let data = doc.data();
      if (data.name == username) {
        setErro(erros["usuarioexiste"]);
        passed = false;
      } else if (data.email == email) {
        setErro(erros["auth/email-already-in-use"]);
        passed = false;
      }
    });
    return passed;
  }

  /**
   * Atualiza os dados do registro na BD.
   * @param name Nome de usuário.
   * @param dados Dados do novo usuário.
   */
  const finishSignUp = async (name: string, dados: any) => {
    //Atualizar dados na bd
    const user = dados.user;
    const usersCol = db.collection("/Users");
    usersCol.add({
      uid: user.uid,
      email: user.email,
      name: name,
    });

    setErro("");
    botão.style.cursor = "pointer";
    alert("Registro feito com sucesso!");
  };

  /**
   * Pega as informações do formulário e cria o usuário no Firebase.
   * @event Button#click
   */

  const signUp = async () => {
    //Verificação das inputs
    if (await checkInputValidity()) {
      botão.style.cursor = "wait";

      //Criar usuário no Firebase
      auth
        .createUserWithEmailAndPassword(email, senha)
        .then(async (dados) => {
          finishSignUp(username, dados);
          return null;
        })
        .catch((err) => {
          let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
          console.log(err);
          setErro(mensagem);
          botão.style.cursor = "pointer";
        });
    }
  };

  //Renderizar página
  return (
    <main className="w-full h-screen flex">
      <img src="backdrop.jpg" className="h-screen w-screen absolute" alt="" />
      <div className="self-center max-w-[25rem] p-8 grid mx-auto my-auto w-11/12 sm:w-auto h-auto bg-white/10 backdrop-blur-md shadow-lg rounded-xl shadow-black/10">
        <FontAwesomeIcon
          className="w-16 block mx-auto text-white"
          size="4x"
          icon={faLeaf}
        />
        <h1 className="text-white mx-auto font-bold text-2xl text-center">
          Seja bem-vindo! Insira suas informações.
        </h1>
        <form className="space-y-3">
          <Input id="name" título="Nome de usuário" tipo="text" />
          <Input id="email" título="Email" tipo="text" />
          <Input
            id="senha"
            título="Senha"
            tipo={visible ? "text" : "password"}
          />
          <Input
            id="confirmarSenha"
            título="Confirme sua senha"
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
              id="botão"
              action={async () => {
                await signUp();
              }}
              text="Cadastrar"
            />
          </div>
        </form>
        <div className="text-gray-50 text-center font-semibold mt-1">
          Já tem uma conta?
          <Link className="ml-1" text="Faça login!" destination="/login" />
        </div>
        <p className="text-red-500 w-full text-center font-semibold mt-1">
          {erro}
        </p>
      </div>
    </main>
  );
}
