const { OpenAIAPI } = require('openai');
const { leerDatosProductos } = require('./leerDatosProductos');

// Configurar la API de OpenAI
const openai = new OpenAIAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.leerDatosSQLite = leerDatosSQLite;

// Función para enviar datos a la API de OpenAI
async function enviarPromptConDatos(datos) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4.0-turbo", // Asegúrate de utilizar el modelo correcto
            messages: [
                {
                    role: "system",
                    content: "Tu mensaje de sistema va aquí"
                },
                {
                    role: "user",
                    content: `Aquí están los datos: ${datos}`
                }
            ]
        });

        console.log('Respuesta:', response.data);
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
}



enviarPromptConDatos(leerDatosProductos)


