import React from 'react'
import './informations.css'

function Informations() {
    return (
        <div className="informations">
            <h4>Comment jouer?</h4>
            <ul>
                <li>
                    Appuyez sur <b>Piocher</b> pour tirer 7 lettres au hasard, en piochant, vous passez votre tour
                </li>
                <li>
                    Le premier joueur doit obligatoirement poser le premier mot au centre, ce mot doit être au minimum composé de 2 lettres
                </li>
                <li>
                    Le deuxième joueur doit s'appuyer sur ce mot pour placer le sien et ainsi de suite
                </li>
                <li>
                    Le score est calculé automatiquement à la fin de chaque tour en additionnant la valeur de toutes les lettres des nouveaux mots formés (y compris celles déjà posées sur la grille)
                </li>
                <li>
                    Chaque case multiplicatrice ne sert qu'une fois
                </li>
                <li>
                    Si l’un des joueurs arrive à placer ses 7 lettres d’un seul coup, on dit qu’il a fait un <b>PERFECTO</b>. Ce coup rapporte 50 points bonus
                </li>
                <li>
                    La validité des mots est vérifiée <b>automatiquement</b> dans un dictionnaire
                </li>
                <li>
                    bleu clair: lettre compte double ,  bleu foncé: lettre compte triple
                </li>
                <li>
                    jaune: mot compte double, rouge: mot compte triple
                </li>
            </ul>
            <h4>Comment Gagner?</h4>
            <ul>
                <li>
                    Quand le sac est vide et qu’un des joueurs pose toutes ses lettres, la partie est terminée.
                    Le joueur possédant le plus de points gagne la partie.
                </li>
            </ul>
        </div>
    )
}

export default Informations
