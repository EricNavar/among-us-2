// Adds card to temporary stack of cards to be played
export function placeCard(card, hand, inPlay, setInPlay, setTopOfStack, lastCardPlayed) {
  inPlay.push(card);
  setInPlay(inPlay);
  setTopOfStack(card);
  console.log("2: " + inPlay[inPlay.length - 1].v);
  hand.pop(card); // do we need to get this by index?
  checkHand(hand, lastCardPlayed, inPlay);
}

// Checks player's entire hand and grays out nonplayable cards
function checkHand(hand, lastCardPlayed, inPlay) {
  for (let i = 0; i < hand.length; i++) {
    if (!cardCheck(hand[i], lastCardPlayed, inPlay)) {
      // gray out the card
      hand[i].gray = true;
    }
    else {
      hand[i].gray = false;
    }
  }
}

export function canPlaceCard(hand, lastCardPlayed, inPlay) {
  let i = 0;
  while (i < hand.length) {
    if (cardCheck(hand[i], lastCardPlayed, inPlay)) {
      return true
    }
    i++;
  }
  return false;
}

// Drops one card at a time
function cardCheck(toConsider, lastCardPlayed, inPlay) {
  if (inPlay.length === 0) {
    return isValidFirstCard(toConsider, lastCardPlayed);
  }
  else {
    return isValidAdditionalCard(toConsider, inPlay[inPlay.length - 1], "none");
  }  
}

const isSpecialCard = (card) => {
  const specialCards = ["Draw 2", "Wild Color Card", "Revervse", "Skip Turn", "↩"];
  for (let i=0; i<specialCards; i++)
  if (card.v === specialCards[i]) {
    return true;
  }
  return false;
}

// toConsider is the card whose eligibility is being considered
// lastCard is the last card that was put down
export const isValidFirstCard = (toConsider, lastCard) => {
  if (toConsider.v === lastCard.v || toConsider.c === lastCard.c) {
    return true;
  }
  return isSpecialCard(toConsider);
}

// direction denotes the direction that the additional cards are going in
//   - direction = "increasing" if the user is increasing
//   - direction = "decreasing" if the user is decreasing
//   - direction = "none" if neither
// returns an array containing first if the additional card is valid, and second, the direction
// in which it's increasing or decreasing
export const isValidAdditionalCard = (toConsider, lastCard, direction) => {
  if (isSpecialCard(toConsider)) {
    return true;
  }
  if (toConsider.v === lastCard.v) {
    return [true, direction];
  }
  if (isLessThan(toConsider.v, lastCard.v)) {
    if (direction === "increasing") {
      return [false, direction];
    }
    else {
      return [true, "increasing"];
    }
  }
  else if (isGreaterThan(toConsider.v, lastCard.v)) {
    if (direction === "decreasing") {
      return [false, direction];
    }
    else {
      return [true, "decreasing"];
    }
  }
  else if (toConsider.v === 9 && lastCard.v === 0 && direction === "increasing") {
    return [true, direction];
  }
  else if (toConsider.v === 0 && lastCard.v === 9 && direction === "decreasing") {
    return [true, direction];
  }
  return [false, direction];
}

const isLessThan = (cardA, cardB) => {
  if (!isSpecialCard(cardA) && !isSpecialCard(cardB)) {
    return Number(cardA) < Number(cardB);
  }
  return false;
}

const isGreaterThan = (cardA, cardB) => {
  if (!isSpecialCard(cardA) && !isSpecialCard(cardB)) {
    return Number(cardA) > Number(cardB);
  }
  return false;
}

export const addCardToPlayer = (players, playerId, addCount) => {
  players.map(player => {
    if (player.id === playerId) {
      player.cardCount = player.cardCount + addCount;
    }
    /* wtf eric? (eric said to delete)
    if (selfId === player.id) {
      addCardSelf();
    } */
    return player;
  });
}

export const addCardToMyHand = (hand, card) => {
  hand.push(card);
  return sortCards(hand);
}

export const subtractCard = (players, playerId, subtractCount) => {
  players.map(player => {
    if (player.id === playerId) {
      player.cardCount = player.cardCount - subtractCount;
    }
    return player;
  });
}

export const isGameOver = (players) => {
  for (let i=0; i<players.length; i++) {
    if (players[i].cardCount <= 0) {
      return true;
    }
  }
  return false;
}

export const reset = (players) => {
  return players.map(player => {
    player.cardCount = 0;
    return player;
  });
}

function compareByColor(cardA, cardB) {
  const colors = ["red", "yellow", "green", "blue"];
  if (colors.indexOf(cardA.c) < colors.indexOf(cardB.c)) {
    return -1;
  }
  if (colors.indexOf(cardA.c) > colors.indexOf(cardB.c)) {
    return 1;
  }
  return 0;
}

function compareByValue(cardA, cardB) {
  if (isLessThan(cardA, cardB)) {
    return -1;
  }
  if (isGreaterThan(cardA, cardB)) {
    return 1;
  }
  return 0;
}

// sort by color then number
export const sortCards = (cards) => {
  cards.sort(compareByColor);
  cards.sort(compareByValue);
  return cards;
}

// draws a random card. we're not keeping track of what cards are actually in the deck
// A UNO deck consists of 108 cards, of which there are 76 Number cards, 24 Action cards and 8 Wild cards.
export const drawCard = () => {
  const rand = Math.random() * 27;
  if (rand < 19) {
    return chooseRandomNumberCard();
  }
  else if (rand < 25) {
    return chooseRandomActionCard();
  }
  else {
    return chooseRandomWildCard();
  }
}

const WildColorCard = {
  color: "wild",
  value: "Wild Color"
}

const WildDraw4Card = {
  color: "wild",
  value: "Wild Draw 4"
}

const chooseRandomNumberCard = () => {
  return {
    color: chooseRandomColor(),
    value: Math.floor(Math.random() * 10)
  };
}

const chooseRandomActionCard = () => {
  const rand = Math.floor(Math.random() * 3);
  let value = "";
  if (rand < 1)
    value = "Draw 2";
  else if (rand < 2)
    value = "Reverse";
  else
    value = "Skip";
  return {
    color: chooseRandomColor(),
    value: value
  };
}

const chooseRandomWildCard = () => {
  const rand = Math.floor(Math.random() * 2);
  if (rand < 1)
    return WildColorCard;
  else
    return WildDraw4Card;
}

const chooseRandomColor = () => {
  const rand = Math.random() * 4;
  if (rand < 1)
    return "red"; 
  else if (rand < 2)
    return "green"; 
  else if (rand < 3)
    return "blue"; 
  else return "yellow"; 
}
