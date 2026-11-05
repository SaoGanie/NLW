# 🏃 RunIA – Seu Assistente Inteligente para Corridas

O **RunIA** é uma aplicação web experimental desenvolvida para auxiliar corredores com orientações sobre treinos, escolha de tênis, nutrição e técnicas de corrida, utilizando Inteligência Artificial para oferecer respostas personalizadas.

O projeto foi desenvolvido a partir de uma aplicação apresentada durante a **NLW da Rocketseat**, que utilizei como base de aprendizado e desenvolvimento. A partir da estrutura original, realizei modificações para transformar a aplicação em um assistente especializado em corrida, ampliando suas funcionalidades e explorando a integração com IA generativa.

## 🚀 Funcionalidades

- **Perfil personalizado:** cadastro de informações do corredor, como nome, peso, altura e regiões onde sente dores.
- **Assistente com IA:** integração com a API do Google Gemini para responder perguntas relacionadas à corrida.
- **Orientações por especialidade:** seleção de assuntos como escolha de tênis, treinamento, nutrição e técnica de corrida.
- **Respostas contextualizadas:** utilização das informações do perfil para personalizar as orientações.
- **Histórico de conversas:** manutenção das últimas interações para fornecer contexto às respostas da IA.
- **Armazenamento local:** utilização do LocalStorage para salvar os dados do perfil do usuário.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Gemini API
- Fetch API
- LocalStorage
- Showdown.js (conversão de Markdown para HTML)

## 💡 Modificações e desenvolvimento

Partindo do projeto-base da Rocketseat, desenvolvi uma proposta própria, adaptando a aplicação para funcionar como um assistente especializado em corrida.

Entre as principais modificações realizadas estão:

- Criação de um formulário de perfil para armazenar informações individuais do corredor.
- Desenvolvimento de um sistema de personalização das respostas com base nos dados cadastrados.
- Integração com a API do Google Gemini, utilizando o modelo Gemini 2.5 Flash.
- Elaboração de prompts com instruções específicas para cada especialidade, definindo contexto, comportamento e restrições das respostas.
- Implementação de histórico de conversas para manter a continuidade das interações.
- Adaptação da interface e dos elementos visuais para a identidade do RunIA.

## ▶️ Como executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/SaoGanie/NLW.git
   ```

2. Abra a pasta do projeto.

3. Execute o arquivo `index.html` utilizando um servidor local ou uma extensão como Live Server no VS Code.

4. Cadastre seu perfil e informe sua chave de API do Google Gemini no campo disponibilizado para testes.

5. Escolha uma especialidade, digite sua pergunta e interaja com o assistente.

## ⚠️ Status do projeto

**Versão Alfa – Em desenvolvimento.**

O RunIA é um projeto independente de aprendizado e experimentação. Algumas funcionalidades ainda podem passar por melhorias e ajustes.

A integração atual com o Gemini utiliza uma chave de API informada manualmente durante os testes. A aplicação ainda não possui um backend para gerenciamento seguro das requisições.

## 🎯 Objetivo

Explorar o desenvolvimento Front-End e a integração com ferramentas de Inteligência Artificial generativa, aplicando conceitos de JavaScript, manipulação do DOM, consumo de APIs e engenharia de prompt na construção de uma aplicação prática.

