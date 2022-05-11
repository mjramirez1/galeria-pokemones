const http = require('http')
const axios = require('axios')
const fs = require('fs')

const getPokeDetalles = async (url) => {
    return await axios(url)
}

const getPokemones = async () => {
    return new Promise(async (resolve, reject) => {
        const data = await axios('https://pokeapi.co/api/v2/pokemon?limit=151')
        const dataPokemones = data.data.results
        const promesaDetalle = []
        const dataConsolidada = []
        dataPokemones.forEach((pokemon) => {
            promesaDetalle.push(getPokeDetalles(pokemon.url))
        });

        Promise.all(promesaDetalle).then((dataArray) => {
            dataArray.forEach((data, i) => {
                const img = data.data.sprites.front_default
                const nombre = dataPokemones[i].name
                dataConsolidada.push({ nombre, img })
            })
            resolve(dataConsolidada)
        })
    })
}
http.createServer(async (req, res) => {
    if (req.url === '/pokemones') {
        const pokemones = await getPokemones()
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(pokemones))
        res.end()
    }
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('index.html', (err, html) => {
            res.end(html)
        })
    }
}).listen(3000, () => console.log('Servidor ON puerto 3000'))