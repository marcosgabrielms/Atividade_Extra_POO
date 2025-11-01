/**
 * Representa um Cliente (Titular da conta).
 */
export class Cliente {
    constructor(public cpf: string, public nome: string) {}
}

/**
 * Representa uma Conta bancária.
 */
export class Conta {
    private _numero: string;
    private _saldo: number;
    private _cliente: Cliente | null = null; // Cliente associado

    constructor(numero: string, saldoInicial: number) {
        this._numero = numero;
        this._saldo = saldoInicial;
    }

    // Getters
    get numero(): string { return this._numero; }
    get saldo(): number { return this._saldo; }
    get cliente(): Cliente | null { return this._cliente; }
    
    // Setter
    set cliente(cliente: Cliente | null) {
        this._cliente = cliente;
    }

    /**
     * Tenta sacar um valor.
     * Retorna true (sucesso) ou false (falha).
     */
    sacar(valor: number): boolean {
        if (this._saldo >= valor && valor > 0) {
            this._saldo -= valor;
            return true;
        }
        return false;
    }

    /**
     * Deposita um valor positivo.
     */
    depositar(valor: number): void {
        if (valor > 0) {
            this._saldo += valor;
        }
    }

    /**
     * Transfere valor para outra conta.
     * Retorna true (sucesso) ou false (falha).
     */
    transferir(destino: Conta, valor: number): boolean {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            return true;
        }
        return false;
    }
}

/**
 * Gerencia todas as contas e clientes.
 */
export class Banco {
    private contas: Conta[] = [];
    private clientes: Cliente[] = [];

    // --- Métodos de Cliente ---

    inserirCliente(cliente: Cliente): void {
        if (!this.consultarCliente(cliente.cpf)) {
            this.clientes.push(cliente);
        } else {
            throw new Error("CPF já cadastrado.");
        }
    }

    consultarCliente(cpf: string): Cliente | null {
        return this.clientes.find(c => c.cpf === cpf) || null;
    }

    /**
     * Exclui um cliente e desassocia suas contas.
     */
    excluirCliente(cpf: string): boolean {
        const clienteIndex = this.clientes.findIndex(c => c.cpf === cpf);
        if (clienteIndex === -1) {
            return false; // Não encontrado
        }

        // Desassocia contas
        this.contas.forEach(conta => {
            if (conta.cliente?.cpf === cpf) {
                conta.cliente = null;
            }
        });

        this.clientes.splice(clienteIndex, 1);
        return true;
    }

    // --- Métodos de Conta (Etapa 1) ---

    inserir(conta: Conta): void {
        if (!this.consultar(conta.numero)) {
            this.contas.push(conta);
        } else {
            throw new Error("Número de conta já existente.");
        }
    }

    consultar(numero: string): Conta | null {
        return this.contas.find(c => c.numero === numero) || null;
    }

    sacar(numero: string, valor: number): boolean {
        const conta = this.consultar(numero);
        return conta ? conta.sacar(valor) : false;
    }

    depositar(numero: string, valor: number): void {
        const conta = this.consultar(numero);
        if (conta) {
            conta.depositar(valor);
        } else {
            throw new Error("Conta não encontrada para depósito.");
        }
    }

    transferir(numOrigem: string, numDestino: string, valor: number): boolean {
        const contaOrigem = this.consultar(numOrigem);
        const contaDestino = this.consultar(numDestino);

        if (contaOrigem && contaDestino) {
            return contaOrigem.transferir(contaDestino, valor);
        }
        return false;
    }

    /**
     * Exclui uma conta. O cliente não é afetado.
     */
    excluirConta(numero: string): boolean {
        const contaIndex = this.contas.findIndex(c => c.numero === numero);
        if (contaIndex === -1) {
            return false; // Não encontrada
        }
        this.contas.splice(contaIndex, 1);
        return true;
    }

    // --- Métodos Adicionais (Etapa 2) ---

    /**
     * Transfere de uma origem para vários destinos.
     */
    ordemBancaria(numOrigem: string, numerosDestino: string[], valor: number): void {
        const contaOrigem = this.consultar(numOrigem);
        if (!contaOrigem) {
            throw new Error("Conta de origem não encontrada.");
        }

        for (const numDest of numerosDestino) {
            const contaDestino = this.consultar(numDest);
            if (contaDestino) {
                contaOrigem.transferir(contaDestino, valor);
                // Em um app real, trataria falhas individuais
            }
        }
    }

    get totalContas(): number {
        return this.contas.length;
    }

    get totalDinheiro(): number {
        return this.contas.reduce((total, conta) => total + conta.saldo, 0);
    }

    get mediaSaldo(): number {
        if (this.totalContas === 0) return 0;
        return this.totalDinheiro / this.totalContas;
    }

    /**
     * Muda o titular de uma conta.
     */
    atribuirTitular(numeroConta: string, cpfCliente: string): boolean {
        const conta = this.consultar(numeroConta);
        const cliente = this.consultarCliente(cpfCliente);
        
        if (conta && cliente) {
            conta.cliente = cliente;
            return true;
        }
        return false;
    }

    /**
     * Retorna contas sem cliente associado.
     */
    listarContasSemTitular(): Conta[] {
        return this.contas.filter(conta => conta.cliente === null);
    }

    // --- Método de Setup (Etapa 4) ---

    /**
     * Cria dados iniciais para teste.
     */
    carregarDados(): void {
        // 5 Clientes
        const c1 = new Cliente("111", "Alice");
        const c2 = new Cliente("222", "Beto");
        const c3 = new Cliente("333", "Carla");
        const c4 = new Cliente("444", "Daniel");
        const c5 = new Cliente("555", "Elisa");
        
        this.inserirCliente(c1);
        this.inserirCliente(c2);
        this.inserirCliente(c3);
        this.inserirCliente(c4);
        this.inserirCliente(c5);

        // 5 Contas
        const k1 = new Conta("001", 1000);
        const k2 = new Conta("002", 500);
        const k3 = new Conta("003", 2000);
        const k4 = new Conta("004", 100); // Sem titular
        const k5 = new Conta("005", 1500);
        
        this.inserir(k1);
        this.inserir(k2);
        this.inserir(k3);
        this.inserir(k4);
        this.inserir(k5);

        // Associações
        this.atribuirTitular("001", "111"); // Alice
        this.atribuirTitular("002", "222"); // Beto
        this.atribuirTitular("003", "333"); // Carla
        this.atribuirTitular("005", "555"); // Elisa
        
        console.log("Dados iniciais carregados.");
    }
}