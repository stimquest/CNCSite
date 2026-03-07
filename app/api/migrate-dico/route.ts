import { NextResponse } from 'next/server';
import { getServerWriteClient } from '../../../lib/sanity.server';

const DICO_WORDS = [
    {
        id: "abattre",
        word: "Abattre",
        pronunciation: "A-bat-tre",
        childQuote: "J'ai abattu juste avant la bouée pour prendre de la vitesse !",
        parentFear: "Il a frappé quelqu'un ? Il s'est battu sur l'eau ?",
        reality: "Abattre, c'est tourner le bateau pour que le nez s'éloigne du vent. On prend alors plus de vitesse car la voile se gonfle davantage. C'est un peu comme descendre une pente à vélo : on lâche les freins et ça file.",
        quizAnswers: [
            "Lutter avec un autre bateau sur l'eau.",
            "Tourner le nez du bateau pour l'éloigner du vent et accélérer.",
            "Crier très fort pour faire peur aux mouettes."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "affaler",
        word: "Affaler",
        pronunciation: "A-fa-lé",
        childQuote: "On a affalé la grand-voile en vitesse avant l'orage !",
        parentFear: "Tout s'est écroulé ? Le mât est tombé ?",
        reality: "Affaler, c'est simplement descendre la voile le long du mât. C'est le contraire de hisser. C'est le geste de fin de journée ou de prudence quand le ciel devient menaçant. Rien ne s'effondre, on plie bagage proprement.",
        quizAnswers: [
            "Descendre la voile le long du mât pour s'arrêter ou ranger.",
            "Tomber dans l'eau parce qu'on a glissé.",
            "S'endormir sur le bateau après une longue journée."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "barre",
        word: "La Barre",
        pronunciation: "Barre",
        childQuote: "J'ai poussé la barre à fond pour éviter la bouée !",
        parentFear: "Une barre de fer ? Il s'est fait mal ?",
        reality: "C'est le manche qui commande le gouvernail. On la pousse ou on la tire pour tourner. Petite subtilité : on pousse la barre à gauche pour aller à droite, et inversement. C'est le volant du bateau.",
        quizAnswers: [
            "Une barre de céréales au chocolat pour le goûter.",
            "Le manche qui permet de diriger le gouvernail.",
            "La poutre en bois qui tient le haut du mât."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "bome",
        word: "La Bôme",
        pronunciation: "Baume",
        childQuote: "Fais gaffe à la bôme !",
        parentFear: "C'est une explosion ?",
        reality: "C'est la barre horizontale en bas de la voile. Elle est très utile, mais elle adore surprendre les têtes distrait lors des virages. D'où le nom (presque) : \"Bôme !\" c'est le bruit qu'elle fait si on ne baisse pas la tête.",
        quizAnswers: [
            "La barre en métal sous la voile qu'il faut éviter avec la tête.",
            "Une crème apaisante après un coup de soleil.",
            "Un bruit fort que fait le moniteur de voile."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "border",
        word: "Border",
        pronunciation: "Bor-dé",
        childQuote: "J'ai bordé comme un fou pour doubler les copains.",
        parentFear: "Il a fait le lit de qui ?",
        reality: "C'est l'inverse de choquer. On tire sur la corde pour tendre la voile et capter le maximum de vent. C'est l'accélérateur. On \"borde\" pour transformer le vent en vitesse.",
        quizAnswers: [
            "Faire le lit dans le dortoir du club nautique.",
            "Mettre les planches au bord de la plage.",
            "Tirer sur la corde pour tendre la voile et accélérer."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "bout",
        word: "Bout",
        pronunciation: "Boute",
        childQuote: "Donne-moi le bout qui traîne là.",
        parentFear: "Un bout de quoi ? De plastique ? De bois ?",
        reality: "Sur un bateau, le mot \"corde\" est interdit (ça porte malheur, sauf pour la cloche !). On appelle ça un \"bout\" (prononcé boute). Qu'il soit gros, petit, bleu ou rouge, c'est un bout.",
        quizAnswers: [
            "C'est la fin de la séance de voile.",
            "Un petit morceau du gâteau du goûter.",
            "Le nom marin qu'on donne à toutes les cordes."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "bout-au-vent",
        word: "Être Bout au vent",
        pronunciation: "Boute aux vents",
        childQuote: "J'étais bout au vent, je ne pouvais plus avancer.",
        parentFear: "Il était perdu en mer sans moteur ?",
        reality: "Le bateau a le nez pile face au vent. Comme la voile ne peut pas se gonfler dans cette position, le bateau s'arrête et recule. C'est un peu comme essayer de monter une côte en vélo avec la chaîne qui a déraillé. Il faut juste donner un coup de gouvernail.",
        quizAnswers: [
            "Aller très vite en ayant le vent dans le dos.",
            "Mettre le nez du bateau face au vent pour l'arrêter.",
            "Avoir trop mangé et se sentir ballonné."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "choquer",
        word: "Choquer (la voile)",
        pronunciation: "Cho-qué",
        childQuote: "Il y avait trop de vent, j'ai dû choquer en grand !",
        parentFear: "Il est traumatisé ? Quelqu'un lui a fait peur ?",
        reality: "Pas d'émotion ici ! \"Choquer\", c'est simplement relâcher la corde (l'écoute) pour donner de la liberté à la voile. C'est le frein à main de la voile : on relâche la pression pour que le bateau ralentisse ou arrête de pencher.",
        quizAnswers: [
            "Traumatiser la voile en lui criant dessus.",
            "Relâcher la corde pour ralentir et arrêter de pencher.",
            "Faire un accident de bateau avec les copains."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "derive",
        word: "La Dérive",
        pronunciation: "La-dé-rive",
        childQuote: "J'ai oublié de descendre la dérive, on avançait en crabe !",
        parentFear: "Le bateau est cassé ? Il manque une pièce ?",
        reality: "C'est une planche amovible sous le bateau. Sans elle, le vent pousse le bateau sur le côté. La descendre, c'est comme mettre des pneus neige : ça permet d'accrocher l'eau et d'aller là où on veut, surtout pour remonter au vent.",
        quizAnswers: [
            "Quand le marin perd le contrôle et pleure en silence.",
            "Une planche sous le bateau qui l'empêche de glisser sur le côté.",
            "Le repas qu'on jette aux oiseaux de mer."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "dessalage",
        word: "Le Dessalage",
        pronunciation: "Un dé-sa-lage",
        childQuote: "J'ai dessalé trois fois aujourd'hui, c'était trop cool !",
        parentFear: "Mon enfant a coulé, il a eu froid, c'est une catastrophe.",
        reality: "Le bateau a fait une sieste sur le côté. C'est l'exercice préféré des enfants : on tombe à l'eau, on grimpe sur la dérive, et on redresse le bateau comme un pirate. Aucun danger, juste beaucoup d'eau dans les bottillons.",
        quizAnswers: [
            "Le bateau a fait une sieste sur le côté, on le redresse en montant sur la dérive.",
            "Enlever le sel du bateau avec une grande douche douce.",
            "Cuisiner un menu sans sel à la cantine du club nautique."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "echouer",
        word: "Échouer",
        pronunciation: "É-chou-er",
        childQuote: "On a échoué juste devant le club, c'était drôle !",
        parentFear: "Ils ont raté leur manœuvre ? C'est un échec ?",
        reality: "Échouer, c'est quand le bateau touche le fond et s'arrête. À Coutainville, avec les grandes marées, c'est presque un sport local. On attend que l'eau remonte, ou on pousse. Rien de dramatique, juste un bateau qui fait une pause forcée.",
        quizAnswers: [
            "Rater complètement sa séance de voile.",
            "Quand le bateau touche le fond et s'arrête.",
            "Perdre une course contre les copains."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "ecoute",
        word: "L'Écoute",
        pronunciation: "É-coute",
        childQuote: "Lâche l'écoute !",
        parentFear: "Pourquoi il crie ? Personne ne l'écoute ?",
        reality: "L'écoute, c'est le nom de la corde qui tient la voile. On ne dit jamais \"la corde de la voile\". On a l'écoute de Grand-Voile et l'écoute de Foc. C'est la commande de gaz du bateau.",
        quizAnswers: [
            "Le coquillage qu'on met contre son oreille.",
            "La corde qui règle la voile, c'est l'accélérateur !",
            "Quand on obéit sagement au moniteur de voile."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "empanner",
        word: "Empanner",
        pronunciation: "Em-pan-ner",
        childQuote: "On a fait un empannage face au club !",
        parentFear: "Le bateau est tombé en panne devant tout le monde ?",
        reality: "C'est un virage où l'arrière du bateau passe par le vent. C'est souvent là que la bôme (la barre en métal sous la voile) change de côté assez vite. Un virage dynamique qui demande un peu de coordination pour ne pas se cogner la tête.",
        quizAnswers: [
            "Un virage où l'arrière du bateau passe par le vent.",
            "Tirer le bateau avec une dépanneuse nautique.",
            "Une technique pour cacher ses bonbons sous le gilet de sauvetage."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "estran",
        word: "L'Estran",
        pronunciation: "L'es-tran",
        childQuote: "On a exploré l'estran avec le moniteur.",
        parentFear: "C'est une île lointaine ?",
        reality: "C'est l'espace magique entre la marée haute et la marée basse. À Coutainville, c'est immense ! C'est là qu'on trouve les crevettes, les crabes et que les chars à voile s'éclatent.",
        quizAnswers: [
            "Le restaurant rapide du club nautique.",
            "L'espace de sable entre la marée haute et basse.",
            "Une bête mystérieuse qu'on peut croiser sous l'eau."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "foc",
        word: "Le Foc",
        pronunciation: "Foque",
        childQuote: "On a bien réglé le foc aujourd'hui.",
        parentFear: "C'est un rapport avec l'animal (le phoque) ?",
        reality: "Rien à voir avec nos amis de la Pointe d'Agon ! Le foc, c'est la petite voile triangulaire à l'avant du bateau. Elle aide à diriger et donne un coup de boost à la grande voile.",
        quizAnswers: [
            "Un petit animal marin trop mignon.",
            "Le chapeau rond emblématique du marin breton.",
            "La petite voile à l'avant du bateau qui aide à avancer."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "gite",
        word: "La Gîte",
        pronunciation: "La Jite",
        childQuote: "On avait une gîte de malade !",
        parentFear: "Ils ont loué une maison de vacances en pleine mer ?",
        reality: "La gîte, c'est l'inclinaison du bateau sous la poussée du vent. Plus ça souffle, plus le bateau penche. C'est impressionnant vu du bord, mais c'est normal. Et c'est justement pour la réduire qu'on fait du rappel.",
        quizAnswers: [
            "L'inclinaison du bateau sur le côté avec le vent.",
            "Une petite maison pour dormir après la voile.",
            "La boîte où on range les gilets de sauvetage."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "greer",
        word: "Gréer / Dégréer",
        pronunciation: "Gré-é",
        childQuote: "On a mis 1h à gréer à cause du vent.",
        parentFear: "Ils ont fait de la mécanique ?",
        reality: "Gréer, c'est préparer le bateau (monter le mât, mettre les voiles, attacher les bouts). Dégréer, c'est tout ranger à la fin. C'est la partie \"puzzle\" de la voile où on apprend la patience et la rigueur.",
        quizAnswers: [
            "S'appliquer de la crème solaire un peu partout.",
            "Monter et préparer le bateau avec toutes les voiles et cordes.",
            "Faire chauffer le moteur avant de partir."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "larguer",
        word: "Larguer",
        pronunciation: "Lar-ghé",
        childQuote: "J'ai largué les amarres d'un coup !",
        parentFear: "Il a quitté quelqu'un ? À son âge ?",
        reality: "Larguer, c'est lâcher un cordage rapidement, souvent pour partir du ponton ou libérer une voile. C'est le geste du départ, pas de la rupture. On largue les amarres et on s'en va naviguer.",
        quizAnswers: [
            "Lâcher un cordage rapidement pour partir ou libérer une voile.",
            "Se séparer de ses amis au milieu de la mer.",
            "Jeter son sac à dos dans l'eau par accident."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "lofer",
        word: "Lofer",
        pronunciation: "Lo-fé",
        childQuote: "J'ai trop lofé et je me suis retrouvé bloqué !",
        parentFear: "Il a loupé quelque chose ? Il s'est trompé de chemin ?",
        reality: "C'est le contraire d'abattre. Lofer, c'est tourner le nez du bateau vers le vent. Un peu trop, et on finit \"bout au vent\", c'est-à-dire à l'arrêt complet. C'est comme monter une côte de plus en plus raide : à un moment, on cale.",
        quizAnswers: [
            "Oublier un équipement important sur la plage.",
            "Se balancer sur la corde pour s'amuser.",
            "Tourner le nez du bateau vers le vent pour freiner ou s'arrêter."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "louvoyer",
        word: "Louvoyer",
        pronunciation: "Lou-voi-yer",
        childQuote: "On a dû louvoyer pour rentrer au club.",
        parentFear: "Ils ont fait des détours parce qu'ils étaient perdus ?",
        reality: "Comme un voilier ne peut pas avancer face au vent, il doit faire des zig-zags pour remonter. C'est l'art de transformer un obstacle (le vent de face) en chemin de randonnée.",
        quizAnswers: [
            "Crier très fort comme un loup pour avancer.",
            "Payer la location du bateau de voile.",
            "Faire des zig-zags pour remonter contre le vent."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "mouiller",
        word: "Mouiller",
        pronunciation: "Mou-yé",
        childQuote: "On a mouillé dans la baie pour pique-niquer.",
        parentFear: "Ils étaient trempés et ils ont mangé quand même ?",
        reality: "Mouiller, c'est jeter l'ancre pour s'arrêter quelque part. On \"mouille\" l'ancre dans l'eau, tout simplement. C'est le parking du bateau, version maritime.",
        quizAnswers: [
            "Prendre une douche sur le pont du bateau.",
            "Jeter l'ancre pour s'arrêter et stationner.",
            "Arroser les voiles pour les nettoyer."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "girouette",
        word: "Les Penons",
        pronunciation: "Peu-non",
        childQuote: "Mes penons étaient bien horizontaux tout le temps.",
        parentFear: "Ses quoi ? Il a un problème de santé ?",
        reality: "Les penons sont des petits fils de laine collés on voit sur la voile. S'ils flottent bien à plat, c'est que la voile est parfaitement réglée. C'est l'indicateur de performance du petit marin.",
        quizAnswers: [
            "Des petits fils de laine sur la voile pour voir si elle est bien réglée.",
            "Une maladie des os liée au manque de calcium.",
            "Les petites pièces qu'on donne au moniteur à la fin."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "petole",
        word: "La Pétole",
        pronunciation: "Pé-tole",
        childQuote: "C'était la pétole totale, on n'a pas bougé.",
        parentFear: "C'est une insulte ?",
        reality: "C'est le cauchemar du marin (et du moniteur) : l'absence totale de vent. La mer ressemble à un miroir, les voiles pendent lamentablement, et on finit souvent par rentrer à la rame ou remorqué par le bateau de sécu.",
        quizAnswers: [
            "Le fait d'oublier sa casquette à terre.",
            "Quand il ne fait pas de vent du tout et qu'on n'avance plus.",
            "Quand on marche dans de la boue qui pue."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "planer",
        word: "Planer",
        pronunciation: "Pla-né",
        childQuote: "On a plané pendant hyper longtemps, c'était ouf !",
        parentFear: "Il plane, mon fils ? Il faut s'inquiéter ?",
        reality: "Quand le bateau va suffisamment vite, il arrête de creuser l'eau et se met à glisser à la surface, comme un galet qu'on fait ricocher. C'est la sensation la plus grisante : tout accélère, le bruit change, et le plaisir est garanti.",
        quizAnswers: [
            "Glisser sur l'eau à toute vitesse comme un galet.",
            "Rêvasser en regardant les mouettes passer.",
            "S'envoler avec le bateau au-dessus des vagues."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "rappel",
        word: "Être au Rappel",
        pronunciation: "Rap-pel",
        childQuote: "J'ai passé toute la séance au rappel, j'ai mal aux abdos !",
        parentFear: "Il a été puni ? Il a dû rester au bord ?",
        reality: "Faire du rappel, c'est se pencher le plus possible en dehors du bateau (les fesses dans le vide) pour faire contrepoids. C'est le sport de haut niveau de la voile : on utilise son propre corps pour empêcher le bateau de trop pencher.",
        quizAnswers: [
            "Se pencher avec les fesses en dehors du bateau pour faire contrepoids.",
            "La cloche qui sonne le déjeuner.",
            "Oublier tout ce qu'on vient d'apprendre."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "ris",
        word: "Le Ris",
        pronunciation: "Ri",
        childQuote: "On a pris un ris parce que ça envoyait trop !",
        parentFear: "Ils ont rigolé au lieu de naviguer ?",
        reality: "Prendre un ris, c'est replier une partie de la voile pour en réduire la surface quand le vent devient trop fort. C'est le mode \"je gère\" du marin : on garde le contrôle sans rentrer au port. Comme passer en seconde dans une descente au lieu de rester en quatrième.",
        quizAnswers: [
            "Faire une blague très amusante pendant le cours.",
            "Replier une partie de la voile quand le vent est trop fort.",
            "Un repas délicieux préparé à base de céréales."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "risee",
        word: "La Risée",
        pronunciation: "Ri-zée",
        childQuote: "On s'est pris une grosse risée juste avant la bouée.",
        parentFear: "Tout le monde s'est moqué de lui ?",
        reality: "Une risée, c'est une accélération soudaine et locale du vent. On la voit arriver car elle fait des petites taches sombres et des frissons sur l'eau. Pour le marin, c'est comme un bonus d'accélération dans un jeu vidéo.",
        quizAnswers: [
            "Une petite rafale de vent qui fait accélérer le bateau.",
            "Un moment de grosse blague collective.",
            "Du riz qu'on jette sur le moniteur quand il gagne."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "safran",
        word: "Le Safran",
        pronunciation: "Sa-fran",
        childQuote: "J'ai remonté le safran avant d'arriver sur le sable.",
        parentFear: "Il cuisine de la paëlla sur le bateau ?",
        reality: "C'est la partie de la porte (le gouvernail) qui trempe dans l'eau pour diriger le bateau. On le remonte à la fin pour ne pas qu'il gratte le sable comme une pelle.",
        quizAnswers: [
            "La lame sous l'eau attachée au gouvernail pour tourner.",
            "L'épice qu'on met dans les plats espagnols.",
            "La corde jaune qui sauve les marins tombés à l'eau."
        ],
        correctAnswerIdx: 0
    },
    {
        id: "spi",
        word: "Le Spi",
        pronunciation: "Spi",
        childQuote: "On a envoyé le spi, ça envoyait du lourd !",
        parentFear: "Un espion ? Sur le bateau des enfants ?",
        reality: "Le spi (spinnaker), c'est cette grande voile colorée en forme de ballon. On l'envoie quand le vent vient de l'arrière. C'est le turbo du voilier, et c'est souvent la voile préférée des enfants parce qu'elle est énorme et bariolée.",
        quizAnswers: [
            "Un gadget secret pour surveiller les autres clubs.",
            "Une grande voile colorée pour aller vite par vent arrière.",
            "Un petit gâteau sec qu'on mange au goûter."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "trapeze",
        word: "Le Trapèze",
        pronunciation: "Tra-pèze",
        childQuote: "J'ai fait du trapèze aujourd'hui, c'était incroyable !",
        parentFear: "Ils font du cirque au club de voile maintenant ?",
        reality: "Sur certains bateaux, un câble permet au marin de se suspendre à l'extérieur avec un harnais pour faire contrepoids. On se tient debout sur le bord, le corps au-dessus de l'eau. C'est spectaculaire et très amusant !",
        quizAnswers: [
            "Une figure acrobatique de cirque faite sur le mât.",
            "Se tenir suspendu à l'extérieur du bateau pour faire contrepoids.",
            "Un filet de pêche triangulaire pour attraper des crevettes."
        ],
        correctAnswerIdx: 1
    },
    {
        id: "vent-arriere",
        word: "Le Vent Arrière",
        pronunciation: "Vents ar-rière",
        childQuote: "Le retour était facile, on était plein vent arrière.",
        parentFear: "Le vent les poussait vers le large ?",
        reality: "C'est l'allure la plus relax (en apparence). Le vent vient de derrière et pousse le bateau comme un parachute. C'est confortable car on ne sent plus le vent sur son visage, mais attention à la bôme qui peut changer de côté sans prévenir !",
        quizAnswers: [
            "C'est quand on mange des flageolets à la cantine.",
            "Il faut ramer parce qu'il n'y a plus de vent.",
            "Avoir le vent dans le dos, la voile gonflée en avant."
        ],
        correctAnswerIdx: 2
    },
    {
        id: "virement",
        word: "Le Virement de bord",
        pronunciation: "Vi-re-ment",
        childQuote: "On a enchaîné les virements dans le chenal.",
        parentFear: "Ils ont tourné en rond parce qu'ils étaient perdus ?",
        reality: "C'est le cousin \"sage\" de l'empannage. C'est un virage où le nez du bateau passe face au vent. C'est plus lent et moins impressionnant que l'empannage, mais c'est la base pour remonter vers la plage quand le vent vient de la mer.",
        quizAnswers: [
            "Envoyer de l'argent de poche par la banque.",
            "La punition classique d'un moniteur de voile.",
            "Un virage où le nez du bateau passe par le vent."
        ],
        correctAnswerIdx: 2
    }
];

export async function GET(request: Request) {
    let successCount = 0;
    try {
        console.log('Starting migration of Dico words...');
        const client = getServerWriteClient();

        for (const word of DICO_WORDS) {
            const document = {
                _type: 'dicoWord',
                word: word.word,
                slug: { _type: 'slug', current: word.id },
                pronunciation: word.pronunciation,
                childQuote: word.childQuote,
                parentFear: word.parentFear,
                reality: word.reality,
                quizAnswers: word.quizAnswers,
                correctAnswerIdx: word.correctAnswerIdx,
            };

            await client.create(document);
            successCount++;
        }

        return NextResponse.json({ success: true, count: successCount, message: 'Migrated ' + successCount + ' words.' });
    } catch (e: any) {
        console.error('Migration failed:', e);
        return NextResponse.json({ success: false, count: successCount, error: e.message }, { status: 500 });
    }
}
