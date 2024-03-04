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
async function converterPdf2Img(pdfBuffer) {
	try {
		const pdfToPng = require('pdf-to-png-converter').pdfToPng;


		const pngPage = await pdfToPng(pdfBuffer, {
			disableFontFace: false,
			useSystemFonts: false,
			pagesToProcess: [1],
			viewportScale: 2.0,
			pdfFilePassword: '15777'
		});

		return pngPage[0].content;
	} catch (error) {
		return null;
	}


}
exports.findAll = async (req, res) => {
	try {

		// Crie a consulta de pesquisa
		const query = 'enel';

		// Faça a requisição para buscar emails
		const response = await gmail.users.messages.list({
			userId: 'me',
			q: query
		})
		// Acessar os emails na propriedade "messages" da resposta
		const messages = response.data.messages;

		const allData = [];
		for (let i = 0; i < 5; i++) {
		// for (const message of messages) {
			const { data } = await gmail.users.messages.get({
				userId: 'me',
				id: messages[i].id
				// id: message.id
			})
			const subject = data.payload.headers.find(header => header.name === 'Subject').value;
			let body = Buffer.from(setPartEmail(data.payload), 'base64');
			if (body){
				body = body.toString()
			}
			let anexo = "";
			
			// Processar anexos, se existirem
			if (data.payload.parts && data.payload.parts.length > 1) {
				const attachments = data.payload.parts.slice(1); // Ignorar a parte do corpo

				for (const attachment of attachments) {
					const attachmentId = attachment.body.attachmentId;

					if (attachmentId) {
						// Obter detalhes do anexo
						const attachmentDetails = await gmail.users.messages.attachments.get({
							userId: 'me',
							messageId: messages[i].id,
							// messageId: message.id,
							id: attachmentId,
						});

						const attachmentData = Buffer.from(attachmentDetails.data.data, 'base64')
						// Salvar o anexo

						anexo = await converterPdf2Img(attachmentData);
						if (anexo) {
							anexo = anexo.toString("base64")
						}
					}
				}
			}
			console.log("processando email: ",   messages[i].id)
			// allData.push({ subject, body, anexo });
			const result = await processaConta({ subject, body }, anexo)
			allData.push(result);
			console.log("processamento concluido")

		}
		console.log("finalizado")
		res.send({ result: allData });
	} catch (err) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving Adminstradores."
		});
	}
}