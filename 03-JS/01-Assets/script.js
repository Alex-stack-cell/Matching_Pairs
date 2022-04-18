"use strict";
// Initialisation des variables
const playBtn = document.querySelector("#play");
const section = document.querySelector("section");
const TOTAL_CARDS = 20;

/**
 * Perfection possible
 * 1) Réduire le nombre de variable
 * 2) Rendre le code plus DRY
 */
// Paquet de cartes à jouer
const CARDS = [
  { alt: "spiderman", src: "/01-Assets/img/batman.JPG" },
  { alt: "punisher", src: "/01-Assets/img/greenArrow.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/captainAmerica.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/thor.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/spidey.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/ironman.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/wolverine.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/greenLantern.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/hulk.JPG" },
  { alt: "spiderman", src: "/01-Assets/img/elstacMan.JPG" },
];

// Chaque paire est caractérisé par un identifiant unique
// et chaque carte est caractérisé par un identifiant unique
// Les tableaux suivant permmettent d'enregistrer les identifiants [1-10] unique des paires
// Ceux-ci sont générés de manière aléatoires.
// Après chaque parties les cartes aisni que les paires de cartes se verront assigner des id différents.
// Les deux tableux doivent coexister afin de garantir la parité
// ainsi que des positions différentes pour une même paire
// (e.g. évier que les paires se situent les unes à côté des autres)
let IdCard_deck_one = [];
let IdCard_deck_two = [];

// Identifiant de la paire de cartes associé à la carte sélectionnée par le joueur
let id_peer_one = null;
let id_peer_two = null;

// État de visibilité des cartes après sélection
let picture_one_visibility_status = null;
let picture_two_visibility_status = null;

// Style de la carte
let card_one_style = null;
let card_two_style = null;

// Identifiant unique de la carte
let id_card_one = null;
let id_card_two = null;

// Compteur permettant de distinguer la première carte sélectionnée de la seconde carte
let click_counter = 0;

// Score du joueur dépendant du nombre de clique et au nombre de carte
let user_score = TOTAL_CARDS * 2;
let revealed_card = [];
let win = false;

const play = () => {
  start();
};

/**
 * @summary Fonction permettant d'initialiser le jeu. Si une partie a été précédemment lancé,
 * alors les cartes sont régénérés et remélangées.
 *
 * @param : Rien
 * @return : Affichage du jeu
 * @author A.Gavriilidis
 */
const start = () => {
  playBtn.textContent = "Recommencer";

  // Affichage des cartes
  // Si une nouvelle partie est amorcé, on relance de nouvelles cartes
  if (section.hasChildNodes()) {
    let child = section.lastElementChild;
    while (child) {
      section.removeChild(child);
      child = section.lastElementChild;
    }
    IdCard_deck_one.length = 0;
    IdCard_deck_two.length = 0;
  }
  revealed_card = [];

  IdCard_deck_one = generateRandomIdsForFirstDeck();
  IdCard_deck_two = [...IdCard_deck_one];

  IdCard_deck_two = generateRandomIdsForSecondDeck(IdCard_deck_two);

  for (let i = 0; i < TOTAL_CARDS / 2; i++) {
    // création des conteneurs "card" et balises html images
    const card_first = document.createElement("DIV");
    const card_second = document.createElement("DIV");

    const img_peer_one = document.createElement("IMG");
    const img_peer_two = document.createElement("IMG");

    // stylisation des conteneurs
    createCards(card_first, card_second);

    let rand_index_first_deck = IdCard_deck_one[i];
    let rand_index_second_deck = IdCard_deck_two[i];

    // Définition des attributs images
    img_peer_one.src = CARDS[rand_index_first_deck - 1].src;
    img_peer_one.alt = CARDS[rand_index_first_deck - 1].alt;

    img_peer_two.src = CARDS[rand_index_second_deck - 1].src;
    img_peer_two.alt = CARDS[rand_index_second_deck - 1].alt;

    card_first.setAttribute("class", "card-" + rand_index_first_deck);
    card_first.setAttribute("id", i + 1); // identifiant unique d'une carte, afin d'afficher un message à l'utilisateur si il sélectionne la même carte
    // card_first.classList.add(" cards_style");
    card_first.addEventListener("click", selectCard);

    img_peer_one.classList.add("hidden"); // cache la carte en début de jeu
    card_first.appendChild(img_peer_one);

    card_second.setAttribute("class", "card-" + rand_index_second_deck);
    card_second.addEventListener("click", selectCard);
    card_second.setAttribute("id", Math.ceil(Math.random() * 100));

    img_peer_two.classList.add("hidden"); // cache la carte en début de jeu
    card_second.appendChild(img_peer_two);

    section.appendChild(card_first);
    section.appendChild(card_second);
  }
};

/**
 * @summary Afin de garantir la présence d'une paritée entre les cartes,
 * et également assurer le caractère aléatoire du jeu,
 * cette fonction génère un nombre aléatoire. Par exemple on aura (maximum et minimum de fois)
 * deux occurences pour le chiffre 10,
 * deux occurences pour le chiffre 2,
 * etc.
 *
 * @params : rien
 * @return : un tableau de nombres aléatoire
 * @author A.Gavriilidis
 */
