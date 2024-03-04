const defaultRule = {
    lengthMax: 999999,
    required: true,
    length: 3,
    type: 'text',
}

const validateEntrace = (name, value, rule = defaultRule) => {
    switch (rule.type) {
        case 'email':
            return emailValidate(rule, value, name);
        case 'cpf':
            return validarCPF(rule, value, name);
        case 'name':
            return validateName(rule, value, name);
        case 'text':
            return textValidate(rule, value, name);
        case 'rg':
            return validarRG(rule, value, name);
        case 'password':
            return validarSenha(rule, value, name);
        case 'number':
            return validarNumero(rule, value, name);
        case 'date':
            return validarData(rule, value, name);
        case 'tel':
            return validarNumeroTelefone(rule, value, name);
        default:
            return textValidate(rule, value, name);
    }
};
const emailValidate = (rule, value, name) => {
    if (rule.required) {
        if (value.trim('').split('').length == 0) {
            return { erro_code: 400, message: `O campo ${name} é obrigatório.` };
        }
    }
    const user = value.substring(0, value.indexOf('@'));
    const domain = value.substring(value.indexOf('@') + 1, value.length);
    // essse algoritomo valida se o email é valido, por isso, estamos negando a equação,
    // precisamos saber se o email é inválido
    if (!(
        (user.length >= 1) &&
        (domain.length >= 3) &&
        (user.search('@') == -1) &&
        (domain.search('@') == -1) &&
        (user.search(' ') == -1) &&
        (domain.search(' ') == -1) &&
        (domain.search('.') != -1) &&
        (domain.indexOf('.') >= 1) &&
        (domain.lastIndexOf('.') < domain.length - 1))) {
        return { erro_code: 400, message: `Insira um ${name} válido.` };
    }

    return false;
};
const textValidate = (rule, value, name) => {
    if (value == undefined) {
        return { erro_code: 400, message: `O campo ${name} é obrigatório.` };
    }
    if (rule.required) {
        if (value.trim('').split('').length == 0) {
            return { erro_code: 400, message: `O campo ${name} é obrigatório.` };
        }
    }
    if (value.trim('').split('').length > 0 && rule.length) {
        if (rule.length > value.split('').length) {
            return { erro_code: 400, message: `Por favor, forneça ao menos ${rule.length} caracteres.` };
        }
    }
    if (value.trim('').split('').length > 0 && rule.lengthMax) {
        if (rule.lengthMax < value.split('').length) {
            return { erro_code: 400, message: `Por favor, forneça até ${rule.lengthMax} caracteres.` };
        }
    }
    return false;
};
const validateName = (rule, value, name) => {
    // Verificar se o nome é uma string
    if (typeof value !== 'string') {
        return { erro_code: 400, message: 'forneça um nome válido' };
    }

    // Verificar se o nome contém apenas letras e espaços
    if (!/^[a-zA-Z\s]+$/.test(value)) {
        return { erro_code: 400, message: 'forneça um nome válido' };
    }

    // Verificar se o nome não está em branco
    if (value.trim() === '') {
        return { erro_code: 400, message: 'forneça um nome válido' };
    }

    // Se todas as verificações passarem, considerar o nome válido
    return false;
}
const validarCPF = (rule, value, name) => {
    // Remover caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Verificar se o value possui 11 dígitos
    if (value.length !== 11) {
        return { erro_code: 400, message: 'verifique seu CPF, ele é inválido' };
    }

    // Verificar values com dígitos repetidos (ex: 000.000.000-00)
    if (/^(\d)\1+$/.test(value)) {
        return { erro_code: 400, message: 'verifique seu CPF, ele é inválido' };
    }

    // Calcular o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(value.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    // Calcular o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(value.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    // Verificar se os dígitos verificadores são válidos
    if (parseInt(value.charAt(9)) === digitoVerificador1 && parseInt(value.charAt(10)) === digitoVerificador2) {
        return false;
    } else {
        return { erro_code: 400, message: 'verifique seu CPF, ele é inválido' };
    }
}
const validarRG = (rule, rg, name) => {
    // Remove possíveis caracteres não numéricos
    const rgNumerico = rg.replace(/\D/g, '');

    // Verifica se o RG tem 9 dígitos
    if (rgNumerico.length !== 9) {
        return { erro_code: 400, message: 'verifique seu RG, ele é inválido' };
    }

    // Implemente aqui suas regras de validação específicas, se necessário.

    // Se chegou até aqui, o RG é válido
    return false;
}

const validarSenha = (rule, senha, name) => {
    /* Você pode validar uma senha com pelo menos 8 dígitos, incluindo pelo menos 1 letra maiúscula, 1 
    letra minúscula e 1 caractere especial usando expressões regulares */
    // A expressão regular verifica se a senha atende aos critérios especificados.
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (regex.test(senha)) {
        return false; // A senha é válida
    } else {
        return { erro_code: 400, message: 'verifique sua Senha, ela não atende aos requisitos mínimos' };; // A senha não é válida
    }
}
const validarNumero = (rule, value, name) => {
    if (!isNaN(value)) {
        return false; // o valor é um numero
    } else {
        return { erro_code: 400, message: `O campo ${name} deve ser do tipo numérico` };
    }
}
function validarData(rule, value, name) {
    // Use uma expressão regular para verificar o formato da data
    const regexData = /^\d{4}-\d{2}-\d{2}$/;

    if (!regexData.test(value)) {
        return { erro_code: 400, message: `O campo ${name} deve ser uma data válida` }; // O formato da data está incorreto
    }

    // Tente criar uma instância de Date com o valor
    const data = new Date(value);

    // Verifique se a instância de Date é válida e se o ano, mês e dia estão dentro de faixas válidas
    if (!isNaN(data.getTime()) && data.getFullYear() >= 1000 && data.getFullYear() <= 9999) {
        return false;
    } else {
        return { erro_code: 400, message: `O campo ${name} deve ser uma data válida` };
    }
}
function validarNumeroTelefone(rule, value, name) {
    // Remova quaisquer caracteres não numéricos
    const numeroLimpo = value.replace(/\D/g, '');

    // Verifique se o número tem entre 10 e 11 dígitos
    if (numeroLimpo.length >= 10 && numeroLimpo.length <= 11) {
        // Verifique se o DDD é válido (dois primeiros dígitos)
        const ddd = numeroLimpo.substring(0, 2);
        if (ddd >= '11' && ddd <= '99') {
            // O número é válido
            return false;
        }
    }
    // O número não é válido
    return { erro_code: 400, message: `O campo ${name} deve ser um numero de telefone brasileiro válido` };
}
module.exports = validateEntrace; 