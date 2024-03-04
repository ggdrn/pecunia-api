const processaConta = async (payload) => {

    const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

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

    const safetySettings = [
        // {
        //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        // },
        // {
        //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        // },
        // {
        //     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        // },
        // {
        //     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        // },
    ];

    const parts = [
        {
            text: `De acordo com os dados que vou te passar, você sabe me dizer que se trata de uma conta de luz, água, ou internet? 
                Sabe me dizer data dessa conta, no formato yyyy-mm-dd? 
                Qual valor da dessa conta? Consegue me passar o código de barras dessa conta ou o código pix? 
                Essa resposta você me retorna em uma estrutura de JSON, segue o exemplo de estrutura de dado que deve retornar:
                 
                { 
                    tipo_conta: "agua" ou "luz" ou "internet", 
                    valor: 222, 
                    data_conta: 2022-01-01, 
                    tipo_pagamento: "pix" ou "boleto" ou false para caso não ache, 
                    cod_pagamento: 123412414124214 ou false para caso não ache.
                }

                segue o json abaixo para analise:

                ${JSON.stringify(payload)}

                Caso você não consiga processar todos os dados, retorne o json de exemplo com todos os campos nulos.
                `

        },
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        // safetySettings,
    });
    // Remover caracteres de quebra de linha
    const cleanStr = result.response.text()
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
    .replace(/'/g, '"');

    // Converter a string para um objeto JSON
    const jsonData = JSON.parse(cleanStr);

    // return cleanStr;
    return jsonData;

}

module.exports = processaConta;