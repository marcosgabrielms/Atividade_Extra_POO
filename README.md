# Atividade Extra POO: Sistema Bancário em TypeScript

Este projeto é a resolução do **Exercício 05** da disciplina de Programação Orientada a Objetos (POO), do curso de Análise e Desenvolvimento de Sistemas do IFPI.

O objetivo é implementar um sistema bancário simples com lógica de POO, separando as responsabilidades em classes para `Cliente`, `Conta` e `Banco`.

## 👨‍💻 Autor

* **Marcos Gabriel**

## 🚀 Tecnologias Utilizadas

* **TypeScript**: Linguagem principal do projeto.
* **Node.js**: Ambiente de execução.
* **prompt-sync**: Biblioteca para capturar a entrada do usuário de forma síncrona no terminal.

## 📂 Estrutura do Projeto

O código foi organizado com uma clara separação de responsabilidades:

* `banco.ts`: Contém toda a lógica de negócio e as classes de modelo (`Cliente`, `Conta` e `Banco`).
* `app.ts`: Contém a classe `App`, responsável por gerenciar o menu de interface com o usuário (CLI) e interagir com a classe `Banco`.

## ▶️ Como Executar

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/marcosgabrielms/atividade_extra_poo.git](https://github.com/marcosgabrielms/atividade_extra_poo.git)
    cd atividade_extra_poo
    ```

2.  **Instale as dependências:**
    (Este comando irá baixar o `prompt-sync` e o `typescript`).
    ```bash
    npm install
    ```

3.  **Execute o projeto:**
    O projeto já vem com scripts configurados para facilitar a execução. O comando principal é:
    ```bash
    npm run dev
    ```

Isso irá compilar os arquivos TypeScript para JavaScript e, em seguida, executar o menu interativo no seu terminal.

---

## 📜 Scripts (Atalhos)

O arquivo `package.json` foi configurado com os seguintes atalhos (scripts) para facilitar o desenvolvimento:

* **`npm run dev`**:
    * **Comando:** `npm run build && npm run start`
    * **Função:** O comando principal. Ele primeiro compila o código TypeScript (`build`) e, se a compilação for bem-sucedida, executa o programa (`start`).

* **`npm run build`**:
    * **Comando:** `tsc`
    * **Função:** Apenas compila os arquivos `.ts` para `.js`, conforme as regras do `tsconfig.json`.

* **`npm start`**:
    * **Comando:** `node app.js`
    * **Função:** Apenas executa o arquivo `app.js` (assumindo que ele já foi compilado).
