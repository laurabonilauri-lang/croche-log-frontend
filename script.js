/* --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/projetos';
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then((data) => {
            const container = document.getElementById('cards-container');
            container.innerHTML = ""; // Limpa antes de renderizar
            data.projetos.forEach(item => renderCard(item));
            updateStats(); // Atualiza o dashboard
        })
        .catch((error) => console.error('Error:', error));
}

/* --------------------------------------------------------------------------------------
  Função para renderizar os cards na tela
  --------------------------------------------------------------------------------------
*/
const renderCard = (projeto) => {
    const container = document.getElementById('cards-container');
    
    const id = projeto.id || projeto[0];
    const nome = projeto.nome || projeto[1];
    const linha = projeto.linha || projeto[2];
    const agulha = projeto.agulha || projeto[3];
    const status = projeto.status || projeto[4];

    const card = `
        <div class="card">
            <h3>${nome}</h3>
            <p><strong>Linha:</strong> ${linha}</p>
            <p><strong>Agulha:</strong> ${agulha}</p>
            <p><strong>Status:</strong> <span class="badge">${status}</span></p>
            
            <div class="acoes">
                <button class="btn-ver" onclick="buscarProjeto(${id})" title="Ver detalhes">👁️</button>
                <button class="btn-concluir" onclick="concluirProjeto(${id})" title="Marcar como concluído">✔️</button>
                <button class="btn-remover" onclick="deletarProjeto(${id})" title="Remover projeto">🗑️</button>
            </div>
        </div>
    `;
    container.innerHTML += card;
}

/* --------------------------------------------------------------------------------------
  Função para cadastrar um novo projeto (POST)
  --------------------------------------------------------------------------------------
*/
const salvarProjeto = () => {
    let inputNome = document.getElementById("nome").value;
    let inputLinha = document.getElementById("linha").value;
    let inputAgulha = document.getElementById("agulha").value;

    if (inputNome === "") {
        alert("Escreva o nome da peça!");
        return;
    }

    const body = { nome: inputNome, linha: inputLinha, agulha: inputAgulha, status: "Iniciado" };

    fetch('http://127.0.0.1:5000/projeto', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then((res) => {
        if (res.ok) { getList(); limparCampos(); }
    })
    .catch((err) => console.error('Erro:', err));
}

/* --------------------------------------------------------------------------------------
  Função para buscar um projeto específico (GET por ID)
  --------------------------------------------------------------------------------------
*/
const buscarProjeto = (id) => {
    fetch(`http://127.0.0.1:5000/projeto?id=${id}`, { method: 'get' })
        .then((res) => res.json())
        .then((data) => {
            const p = data.projeto;
            const n = p.nome || p[1];
            const s = p.status || p[4];
            alert(`🧵 Detalhes:\nNome: ${n}\nStatus: ${s}`);
        });
}

/* --------------------------------------------------------------------------------------
  Função para atualizar status para Concluído (PUT)
  --------------------------------------------------------------------------------------
*/
const concluirProjeto = (id) => {
    const body = { id: id, novo_status: "Concluído" };
    fetch('http://127.0.0.1:5000/projeto_status', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then((res) => { if (res.ok) getList(); });
}

/* --------------------------------------------------------------------------------------
  Função para remover um projeto (DELETE)
  --------------------------------------------------------------------------------------
*/
const deletarProjeto = (id) => {
    if (confirm("Deseja remover?")) {
        fetch(`http://127.0.0.1:5000/projeto?id=${id}`, { method: 'delete' })
            .then((res) => { if (res.ok) getList(); });
    }
}

/* --------------------------------------------------------------------------------------
  Função para atualizar as estatísticas (Dashboard)
  --------------------------------------------------------------------------------------
*/
const updateStats = () => {
    fetch('http://127.0.0.1:5000/estatisticas', { method: 'get' })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('total-count').innerText = data.total_projetos;
            document.getElementById('done-count').innerText = data.concluidos;
        });
}

const limparCampos = () => {
    document.getElementById("nome").value = "";
    document.getElementById("linha").value = "";
    document.getElementById("agulha").value = "";
}

// Inicialização
getList();