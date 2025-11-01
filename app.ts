// Implementação da classe App (Etapa 6)

import prompt from "prompt-sync";
import { Banco, Conta, Cliente } from "./banco";

class App {
    private b: Banco = new Banco();
    private input = prompt();

    constructor() {
        this.b.carregarDados();
    }

    /**
     * Exibe o menu principal e processa a entrada do usuário.
     */
    public menu(): void {
        let opcao: String = '';
        
        do {
            console.log('\n===== Bem vindo ao Banco =====');
            console.log('Digite uma opção:');
            
            // Menu de opções
            console.log(`
Contas:
    01 - Inserir     02 - Consultar   03 - Sacar
    04 - Depositar   05 - Excluir     06 - Transferir
    07 - Totalizações (Total, Média)
    08 - Ordem Bancária (Transferir p/ Vários)
    09 - Listar Contas Sem Titular

Clientes:
    20 - Inserir     21 - Consultar   22 - Excluir
    23 - Associar Conta a Cliente (Mudar Titular)

Outras Opções:
    0 - Sair
    `);
            
            opcao = this.input("Opção: ");

            try {
                switch (opcao) {
                    // Contas
                    case "01": this.inserirConta(); break;
                    case "02": this.consultarConta(); break;
                    case "03": this.sacar(); break;
                    case "04": this.depositar(); break;
                    case "05": this.excluirConta(); break;
                    case "06": this.transferir(); break;
                    case "07": this.totalizacoes(); break;
                    case "08": this.ordemBancaria(); break;
                    case "09": this.listarContasSemTitular(); break;
                    
                    // Clientes
                    case "20": this.inserirCliente(); break;
                    case "21": this.consultarCliente(); break;
                    case "22": this.excluirCliente(); break;
                    case "23": this.associarClienteConta(); break;
                    
                    case "0":
                        console.log("Aplicação encerrada.");
                        break;
                    default:
                        console.log("Opção inválida. Tente novamente.");
                        break;
                }
            } catch (e: any) {
                // Captura erros (ex: CPF duplicado)
                console.error(`\n!!! ERRO: ${e.message}`);
            }

            if (opcao !== "0") {
                this.input("\nOperação finalizada. Digite <enter> para continuar.");
            }

        } while (opcao !== "0");
    }

    // --- Métodos de Interface (Conta) ---

    private inserirConta(): void {
        console.log("\n--- Cadastrar Conta ---");
        let numero: string = this.input('Digite o número da conta: ');
        let saldoStr: string = this.input('Digite o saldo inicial: ');
        let saldo: number = parseFloat(saldoStr);

        if (isNaN(saldo) || saldo < 0) {
             throw new Error("Saldo inválido.");
        }
        
        let conta: Conta = new Conta(numero, saldo);
        this.b.inserir(conta);
        console.log("Conta cadastrada com sucesso.");
    }

    private consultarConta(): void {
        console.log("\n--- Consultar Conta ---");
        let numero: string = this.input('Digite o número da conta: ');
        let conta = this.b.consultar(numero);
        
        if (conta) {
            console.log(`\n--- Dados da Conta ---`);
            console.log(`Número: ${conta.numero}`);
            console.log(`Saldo: R$ ${conta.saldo.toFixed(2)}`);
            if (conta.cliente) {
                console.log(`Titular: ${conta.cliente.nome} (CPF: ${conta.cliente.cpf})`);
            } else {
                console.log(`Titular: (Sem titular associado)`);
            }
        } else {
            console.log("Conta não encontrada.");
        }
    }

    private sacar(): void {
        console.log("\n--- Realizar Saque ---");
        let numero: string = this.input('Digite o número da conta: ');
        let valorStr: string = this.input('Digite o valor do saque: ');
        let valor: number = parseFloat(valorStr);

        if (isNaN(valor) || valor <= 0) {
             throw new Error("Valor de saque inválido.");
        }

        const sucesso = this.b.sacar(numero, valor);
        console.log(sucesso ? "Saque realizado." : "Falha no saque (saldo/conta).");
    }
    
    private depositar(): void {
        console.log("\n--- Realizar Depósito ---");
        let numero: string = this.input('Digite o número da conta: ');
        let valorStr: string = this.input('Digite o valor do depósito: ');
        let valor: number = parseFloat(valorStr);

        if (isNaN(valor) || valor <= 0) {
             throw new Error("Valor de depósito inválido.");
        }

        this.b.depositar(numero, valor); // Assume que a conta existe (ou lança erro)
        console.log("Depósito realizado com sucesso.");
    }
    
