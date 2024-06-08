document.addEventListener('DOMContentLoaded', () => {
    const botonBuscarPorNombre = document.getElementById('boton-buscar-por-nombre');
    const botonBuscarPorId = document.getElementById('boton-buscar-por-id');
    const botonBuscarPorTipo = document.getElementById('boton-buscar-por-tipo');
    const botonBuscarPorHabilidad = document.getElementById('boton-buscar-por-habilidad');
    const botonAleatorio = document.getElementById('boton-aleatorio');
    const botonLimpiar = document.getElementById('boton-limpiar');
    const pokemonElemento = document.getElementById('pokemon');
    const mensajeError = document.getElementById('mensaje-error');
    const inputBuscar = document.getElementById('buscar');
    const paginacion = document.getElementById('paginacion');
    const botonPaginaAnterior = document.getElementById('pagina-anterior');
    const botonPaginaSiguiente = document.getElementById('pagina-siguiente');
    const infoPagina = document.getElementById('info-pagina');

    let paginaActual = 1;
    const elementosPorPagina = 5;
    let listaPokemonActual = [];

    const mostrarError = (mensaje) => {
        mensajeError.textContent = mensaje;
        mensajeError.classList.remove('hidden');
    };

    const limpiarError = () => {
        mensajeError.textContent = '';
        mensajeError.classList.add('hidden');
    };

    const limpiarPokemon = () => {
        pokemonElemento.innerHTML = '';
    };

    const buscarPokemon = async (url) => {
        limpiarError();
        limpiarPokemon();

        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error('Pokémon no encontrado');
            }

            const datos = await respuesta.json();
            pokemonElemento.innerHTML = `
                <h2>${datos.name}</h2>
                <img src="${datos.sprites.other.showdown.front_default}" alt="${datos.name}">
                <p>Altura: ${datos.height / 10} m</p>
                <p>Peso: ${datos.weight / 10} kg</p>
            `;
        } catch (error) {
            mostrarError('Error: ' + error.message);
        }
    };

    const buscarListaPokemon = async (listaPokemon, pagina = 1) => {
        limpiarError();
        limpiarPokemon();

        listaPokemonActual = listaPokemon;
        paginaActual = pagina;
        const indiceInicio = (paginaActual - 1) * elementosPorPagina;
        const indiceFin = paginaActual * elementosPorPagina;

        const itemsActuales = listaPokemon.slice(indiceInicio, indiceFin);

        try {
            for (const pokemon of itemsActuales) {
                const respuesta = await fetch(pokemon.pokemon.url);
                if (!respuesta.ok) {
                    throw new Error('Pokémon no encontrado');
                }

                const datos = await respuesta.json();
                const itemPokemon = document.createElement('div');
                itemPokemon.innerHTML = `
                    <h2>${datos.name}</h2>
                    <img src="${datos.sprites.other.showdown.front_default}" alt="${datos.name}">
                    <p>Altura: ${datos.height / 10} m</p>
                    <p>Peso: ${datos.weight / 10} kg</p>
                `;
                pokemonElemento.appendChild(itemPokemon);
            }
            const totalPaginas = Math.ceil(listaPokemonActual.length / elementosPorPagina);
            infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
            botonPaginaAnterior.disabled = paginaActual === 1;
            botonPaginaSiguiente.disabled = paginaActual === totalPaginas;

            if (totalPaginas > 1) {
                paginacion.classList.remove('hidden');
            } else {
                paginacion.classList.add('hidden');
            }
        } catch (error) {
            mostrarError('Error: ' + error.message);
        }
    };


    botonPaginaAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            buscarListaPokemon(listaPokemonActual, paginaActual);
        }
    });

    botonPaginaSiguiente.addEventListener('click', () => {
        const totalPaginas = Math.ceil(listaPokemonActual.length / elementosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            buscarListaPokemon(listaPokemonActual, paginaActual);
        }
    });

    botonBuscarPorNombre.addEventListener('click', () => {
        const buscar = inputBuscar.value.trim().toLowerCase();
        if (!buscar) {
            alert('Ingrese el nombre de un Pokémon.');
            return;
        }
        buscarPokemon(`https://pokeapi.co/api/v2/pokemon/${buscar}`);
    });

    botonBuscarPorId.addEventListener('click', () => {
        const buscar = inputBuscar.value.trim();
        if (!buscar || isNaN(buscar)) {
            alert('Ingrese un ID válido de Pokémon.');
            return;
        }
        buscarPokemon(`https://pokeapi.co/api/v2/pokemon/${buscar}`);
    });

    botonBuscarPorTipo.addEventListener('click', async () => {
        const buscar = inputBuscar.value.trim().toLowerCase();
        if (!buscar) {
            alert('Ingrese el tipo de un Pokémon.');
            return;
        }

        try {
            const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${buscar}`);
            if (!respuesta.ok) {
                throw new Error('Tipo no encontrado');
            }
            const datos = await respuesta.json();
            await buscarListaPokemon(datos.pokemon);
        } catch (error) {
            mostrarError('Error: ' + error.message);
        }
    });

    botonBuscarPorHabilidad.addEventListener('click', async () => {
        const buscar = inputBuscar.value.trim().toLowerCase();
        if (!buscar) {
            alert('Ingrese la habilidad de un Pokémon.');
            return;
        }

        try {
            const respuesta = await fetch(`https://pokeapi.co/api/v2/ability/${buscar}`);
            if (!respuesta.ok) {
                throw new Error('Habilidad no encontrada');
            }
            const datos = await respuesta.json();
            await buscarListaPokemon(datos.pokemon);
        } catch (error) {
            mostrarError('Error: ' + error.message);
        }
    });

    botonAleatorio.addEventListener('click', () => {
        const id = Math.floor(Math.random() * 1025) + 1;
        buscarPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`);
    });

    botonLimpiar.addEventListener('click', () => {
        limpiarError();
        limpiarPokemon();
        paginacion.classList.add('hidden');
    });
});