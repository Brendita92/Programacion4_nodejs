export const buscarPersonaje = async (req, res) => {
    try {
        const nombreBuscado = req.query.personaje;

        if (!nombreBuscado) {
            return res.status(400).json({ mensaje: "Debe indicar el parámetro 'personaje' en la query" });
        }

        const respuestaExterna = await fetch(
            `https://swapi.dev/api/people/?search=${encodeURIComponent(nombreBuscado)}`
        );

        if (!respuestaExterna.ok) {
            throw new Error(`La API externa falló con status: ${respuestaExterna.status}`);
        }

        const datos = await respuestaExterna.json();

        if (!datos.results || datos.results.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ningún personaje con ese nombre" });
        }

        const personaje = datos.results[0];

        res.status(200).json({
            nombre: personaje.name,
            altura: personaje.height,
            peso: personaje.mass,
            añoNacimiento: personaje.birth_year
        });

    } catch (error) {
        res.status(502).json({
            mensaje: "Bad Gateway: Error al comunicarse con el servidor externo",
            error: error.message
        });
    }
};