    private excluirConta(): void {
        console.log("\n--- Excluir Conta ---");
        let numero: string = this.input('Digite o número da conta a excluir: ');
        
        let conf: string = this.input(`Excluir conta ${numero}? (s/n): `);
        if (conf.toLowerCase() !== 's') {
            console.log("Operação cancelada.");
            return;
        }

        const sucesso = this.b.excluirConta(numero);
        console.log(sucesso ? "Conta excluída." : "Conta não encontrada.");
    }

    private transferir(): void {
        console.log("\n--- Realizar Transferência ---");
        let numOrigem: string = this.input('Conta de ORIGEM: ');
        let numDestino: string = this.input('Conta de DESTINO: ');
        let valorStr: string = this.input('Valor: ');
        let valor: number = parseFloat(valorStr);
        
        if (isNaN(valor) || valor <= 0) {
             throw new Error("Valor inválido.");
        }

        const sucesso = this.b.transferir(numOrigem, numDestino, valor);
        console.log(sucesso ? "Transferência realizada." : "Falha (contas/saldo).");
    }
    
    private totalizacoes(): void {
        console.log("\n--- Totalizações do Banco ---");
        console.log(`Quantidade de Contas: ${this.b.totalContas}`);
        console.log(`Total Depositado: R$ ${this.b.totalDinheiro.toFixed(2)}`);
        console.log(`Média de Saldo: R$ ${this.b.mediaSaldo.toFixed(2)}`);
    }
    
    private ordemBancaria(): void {
        console.log("\n--- Ordem Bancária (Múltiplas Transferências) ---");
        let numOrigem: string = this.input('Conta de ORIGEM: ');
        let valorStr: string = this.input('Valor (para CADA destino): ');
        let valor: number = parseFloat(valorStr);
        
        if (isNaN(valor) || valor <= 0) {
             throw new Error("Valor inválido.");
        }

        let numerosDestino: string[] = [];
        let numDest: string;
        console.log("Digite as contas de destino (vazio para parar):");
        do {
            numDest = this.input(`Destino ${numerosDestino.length + 1}: `);
            if (numDest) {
                numerosDestino.push(numDest);
            }
        } while (numDest !== "");

        if (numerosDestino.length > 0) {
            this.b.ordemBancaria(numOrigem, numerosDestino, valor);
            console.log("Ordens bancárias processadas.");
        } else {
            console.log("Operação cancelada.");
        }
    }

    private listarContasSemTitular(): void {
        console.log("\n--- Contas Sem Titular ---");
        const contas = this.b.listarContasSemTitular();
        if (contas.length === 0) {
            console.log("Todas as contas possuem titular.");
            return;
        }

        contas.forEach(c => {
            console.log(`- Conta: ${c.numero}, Saldo: R$ ${c.saldo.toFixed(2)}`);
        });
    }
    
    // --- Métodos de Interface (Cliente) ---

    private inserirCliente(): void {
        console.log("\n--- Cadastrar Cliente ---");
        let cpf: string = this.input('Digite o CPF: ');
        let nome: string = this.input('Digite o NOME: ');
        
        let cliente: Cliente = new Cliente(cpf, nome);
        this.b.inserirCliente(cliente);
        console.log("Cliente cadastrado.");
    }
    
    private consultarCliente(): void {
        console.log("\n--- Consultar Cliente ---");
        let cpf: string = this.input('Digite o CPF: ');
        let cliente = this.b.consultarCliente(cpf);
        if (cliente) {
            console.log(`\nNome: ${cliente.nome}, CPF: ${cliente.cpf}`);
        } else {
            console.log("Cliente não encontrado.");
        }
    }

    private excluirCliente(): void {
         console.log("\n--- Excluir Cliente ---");
         let cpf: string = this.input('Digite o CPF do cliente: ');
         
         let conf: string = this.input(`Excluir cliente ${cpf}? (s/n): `);
         if (conf.toLowerCase() !== 's') {
             console.log("Operação cancelada.");
             return;
         }
         
         console.log("AVISO: Contas associadas ficarão sem titular.");
         const sucesso = this.b.excluirCliente(cpf);
         console.log(sucesso ? "Cliente excluído." : "Cliente não encontrado.");
    }

    private associarClienteConta(): void {
        console.log("\n--- Associar Titular à Conta ---");
        let numeroConta: string = this.input('Número da CONTA: ');
        let cpfCliente: string = this.input('CPF do NOVO TITULAR: ');

        const sucesso = this.b.atribuirTitular(numeroConta, cpfCliente);
        console.log(sucesso ? "Titularidade atribuída." : "Falha (conta/cliente).");
    }
}

// --- Execução Principal ---
const app = new App();
app.menu();