"use client";
import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";
import { auth, db } from "../firebase.ts";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { erros } from "../errorMessages.ts";
import { Link } from "@/components/Link.tsx";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmarSenha, setConfimarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [visible, setVisible] = useState(false);

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
   * @returns Validade do nome
   */
  async function checkNameValidity() {
    // Verifica se o nome de usuário contém apenas caracteres alfanuméricos e underscores
    const validCharacters = /^[a-zA-Z0-9_]+$/;
    if (!validCharacters.test(name)) {
      setErro(erros["caracteresnome"]);
      return false;
    }

    // Verifica se o tamanho do nome de usuário está dentro dos limites (entre 4 e 20 caracteres)
    if (name.length < 4 || name.length > 20) {
      setErro(erros["tamanhonome"]);
      return false;
    }

    // Se passar por todas as verificações, o nome de usuário é considerado válido
    return true;
  }

  /**
   * Checa a validade das inputs colocadas no formulário: email, senha e confirmarSenha.
   * @see checkUsernameAndEmailAvailable() Verifica se o username ou email já existe na base de dados.
   * Também checa algumas regras básicas de segurança, como a quantidade de caracteres da senha.
   * @returns Validade das inputs
   */
  async function checkInputValidity() {
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
    let validName = await checkNameValidity();

    //Checa se o nome de usuário e email estão disponíveis.
    let usernameOrEmailAvailable;
    if (validName) {
      usernameOrEmailAvailable = await checkUsernameAndEmailAvailable();
    }

    if (!usernameOrEmailAvailable || !validName) {
      return false;
    }

    //Valida os caracteres da senha
    if (!/^[A-Za-z\d@$!%*?&]+$/.test(senha)) {
      setErro(erros["caracteressenha"]);
      return false;
    }

    //Checa se a confirmação da senha é igual à senha
    if (confirmarSenha != senha) {
      setErro(erros["senhasdiferentes"]);
      return false;
    }

    //Verifica se a senha é forte
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        senha
      )
    ) {
      setErro(erros["senhafraca"]);
      return false;
    }
    return true;
  }

  /**
   * Checa a disponibilidade do nome de usuário e email.
   */
  async function checkUsernameAndEmailAvailable() {
    //Carregar informações dos usuários
    const usersCol = db.collection("/Users");
    let res = await getDocs(usersCol);
    let passed = true;
    res.forEach((doc) => {
      let data = doc.data();
      if (data.name == name) {
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
   * @param dados Dados do novo usuário.
   */
  const finishSignUp = async (dados: any) => {
    //Atualizar dados na bd
    const user = dados.user;
    const usersCol = db.collection("/Users");
    usersCol.add({
      uid: user.uid,
      email: user.email,
      name: name,
    });

    setErro("");
    setLoading(false);
    alert("Registro feito com sucesso!");
  };

  /**
   * Pega as informações do formulário e cria o usuário no Firebase.
   * @event Button#click
   */

  const signUp = async () => {
    //Verificação das inputs
    if (await checkInputValidity()) {
      setLoading(true);

      //Criar usuário no Firebase
      auth
        .createUserWithEmailAndPassword(email, senha)
        .then(async (dados) => {
          finishSignUp(dados);
          return null;
        })
        .catch((err) => {
          let mensagem = erros[err.code] ? erros[err.code] : "Algo deu errado.";
          console.log(err);
          setErro(mensagem);
          setLoading(false);
        });
    }
  };

  //Renderizar página
  return (
    <main className="w-full h-screen flex">
      <title>Cadastro | Teste técnico</title>
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
          <Input
            setState={setName}
            id="name"
            título="Nome de usuário"
            tipo="text"
          />
          <Input setState={setEmail} id="email" título="Email" tipo="text" />
          <Input
            setState={setSenha}
            id="senha"
            título="Senha"
            tipo={visible ? "text" : "password"}
          />
          <Input
            setState={setConfimarSenha}
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
              style={{ cursor: loading ? "wait" : "pointer" }}
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
