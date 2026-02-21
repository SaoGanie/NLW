const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const form = document.getElementById('form');
const iaResponse = document.getElementById('iaResponse');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


// AIzaSyC8sztpwWiiZpsebRbZ1s1Zq21hm6rIU4I


const perguntarIA = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    ## Especialidade
    Você é um especialista assistende de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo , estratégias, builds e dicas.

    ## Regras
    -Se você não sabe a resposta responda com não sei e não tente inventar uma resposta.
    -Se a perunta não está relaciona ao jogo, responda 'Essa pergunta não está relaciona ao jogo'.
    -Considere a data atual ${new Date().toLocaleDateString()}.
    -Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    -Nunca responda itens que você não tenha certeza que existe no pacth atual.
    
    ##Resposta 
    -Economize na resposta, seja direto e use no máximo 500 caracteres.
    -Responda em markdown
    -Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está perguntando.

    ## Exemplo de resposta 
    Pergunta do usuário: Melhor build rengar jungle
    Resposta: A build mais atual é: \n \n **itens** \n \n Coloque os itens aqui \n \n **Runas** \n \n 
    exemplo de runas \n \n

    ---
    Aqui está a pergunta do usuário: ${question}
`

    const contents = [{
        role:"user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search:{}
    }]



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
    return data.candidates[0].content.parts[0].text
}







const enviarFormulario = async (event) => {

    event.preventDefault()
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if (apiKey == '' || game == '' || question == '') {
        alert('Preencha todos os campos!')
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')


    try {
        //Perguntar para a IA
     const text=   await perguntarIA(question, game, apiKey);
     iaResponse.querySelector('.responseContent').innerHTML = markdownToHTML(text)
     iaResponse.classList.remove('hidden')

    } catch (error) {
        console.log('Erro ', error)
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }




}

form.addEventListener('submit', enviarFormulario)