playBtn.addEventListener("click", play);

const generateRandomIdsForFirstDeck = () => {
  const min = 0;
  const max = TOTAL_CARDS / 2;
  const first_set = [];
  let difference = max - min;
  let count = 0;

  while (count < 10) {
    let rand = Math.random();
    rand = Math.floor(rand * difference) + 1;

    if (!first_set.includes(rand)) {
      first_set.push(rand);
      CARDS[count].id = rand;
      count += 1;
    }
  }
  return first_set;
};
/**
 * @summary : Génère un id aléatoire [1-10] pour une carte à partir d'un set d'id existant.
 * L'objectif à terme est de produire dans le programme principale
 * deux sets d'id contenant les mêmes identifiant mais en des index différents.
 * Cette fonction combiné avec generateRandomCards garantit la distribution aléatoire de carte
 * formant une paire dans le jeu.
 *
 * @param first_deck : Un tableau de integer, contenant une partie du jeu de carte
 * @returns first_deck, jeu de carte mélangé
 * @author A.Gavriilidis
 */
const generateRandomIdsForSecondDeck = (first_deck = []) => {
  const min = 0;
  const max = TOTAL_CARDS / 2 - 1;
  let difference = max - min;
  let temp = 0;

  for (let index = 0; index < max; index++) {
    let rand = Math.random();
    rand = Math.floor(rand * difference) + 1;

    temp = first_deck[index];
    first_deck[index] = first_deck[rand];
    first_deck[rand] = temp;
  }
  return first_deck;
};

/**
 * @summary Affichage des cartes sélectionnés par l'utilisateur.
 * Si les cartes forment une paire alors les cartes resteront affichées
 * Sinon elles sont à nouveau cachées 1/2 sec. après avoir cliqué dessus.
 *
 * @param : rien
 * @retun : rien
 * @author A.Gavriilidis
 */
function selectCard() {
  let class_identifier = this.className; // identifiant de la paire de carte
  let id_identifier = parseInt(this.id); // identifiant unique de la carte

  class_identifier = parseInt(class_identifier.substr(5, 2));

  if (click_counter % 2 == 0) {
    id_peer_one = class_identifier;
    id_card_one = id_identifier;
    id_peer_two = null;
    id_card_two = null;
    picture_two_visibility_status = null;
    picture_one_visibility_status = this.childNodes[0];
    picture_one_visibility_status.style.visibility = "visible";
    card_one_style = this;
    card_one_style.style.border = "3px blue solid";
  } else {
    id_peer_two = class_identifier;
    id_card_two = id_identifier;
    picture_two_visibility_status = this.childNodes[0];
    picture_two_visibility_status.style.visibility = "visible";
    card_two_style = this;
    card_two_style.style.border = "3px blue solid";
  }

  if (id_peer_one !== null && id_peer_two !== null) {
    compareCards(id_peer_one, id_peer_two, id_card_one, id_card_two);
  }
  if (playerHasWin()) {
    alert(`Bravo ! Vous avez gagné 🎉🥳.
    Votre score est de ${(user_score / (TOTAL_CARDS * 2)) * 100} %`);
    start();
  }
  click_counter += 1;
}

function compareCards(card_one, card_two, id_card_one, id_card_two) {
  card_one = id_peer_one;
  card_two = id_peer_two;

  if (id_card_one === id_card_two) {
    alert("Veuillez choisir deux cartes différentes svp.");
  }
  if (id_peer_one === id_peer_two && id_card_one !== id_card_two) {
    picture_two_visibility_status.style.visibility = "visible";
    card_one_style.style.border = "3px green solid";

    picture_two_visibility_status.style.visibility = "visible";
    card_two_style.style.border = "3px green solid";
    revealed_card.push(1);
  } else {
    if (picture_two_visibility_status !== null) {
      card_one_style.style.border = "3px red solid";
      card_two_style.style.border = "3px red solid";
      user_score -= 1;

      // cache les cartes après 1/2 seconde
      setTimeout(() => {
        picture_one_visibility_status.style.visibility = "hidden";
        picture_two_visibility_status.style.visibility = "hidden";
        card_one_style.style.border = "3px black solid";
        card_two_style.style.border = "3px black solid";
      }, 500);
    }
  }
}

const createCards = (card_first, card_second) => {
  card_first.style.width = "100px";
  card_first.style.height = "150px";
  card_first.style.border = "3px black solid";
  card_first.style.backgroundColor = "#1488cc";
  card_first.style.boxShadow = "1px 1px 2rem rgba(0, 0, 0, 0.3)";
  card_first.style.borderRadius = "10px";

  card_second.style.width = "100px";
  card_second.style.height = "150px";
  card_second.style.border = "3px black solid";
  card_second.style.backgroundColor = "#999";
  card_second.style.boxShadow = "1px 1px 2rem rgba(0, 0, 0, 0.3)";
  card_second.style.borderRadius = "10px";
};

const playerHasWin = () => {
  if (revealed_card.length === 10) {
    win = true;
  } else {
    win = false;
  }
  return win;
};

console.log("What are you doing here ?");
