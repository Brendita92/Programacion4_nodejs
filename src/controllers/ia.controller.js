import { GoogleGenerativeAI } from "@google/generative-ai";
import Producto from "../models/producto.js";

const genIA = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelosIA = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"];

const generarContenido = async (prompt, generationConfig) => {
  for (let indice = 0; indice < modelosIA.length; indice++) {
    const modelo = genIA.getGenerativeModel({
      model: modelosIA[indice],
      ...(generationConfig && { generationConfig })
    });

    try {
      return await modelo.generateContent(prompt);
    } catch (error) {
      const hayAlternativa = indice < modelosIA.length - 1;
      const errorTransitorio = error.status === 429 || error.status === 503;

      if (!hayAlternativa || !errorTransitorio) {
        throw error;
      }

      console.warn(`Modelo ${modelosIA[indice]} no disponible; probando ${modelosIA[indice + 1]}.`);
    }
  }
};

export const generarTexto = async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: "La pregunta es requerida" });
    }

    const promptFinal = `Eres un asistente técnico experto en Node.js. 
    Responde la siguiente pregunta de manera clara y concisa, sin agregar información adicional: ${pregunta}`;

    const resultadoIA = await generarContenido(promptFinal);
    const textoGenerado = resultadoIA.response.text();

    res.status(200).json({ respuesta: textoGenerado });
  } catch (error) {
    console.error("Error en la API:", error);
    const status = error.status === 429 || error.status === 503 ? error.status : 500;
    const mensaje = status === 500 ? "Error interno del servidor" : "Servicio de IA temporalmente no disponible";
    res.status(status).json({ error: mensaje });
  }
};

export const generarProductoConIA = async (req, res) => {
  try {
    const { nombreProducto, proveedor } = req.body;

    if (!nombreProducto || !proveedor) {
      return res.status(400).json({ error: "Debe enviar nombreProducto y proveedor en el body" });
    }

    const prompt = `

       sos un experto en e-commerce. analiza el siguiente producto "${nombreProducto}".
       Debes devolver la informacion estrictamnet con esta estructura JSON
         {
    "codigoSKU": "Formato obligatorio ABC-123: exactamente 3 letras, un guion y 3 numeros; ejemplo TEC-582. No uses espacios.",
    "nombre": aca va el nombre del producto,
    "descripcion": aca va la descripcion del producto,
    "precio": 45900 (Precio sugerido en pesos argentinos),
    "stock": 40,
    "categoria": "PERIFERICOS" (Analiza el nombre del producto y determina la categoria a la que pertenece),
    "proveedor": "507f1f77bcf86cd799439011" (aca va ${proveedor } que es el id del proveedor en la base de datos),
    "estadoActivo": true
  `;

    const result = await generarContenido(prompt, {
        responseMimeType: "application/json",
        temperature: 0.3
    });
    const datosFormateados = JSON.parse(result.response.text());
    if (typeof datosFormateados.codigoSKU === "string") {
      datosFormateados.codigoSKU = datosFormateados.codigoSKU
        .trim()
        .replace(/^([A-Za-z]{3})\s+(\d{3})$/, "$1-$2")
        .toUpperCase();
    }

    const producto = await Producto.create(datosFormateados);

    res.status(201).json({
      mensaje: "Producto autocompletado por la IA insertado en BD",
      producto
    });
  } catch (error) {
    console.error("Error en la API:", error);
    const status = error.status === 429 || error.status === 503 ? error.status : 500;
    const mensaje = status === 500 ? "Error interno del servidor" : "El servicio de IA está saturado. Intente nuevamente en unos minutos.";
    res.status(status).json({ error: mensaje });
  }
};