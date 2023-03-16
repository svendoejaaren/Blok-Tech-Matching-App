const getPokemon = () => {
    fetch("https://pokeapi.co/api/v2/type/2")
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
    }).catch((error) => {
        console.log("Pokemon not found", error)
    })
}

getPokemon()