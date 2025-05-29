export const PUNTI_TABELLINA = 10;
export const PUNTI_DIVISIONE_LIVELLO_1 = 10;
export const PUNTI_DIVISIONE_LIVELLO_2_3 = 20;
export const PUNTI_MOLTIPLICAZIONE_SCOMPOSIZIONE = 15;

export const DEFAULT_PLAYER_NAME = "Giocatore";

export function CALCOLA_PUNTI_BONUS(elapsedTime) {
    if (elapsedTime < 8) return 5; // Adjusted bonus points
    if (elapsedTime < 15) return 3;
    if (elapsedTime < 25) return 1;
    return 0;
}
