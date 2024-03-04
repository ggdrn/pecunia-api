const processamentoDados = async json => {
    // Remover caracteres indesejados
    const cleanJsonString = json
        .replace(/\n/g, '') // Remover quebras de linha
        .replace(/\\/g, '') // Remover barras invertidas

    // Remover o código de formatação Markdown ```json
    const cleanJsonStringWithoutMarkdown = cleanJsonString
        .replace(/^.*?```json|```$/g, '');

    try {
        // Converter a string limpa para um objeto JavaScript
        const jsonObject = JSON.parse(cleanJsonStringWithoutMarkdown);
        return jsonObject;
    } catch (error) {
        console.error('Erro ao converter a string para JSON:', error.message);
        return cleanJsonStringWithoutMarkdown;
    }
}

const processamentoJsonGemini = async json => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // const MODEL_NAME = "gemini-pro";
    const MODEL_NAME = "gemini-pro";
    const API_KEY = process.env.GENIMI_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const parts = [
        {
            text: `
            PEDIDO: eu tenho essa string aqui : ${json} \n
            Quero convertela para  um objeto em js. Quero que você remover esses "\n" e esse "\"  e qualquer caractere que quebre o json do texto para ter uma estrutura de json limpa, SAIDA: Apenas o json limpo`
        }
    ]

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        // safetySettings,
    });

    try {
        return JSON.parse(result.response.text())
    }
    catch (e) {
        console.log("Impossivel limpar o dado fornecido")
        return result.response.text()
    }


}

const processaConta = async (payload, imageFormat) => {

    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // const MODEL_NAME = "gemini-pro";
    const MODEL_NAME = imageFormat ? "gemini-pro-vision" : "gemini-pro";
    const API_KEY = process.env.GENIMI_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const parts = [
        {
            text: `
                PEDIDO: \n
                - De acordo com os dados de texto de um corpo de email que vou te passar, você sabe me dizer que se trata de uma conta de luz, água, ou internet ou cartão?  \n
                - Sabe me dizer data dessa conta, no formato yyyy-mm-dd? \n
                - Qual valor da dessa conta? Consegue me passar o código de barras dessa conta ou o código pix? \n 
                CONTEXTO, exemplo de uma SAIDA, seguinte a estrutura:
                {
                    tipo_conta: TYPE:STRING // ("agua" ou "luz" ou "internet" ou "cartao"), 
                    tipo_cartao: TYPE:STRING // (Se for tipo cartão, falar de qual banco esse cartão de crédito se trata ou false para caso não ache)
                    valor: TYPE:NUMBER, // Valor da conta que precisa ser pago
                    data_conta: TYPE:DATE // (yyyy-mm-dd), 
                    tipo_pagamento: TYPE:STRING // ("pix" ou "boleto" ou false para caso não ache), 
                    cod_pagamento: TYPE:STRING // (codigo para pagar o pix ou o codigo de barras do boleto ou false para caso não ache.)
                } 
                \n
                PEDIDO:Quero uma estrutura válida de JSON sem o texto marcando 'json' na resposta, Caso você não consiga processar todos os dados, retorne o json de exemplo com todos os campos nulos. Os seguintes dados para serem analisados:
                \n
                ${JSON.stringify(payload)}
                ${imageFormat ? 'analise a imagem em anexo para agregar as informações solicitadas e obter os dados para montar o json' : ''}
                `
        },

    ];
    if (imageFormat) {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: imageFormat
            }
        })
    }

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        // safetySettings,
    });

    const obj = await processamentoDados(result.response.text());

    return obj;


}

module.exports = processaConta;