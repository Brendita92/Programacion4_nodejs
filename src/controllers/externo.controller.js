export const obtenerClima = async (req, res) => {
  try {
    const respuestaExterna = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-29.14&longitude=-59.26&current_weather=true"
    );

    if (!respuestaExterna.ok) {
      throw new Error(`La API externa falló con status: ${respuestaExterna.status}`);
    }

    const datosClima = await respuestaExterna.json();

    return res.json({
      mensaje: "Datos del clima obtenidos correctamente",
      temperaturaActual: datosClima.current_weather.temperature,
      viento: datosClima.current_weather.windspeed,
      hora: datosClima.current_weather.time
    });

  } catch (error) {
    return res.status(502).json({
      mensaje: "Error al obtener datos de la API externa",
      error: error.message
    });
  }
};

