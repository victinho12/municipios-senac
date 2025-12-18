const API = "http://127.0.0.1:3000/municipios";
let limit = 3;
let offset = 0;
let lastScrollTop = 0;

const API_CLIENT_KEY = "SUA_CHAVE_SECRETA_MUITO_FORTE_123456";

const listagem = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnAlterar = document.getElementById("btn-alterar");
const alterar = document.getElementById("lista-alterar");
const fechar = document.getElementById("fechar-janela");
const btnMaisMunicipios = document.getElementById("maisMunicipios");
const btnMenosMunicipios = document.getElementById("menosMunicipios");
alterar.style.display = "none";
// Eventos
btnCarregar.addEventListener("click", carregarMunicipios);
btnSalvar.addEventListener("click", inserirMunicipio);
btnAlterar.addEventListener("click", salvarMudanca);

btnMaisMunicipios.addEventListener("click", async () => {
  offset = offset + 3;
  carregarMunicipiosMenosMais(offset);
});
btnMenosMunicipios.addEventListener("click", async () => {
  offset -= 3;
  carregarMunicipiosMenosMais(offset);
});
fechar.addEventListener("click", () => {
  alterar.style.display = "none";
  listagem.style.pointerEvents = "auto";
});

async function carregarMunicipiosMenosMais(offset) {
  try {
    const resposta = await fetch(`${API}/?limit=${limit}&offset=${offset}`, {
      headers: {
        "minha-chave": API_CLIENT_KEY,
      },
    });
    const dados = await resposta.json();

    listagem.innerHTML = ""; // limpa

    dados.forEach((m) => criarCard(m));
  } catch (erro) {
    console.error("Erro ao carregar:", erro.message);
  }
}

//--------------------------------------------------
// LISTAR MUNICÍPIOS
//--------------------------------------------------
async function carregarMunicipios() {
  try {
    const resposta = await fetch(`${API}/?limit=${limit}`, {
      headers: {
        "minha-chave": API_CLIENT_KEY,
      },
    });
    const dados = await resposta.json();

    listagem.innerHTML = ""; // limpa

    dados.forEach((m) => criarCard(m));
  } catch (erro) {
    console.error("Erro ao carregar:", erro.message);
  }
}

//--------------------------------------------------
// CRIAR CARD NO FRONT
//--------------------------------------------------
function criarCard(m) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
        <h3>${m.nome} (${m.estado}), ${m.id}</h3>
        <p>${m.caracteristica}</p>
        <button class="btn-alterar" onclick="alterarJanela(${m.id})">alterar</button>
        <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
        
    `;

  listagem.appendChild(card);
}

//--------------------------------------------------
// INSERIR MUNICÍPIO (POST)
//--------------------------------------------------
async function inserirMunicipio() {
  const nome = document.getElementById("campoMunicipio").value;
  const estado = document.getElementById("campoUF").value;
  const caracteristica = document.getElementById("campoCaracteristica").value;

  const novoMunicipio = { nome, estado, caracteristica };

  try {
    const resposta = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "minha-chave": API_CLIENT_KEY,
      },
      body: JSON.stringify(novoMunicipio),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao inserir!");
    }

    carregarMunicipios();
  } catch (erro) {
    console.error("Erro ao inserir:", erro.message);
  }
}

async function deletar(id) {
  try {
    const resposta = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
      "minha-chave": API_CLIENT_KEY,
      }
    });
    carregarMunicipios();
  } catch (err) {
    console.log("municipio não deletado", err.message);
  }
}

async function alterarJanela(id) {
  alterar.style.display = "block";
  listagem.style.pointerEvents = "none";
  idEditar = id;
  const resposta = await fetch(`${API}/${id}`,{
    headers: {"minha-chave": API_CLIENT_KEY}
  });
  const municipio = await resposta.json();
  document.getElementById("nomeUf").value = municipio.nome;
  document.getElementById("estadoUf").value = municipio.estado;
  document.getElementById("caracUf").value = municipio.caracteristica;
}

async function salvarMudanca() {
  listagem.style.pointerEvents = "auto";
  const nome = document.getElementById("nomeUf").value;
  const estado = document.getElementById("estadoUf").value;
  const caracteristica = document.getElementById("caracUf").value;

  const novoMunicipio = { nome, estado, caracteristica };
  try {
    await fetch(`${API}/${idEditar}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "minha-chave": API_CLIENT_KEY },
      body: JSON.stringify(novoMunicipio),
    });
    alterar.style.display = "none";
  } catch (err) {
    console.log(err.message);
  }
  carregarMunicipios();
}
