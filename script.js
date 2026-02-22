let historico = []
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const form = document.getElementById('form')
const iaResponse = document.getElementById('iaResponse')

const markdownToHTML = text => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}
function carregarPerfil() {
  const perfilSalvo = localStorage.getItem('perfilCorredor')

  if (!perfilSalvo) return

  const perfil = JSON.parse(perfilSalvo)

  // Preenche o formulário
  forms.nome.value = perfil.nome
  forms.peso.value = perfil.peso
  forms.altura.value = perfil.altura

  document.querySelectorAll('input[name="dores"]').forEach(checkbox => {
    checkbox.checked = perfil.dores.includes(checkbox.value)
  })

  // Ajusta interface
  perfil.classList.add('hidden')
  form.classList.remove('hidden')
  cabecalho.classList.add('hidden')
  saudacao.classList.remove('hidden')

  atualizarSaudacao()
}
const select = document.getElementById('gameSelect')
const assunto = select.value

function gerarEspecialidade(assunto) {
  const temas = {
    tenis: 'escolha de tênis para corrida',
    treinos: 'treinamento para corredores',
    dieta: 'nutrição para corredores',
    tecnica: 'técnica de corrida'
  }

  return temas[assunto] || 'corrida'
}

const perguntarIA = async (question, game, apiKey) => {
  const perfilSalvo = localStorage.getItem('perfilCorredor')

let perfilTexto = ''

if (perfilSalvo) {
  const perfil = JSON.parse(perfilSalvo)

  perfilTexto = `
Perfil do corredor:
Nome: ${perfil.nome}
Peso: ${perfil.peso} kg
Altura: ${perfil.altura} m
Dores/lesões: ${perfil.dores.join(', ') || 'Nenhuma'}
`
}
  const select = document.getElementById('gameSelect')
  const assunto = select.value

  const especialidade = gerarEspecialidade(assunto)
  // Monta histórico invisível
  const contexto = historico
    .map(item => `Usuário: ${item.pergunta}\nIA: ${item.resposta}`)
    .join('\n\n')
  const model = 'gemini-2.5-flash'
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = 
  
  `
## Especialidade
Você é um especialista em ${especialidade}.
${perfilTexto}

## Tarefa
Você deve responder as perguntas do usuário com base em evidências e boas práticas atualizadas.

## Regras
-Se não souber, responda "não sei".
-Se não estiver relacionado ao tema, responda "Essa pergunta não está relacionada ao tema".
-Considere a data atual ${new Date().toLocaleDateString()}.
-Nunca invente informações.

## Estilo de Comunicação
- Use tom humano, motivador e profissional.
- Seja claro e direto, mas natural (não robótico).
- Demonstre empatia com o corredor.
- Use frases curtas e objetivas.
- Evite parecer um manual técnico.




## Resposta
-Seja direto e use no máximo 1500 caracteres.
-Responda em markdown.
-Não faça saudações.
-Use um tom natural e amigável
- Seja útil e encorajador.
- Não faça saudações longas.
- Você é um treinador experiente, didático e motivador.

---
Histórico da conversa:
${contexto}

Nova pergunta:
${question}
`

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: pergunta
        }
      ]
    }
  ]

  const tools = [
    {
      google_search: {}
    }
  ]

  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  console.log({ data })
  //return data.candidates[0].content.parts[0].text
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.'
}

const enviarFormulario = async event => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == '' || game == '' || question == '') {
    alert('Preencha todos os campos!')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    //Perguntar para a IA
    const text = await perguntarIA(question, game, apiKey)
    historico.push({
      pergunta: question,
      resposta: text
    })

    // Limita a 5 interações
    if (historico.length > 5) {
      historico.shift()
    }
    iaResponse.querySelector('.responseContent').innerHTML =
      markdownToHTML(text)
    iaResponse.classList.remove('hidden')
  } catch (error) {
    console.log('Erro ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', enviarFormulario)
// 1️⃣ Pega o formulário pelo ID
const forms = document.getElementById('perfil')

// 2️⃣ Escuta o evento de submit
forms.addEventListener('submit', function (event) {
  // 3️⃣ Impede a página de recarregar
  event.preventDefault()

  const nome = forms.nome.value
  const peso = Number(forms.peso.value)
  const altura = Number(forms.altura.value)

  const dores = []
  document.querySelectorAll('input[name="dores"]:checked').forEach(checkbox => {
    dores.push(checkbox.value)
  })

  const dadosPerfil = {
    nome,
    peso,
    altura,
    dores
  }
  localStorage.setItem('perfilCorredor', JSON.stringify(dadosPerfil))
  console.log('Perfil salvo ✅', dadosPerfil)
  perfil.classList.add('hidden')
  form.classList.remove('hidden')
  cabecalho.classList.add('hidden')
  saudacao.classList.remove('hidden')
  atualizarSaudacao()
})
const perfilSalvo = JSON.parse(localStorage.getItem('perfilCorredor'))
if (perfilSalvo) {
  const titulo = document.querySelector('#saudacao h2')
  titulo.textContent = `Olá, ${perfilSalvo.nome} 👋`
}

function mostrar() {
  form.classList.add('hidden')
  perfil.classList.remove('hidden')
  form.classList.add('hidden')
  profile - editor.add('hidden')
}

function atualizarSaudacao() {
  const perfilSalvo = JSON.parse(localStorage.getItem('perfilCorredor'))

  if (perfilSalvo) {
    const titulo = document.querySelector('#saudacao h2')
    titulo.textContent = `Olá, ${perfilSalvo.nome} 👋`
  }
}
window.addEventListener('DOMContentLoaded', carregarPerfil)