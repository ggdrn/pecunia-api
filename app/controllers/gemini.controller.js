exports.findAll = async (req, res) => {

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
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const parts = [
        {
            text: `De acordo com o json que vou te passar, você sabe me dizer que se trata de uma conta de luz, água, ou internet? Sabe me dizer data dessa conta? Qual valor da dessa conta? Consegue me passar o código de barras dessa conta ou o código pix? Essas resposta você me retorna em uma estrutura de json apenas, como o exemplo: { tipo_conta: "agua" ou "luz" ou "internet", valor: 222, data_conta: 2022-01-01, tipo_pagamento: "pix" ou "boleto" ou false para caso não ache, cod_pagamento: 123412414124214 }


        "subject": "Sua Fatura Enel chegou!",
        "body": "Template de E-mail\r\n \r\n \r\n \r\n \r\n \r\n\t- N° DA INSTALAÇÃO/UC:55875292\r\n\t- N° DO CLIENTE:58293751\r\nOlá.\r\n\r\nEsta é sua conta de energia resumida da instalação/UC 55875292\r\n\r\nCom a conta digital você tem todas as informações ao seu alcance.\r\n\r\nQuanto eu vou pagar?\r\n\r\nR$ 199,18\r\nData de vencimento:\r\n05/03/2024\r\nQuer pagar com PIX? Acesse a conta anexa \r\n\r\nFique por dentro de tudo\r\nna agência virtual.\r\n\r\nGerencie seus pagamentos, análise do seu consumo mensal, solicite atendimento e muito mais!\r\n\r\nhttps://click.info-enel.com/?qs=947d7ccc934614b614db1464a6764648303184fb035eb879f8a70bae2f077618464b319d107ad2065fbfa06ac5162c6c0d6b189e2bb3ea8f \r\nAplicativo Enel\r\n\r\nBaixe nosso aplicativo e tenha sempre todos os nossos serviços na palma das suas mãos.\r\n\r\nhttps://click.info-enel.com/?qs=947d7ccc934614b6f742fe1b0d8407523c84f133af37a7f9d8e22366ad4cdf7329df6cd77153000fb966838da0278207193482dee73ad6c6 \r\n\r\nhttps://click.info-enel.com/?qs=947d7ccc934614b62ea83a2a05aefb5ab8a21d79b16a62868502db7eb5ba53cee847df115307887a453c794fbd3f50ed80ca0a1f7fa34d31 \r\n\r\nFale conosco:\r\n\r\n\t- \r\nhttps://click.info-enel.com/?qs=947d7ccc934614b63fd52f4038fe68154831e09548ab5a07db9b1b965ab88d7139fd077872442e8109037b4e7f25d2ec5b8e091736e448d4 \r\nWhatsApp\r\n\t- \r\nhttps://click.info-enel.com/?qs=947d7ccc934614b614db1464a6764648303184fb035eb879f8a70bae2f077618464b319d107ad2065fbfa06ac5162c6c0d6b189e2bb3ea8f \r\nSite Enel\r\n\t- \r\nhttps://click.info-enel.com/?qs=947d7ccc934614b6d98ada9e9745a22537d5df5940484ae9aa4f9317d925e2cce54159ab2ac0c75f1bfeef490cbb35e7f03b868be9aae673 \r\nFacebook\r\n\t- \r\nhttps://click.info-enel.com/?qs=6a4177a0b0019e1a746d16d2f34ecf669deb0cceb81f11a00ad18ddfa33b02ec19fd63cc3d5dfc454bb092fd84b7c285826e033bfe792460 \r\nTwitter\r\nCom a Enel, você pode escolher um amanhã melhor.\r\n\r\n"
       }, 
      
      1
      `},
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    res.send({ result: response });

}