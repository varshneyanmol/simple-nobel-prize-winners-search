const nameInput = document.querySelector("#name");
const tableBody = document.querySelector("tbody");

async function searchWinnerByName() {
    const searchedName = nameInput.value.toUpperCase().trim();

    if (!searchedName) {
        return;
    }

    const promises = [
        getLaureates(),
        getPrizes()
    ];

    let [laureates, prizes] = await Promise.all(promises);

    prizes = prizes.map(prize => {
        const newPrize = {
            ...prize,
            laureates: (prize.laureates || []).map(laureate => {
                return laureates.find(_laureate => _laureate.id === laureate.id)
            }),
            winnerNames: (prize.laureates || []).reduce((string, laureate, laureates, index) => {
                if (!string) {
                    return laureate.firstname + (laureate.surname || "");
                }
                return string + "," + laureate.firstname + (laureate.surname || "");
            }, '')
        };

        newPrize.searchedWinner = (newPrize.laureates || []).find(laureate => {
            return (laureate.firstname || "").toUpperCase().includes(searchedName) ||
                (laureate.surname || "").toUpperCase().includes(searchedName);
        });

        return newPrize;
    });

    const searchResults = prizes.filter(prize => prize.laureates.some(laureate => {
        return (laureate.firstname || "").toUpperCase().includes(searchedName) ||
            (laureate.surname || "").toUpperCase().includes(searchedName);
    }));

    renderData(searchResults);
}

function renderData(prizes = []) {
    tableBody.innerHTML = '';

    if (prizes.length < 1) {
        tableBody.innerHTML = 'No laureate found';
    }
    prizes.forEach(prize => {
        const row = tableBody.insertRow();
        appendCell(row, prize.year);
        appendCell(row, prize.category);
        appendCell(row, (prize.searchedWinner || {bornCountry: ""}).bornCountry);
        appendCell(row, prize.winnerNames);
    });
}

function appendCell(row, text) {
    const cell = row.insertCell();
    const node = document.createTextNode(text);
    cell.appendChild(node);
}

async function getLaureates() {
    const response = await fetch("https://api.nobelprize.org/v1/laureate.json");
    if (!response.ok) {
        alert("HTTP-Error: " + response.status);
    }
    return (await response.json()).laureates;
}

async function getPrizes() {
    const response = await fetch("https://api.nobelprize.org/v1/prize.json");
    if (!response.ok) {
        alert("HTTP-Error: " + response.status);
    }
    return (await response.json()).prizes;
}
