// ===============================
// ELEMENTOS DO DOM
// ===============================

const perfilForm = document.getElementById('perfil')
const iaForm = document.getElementById('form')
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const iaResponse = document.getElementById('iaResponse')

const cabecalho = document.getElementById('cabecalho')
const saudacao = document.getElementById('saudacao')
const profileEditor = document.getElementById('profile-editor')

let historico = []


// ===============================
// UTIL
// ===============================

const markdownToHTML = text => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}


// ===============================
// PERFIL
// ===============================

function salvarPerfil(event) {
  event.preventDefault()

  const nome = perfilForm.nome.value
  const peso = Number(perfilForm.peso.value)
  const alturaCm = Number(perfilForm.altura.value)

  const dores = []
  document
    .querySelectorAll('input[name="dores"]:checked')
    .forEach(checkbox => dores.push(checkbox.value))

  const dadosPerfil = {
    nome,
    peso,
    altura: alturaCm, // mantém em cm
    dores
  }

  localStorage.setItem('perfilCorredor', JSON.stringify(dadosPerfil))

  perfilForm.classList.add('hidden')
  iaForm.classList.remove('hidden')
  cabecalho.classList.add('hidden')
  saudacao.classList.remove('hidden')

  atualizarSaudacao()
}


function carregarPerfil() {
  const perfilSalvo = localStorage.getItem('perfilCorredor')
  if (!perfilSalvo) return

  const perfil = JSON.parse(perfilSalvo)

  perfilForm.nome.value = perfil.nome
  perfilForm.peso.value = perfil.peso
  perfilForm.altura.value = perfil.altura

  document.querySelectorAll('input[name="dores"]').forEach(checkbox => {
    checkbox.checked = perfil.dores.includes(checkbox.value)
  })

  perfilForm.classList.add('hidden')
  iaForm.classList.remove('hidden')
  cabecalho.classList.add('hidden')
  saudacao.classList.remove('hidden')

  atualizarSaudacao()
}


function atualizarSaudacao() {
  const perfilSalvo = JSON.parse(localStorage.getItem('perfilCorredor'))
  if (!perfilSalvo) return

  const titulo = document.querySelector('#saudacao h2')
  titulo.textContent = `Olá, ${perfilSalvo.nome} 👋`
}


function mostrar() {
  iaForm.classList.add('hidden')
  perfilForm.classList.remove('hidden')
}


// ===============================
// IA
// ===============================

function gerarEspecialidade(assunto) {
  const temas = {
    tenis: 'escolha de tênis para corrida',
    treinos: 'treinamento para corredores',
    dieta: 'nutrição para corredores',
    tecnica: 'técnica de corrida'
  }

  return temas[assunto] || 'corrida'
}


async function perguntarIA(question, assunto, apiKey) {
  const perfilSalvo = localStorage.getItem('perfilCorredor')

  let perfilTexto = ''

  if (perfilSalvo) {
    const perfil = JSON.parse(perfilSalvo)

    // converte cm para metros
    const alturaMetros = (perfil.altura / 100).toFixed(2)

    perfilTexto = `
Perfil do corredor:
Nome: ${perfil.nome}
Peso: ${perfil.peso} kg
Altura: ${alturaMetros} m
Dores/lesões: ${perfil.dores.join(', ') || 'Nenhuma'}
`
  }

  const especialidade = gerarEspecialidade(assunto)

  const contexto = historico
    .map(item => `Usuário: ${item.pergunta}\nIA: ${item.resposta}`)
    .join('\n\n')

  const model = 'gemini-2.5-flash'
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const prompt = `
## Especialidade
Você é um especialista em ${especialidade}.
${perfilTexto}

## Regras
-Se não souber, responda "não sei".
-Se não estiver relacionado ao tema, responda "Essa pergunta não está relacionada ao tema".
-Nunca invente informações.

## Estilo
- Tom humano, motivador e profissional.
- Frases curtas e claras.
- Use markdown.
- Máximo 1500 caracteres.

Histórico:
${contexto}

Pergunta:
${question}
`

  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    })
  })

  const data = await response.json()

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.'
}


async function enviarPergunta(event) {
  event.preventDefault()

  const apiKey = apiKeyInput.value.trim()
  const assunto = gameSelect.value
  const question = questionInput.value.trim()

  if (!apiKey || !assunto || !question) {
    alert('Preencha todos os campos!')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    const text = await perguntarIA(question, assunto, apiKey)

    historico.push({ pergunta: question, resposta: text })
    if (historico.length > 5) historico.shift()

    iaResponse.querySelector('.responseContent').innerHTML =
      markdownToHTML(text)

    iaResponse.classList.remove('hidden')

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}


// ===============================
// EVENTOS
// ===============================

perfilForm.addEventListener('submit', salvarPerfil)
iaForm.addEventListener('submit', enviarPergunta)

window.addEventListener('DOMContentLoaded', carregarPerfil)