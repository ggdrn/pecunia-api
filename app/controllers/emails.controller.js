const gmail = require("../config/gmail.config")
const processaConta = require("../service/genimi.service")

function setPartEmail(payload) {
	try {
		if (payload.parts[0].body.data) {
			return payload.parts[0].body.data
		} else if (payload.parts[0].parts[0].body.data) {
			return payload.parts[0].parts[0].body.data
		} else {
			return ""
		}
	} catch (e) {
		return ""
	}
}

exports.findAll = async (req, res) => {
	try {

		// Crie a consulta de pesquisa
		const query = 'Enel';

		// Faça a requisição para buscar emails
		const response = await gmail.users.messages.list({
			userId: 'me',
			q: query
		})
		// Acessar os emails na propriedade "messages" da resposta
		const messages = response.data.messages;

		// Extrair o título e o conteúdo de cada email
		// res.send({messages});

		// const result = await messages.map(async message => {]
		const allData = [];
		for (let i = 0; i < 3; i++) {
		// for (let i = 0; i < messages.length; i++) {
			const { data } = await gmail.users.messages.get({
				userId: 'me',
				id: messages[i].id
			})
			const subject = data.payload.headers.find(header => header.name === 'Subject').value;
			const body = Buffer.from(setPartEmail(data.payload), 'base64').toString();
			const result = await processaConta({ subject, body })
			allData.push(result);
			//   const subject = message.payload.headers.find(header => header.name === 'Subject').value;
			//   const content = message.payload.body.data;

			//   return {
			// 	subject,
			// 	content
			//   };
			// });
		}
		res.send({ result: allData });
	} catch (err) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving Adminstradores."
		});
	}
}