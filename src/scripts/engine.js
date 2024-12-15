const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-players")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fildCards: {
        player: document.getElementById("player-card"), 
        computer: document.getElementById("computer-card")
    },
    playerSides: {
        player: "player-cards",
        computer: "computer-cards",
        playerBox: document.getElementById("player-cards"),
        computerBox: document.getElementById("computer-cards")
    },
    actions: {
        button: document.getElementById("next-level")
    }
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon", 
        type: "Papel",
        img: "./src/assets/icons/dragon.png",
        winOf: [1], 
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Margician", 
        type: "Pedra",
        img: "./src/assets/icons/magician.png",
        winOf: [2], 
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia", 
        type: "Tesoura",
        img: "./src/assets/icons/exodia.png",
        winOf: [0], 
        loseOf: [1]
    }
]

async function getRandomId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player){
        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        });

        //Desenha a do jogador no lado esquerdo
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId);
        });
    }

    return cardImage;
}

async function setCardField(cardIdPlayer) {
    await removeAllCardsImages();

    await hiddenCardsDetails();

    let cardIdComputer = await getRandomId();

    await showHiddenCardFieldsImages(true);

    await drawCardsInField(cardIdPlayer, cardIdComputer);

    let duelResults = await checkDuelResults(cardIdPlayer, cardIdComputer);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardIdPlayer, cardIdComputer) {
    state.fildCards.player.src = cardData[cardIdPlayer].img;
    state.fildCards.computer.src = cardData[cardIdComputer].img;
}

async function showHiddenCardFieldsImages(value) {
    if(value === true){
        state.fildCards.player.style.display = "block";
        state.fildCards.computer.style.display = "block";
    } 
    if(value === false) {
        state.fildCards.player.style.display = "none";
        state.fildCards.computer.style.display = "none";
    }
}

async function hiddenCardsDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function checkDuelResults(playerId, computerId) {
    let duelResult = "Empate";
    let statusAudio;

    if(cardData[playerId].winOf.includes(computerId)){
        duelResult = "Ganhou";
        state.score.playerScore++;
        statusAudio = "win";
    }

    if(cardData[playerId].loseOf.includes(computerId)){
        duelResult = "Perdeu";
        state.score.computerScore++;
        statusAudio = "lose";
    }

    await playAudio(statusAudio);
    return duelResult;
}

async function updateScore() {
    const textScore = `Ganhou ${state.score.playerScore} | Perdeu ${state.score.computerScore}`;
    state.score.scoreBox.innerText = textScore;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

//Funcao que remove todas as cartas da tela
async function removeAllCardsImages() {
    let cards = state.playerSides.computerBox; 
    cards.querySelectorAll("img").forEach((img) => img.remove());

    cards = state.playerSides.playerBox; 
    cards.querySelectorAll("img").forEach((img) => img.remove());
}

//Funcao que modifica o nome, tipo e avatar do lado esquerdo
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const randomId = await getRandomId();
        const cardImage = await createCardImage(randomId, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch (error) {
        console.log(error);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    
    state.fildCards.player.style.display = "none";
    state.fildCards.computer.style.display = "none";

    init();
}

function init(){
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();