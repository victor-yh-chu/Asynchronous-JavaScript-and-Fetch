const searchBtn = document.getElementById("searchBtn");
const addBtn = document.getElementById("addBtn");
const pokemonName = document.getElementById("pokemonName");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonCry = document.getElementById("pokemonCry");
pokemonImage.src = "poke.png";
const moveDropdowns = [
    document.getElementById("move1"),
    document.getElementById("move2"),
    document.getElementById("move3"),
    document.getElementById("move4")
];

const teamDiv = document.getElementById("team");
const cache = {};
let currentPokemon = null;
searchBtn.addEventListener("click", () => {
    const input = document.getElementById("pokemonInput").value.toLowerCase().trim();
    if (!input) return;
    fetchPokemon(input);
});

async function fetchPokemon(identifier) {
    if (cache[identifier]) {
        displayPokemon(cache[identifier]);
        return;
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!response.ok) throw new Error("Pokemon not found");
        const data = await response.json();
        cache[identifier] = data;
        displayPokemon(data);
    } catch (error) {
        alert("Pokemon not found!");
    }
}

function displayPokemon(data) {

    currentPokemon = data;
    pokemonName.textContent = data.name.toUpperCase();
    pokemonImage.src = data.sprites.front_default;
    pokemonImage.alt = data.name;

    if (data.cries && data.cries.latest) {
        pokemonCry.src = data.cries.latest;
    }
    moveDropdowns.forEach(select => {
        select.innerHTML = "";
    });
    const moves = data.moves.slice(0, 20);
    moves.forEach(moveObj => {
        moveDropdowns.forEach(select => {
            const option = document.createElement("option");
            option.value = moveObj.move.name;
            option.textContent = moveObj.move.name;
            select.appendChild(option.cloneNode(true));
        });
    });
}

addBtn.addEventListener("click", () => {

    if (!currentPokemon) return;
    const selectedMoves = moveDropdowns.map(select => select.value);
    const pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = `
        <h3>${currentPokemon.name.toUpperCase()}</h3>
        <img src="${currentPokemon.sprites.front_default}">
        <ul>
            <li>${selectedMoves[0]}</li>
            <li>${selectedMoves[1]}</li>
            <li>${selectedMoves[2]}</li>
            <li>${selectedMoves[3]}</li>
        </ul>
        <hr>
    `;
    teamDiv.appendChild(pokemonCard);
    resetDisplay();
});

function resetDisplay() {
    currentPokemon = null;
    pokemonName.textContent = "";
    pokemonImage.src = "poke.png";
    pokemonCry.src = "";
    pokemonCry.load();
    moveDropdowns.forEach(select => {
        select.innerHTML = "";
    });
    document.getElementById("pokemonInput").value = "";
}
