-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Set 21, 2022 alle 21:44
-- Versione del server: 10.4.13-MariaDB
-- Versione PHP: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ppmdb`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `indovinello`
--

CREATE TABLE `indovinello` (
  `code` int(11) NOT NULL,
  `testo` text NOT NULL,
  `opera` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `indovinello`
--

INSERT INTO `indovinello` (`code`, `testo`, `opera`) VALUES
(1, 'Quale di questi quadri è stato dipinto in 3 versioni dall\'artista?', 15),
(2, 'Quale di questi quadri è stato dipindo nel 1889 ', 14),
(3, 'Quale di questi dipinti è stato ispirato dal bombardamento di Guernica?', 13),
(4, 'Quale di questi quadri ha avuto un libro ed un film ad esso dedicato?', 16),
(5, 'Quale dei seguenti quadri è esposto nell\'Österreichische Galerie Belvedere di Vienna?', 12),
(6, 'Quale dei seguenti quadri è stato ispirato da una forma di formaggio?', 11),
(7, 'Quale dei seguenti dipinti è stato rovinato e l\'autore, dopo averlo ridipinto, a cercato di nascondere l\'accaduto?', 17),
(8, 'Quale dei seguenti dipinti è stato rappresentato nella banconota da 100000 lire?', 18),
(9, 'Quale dei seguenti quadri è stato dipinto su una tavola di pioppo?', 1),
(10, 'Quale tra questi quadri fu \'distrutto\' appena dopo la sua vendita?', 19);

-- --------------------------------------------------------

--
-- Struttura della tabella `opera`
--

CREATE TABLE `opera` (
  `code` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `image_url` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `opera`
--

INSERT INTO `opera` (`code`, `name`, `description`, `image_url`) VALUES
(1, 'La Gioconda', 'La Gioconda, nota anche come Monna Lisa, è un dipinto a olio su tavola di legno di pioppo realizzato da Leonardo da Vinci (77×53 cm e 13 mm di spessore), databile al 1503-1514 circa e conservato nel Museo del Louvre di Parigi.\r\n\r\nOpera iconica ed enigmatica della pittura mondiale, si tratta sicuramente del ritratto più celebre della storia nonché di una delle opere d\'arte più note in assoluto. Il sorriso quasi impercettibile del soggetto, col suo alone di mistero, ha ispirato tantissime pagine di critica, letteratura, opere di immaginazione e persino studi psicoanalitici; sfuggente, ironica e sensuale, la Monna Lisa è stata di volta in volta amata e idolatrata, ma anche irrisa e vandalizzata.\r\n\r\nLa Gioconda viene ammirata ogni giorno da circa trentamila visitatori, ovvero l\'80% dei visitatori del Museo del Louvre in cui è esposta, tanto che nella grande sala in cui si trova, un cordone deve tenere a debita distanza le persone. Nella lunga storia del dipinto non sono infatti mancati i tentativi di vandalismo, nonché un furto rocambolesco, che ne hanno alimentato la popolarità.', 'images/gioconda.jpeg'),
(2, 'Deposizione di caravaggio', 'La Deposizione è un dipinto a olio su tela realizzato, tra il 1602 ed il 1604, dal pittore italiano Michelangelo Merisi detto Caravaggio e conservato presso la Pinacoteca vaticana.\r\n\r\nIl dipinto fu commissionato da Girolamo Vittrice per la cappella dedicata alla Pietà, di proprietà dello zio (Pietro Vittrice, morto il 26 marzo 1600), che si trova nella chiesa di Santa Maria in Vallicella a Roma, celebre sede dell\'Oratorio di san Filippo Neri.', 'images/opera2.jpg'),
(3, 'Quadro strano colorato', 'descrizione del quadro strano', 'images/opera3.jpg'),
(4, 'Le opere della misericordia', 'Iserire qui la descrizione delle opere della misericordia', 'images/opera4.jpg'),
(5, 'Deposizione Borghese', 'Inserire qui la descrizione della deposizione borghese di Raffaello', 'images/opera5.jpg'),
(6, 'Sposalizio della vergine', 'Inserire qui una descrizione dello sposalizio della vergine', 'images/opera6.jpg'),
(7, 'Il cristo', 'Inserire qui la descrizione del cristo', 'images/opera7.jpg'),
(8, 'La Madonna del cardellino', 'Inserire qui una descrizione della madonna del cardellino', 'images/opera8.jpg'),
(9, 'Venere di Botticelli', 'Inserire qui una descrizione della venere di botticelli', 'images/opera9.jpg'),
(10, 'David di Michelangelo', 'Il David è una scultura realizzata in marmo (altezza 520 cm incluso il basamento di 108 cm) da Michelangelo Buonarroti, databile tra il 1501 e l\'inizio del 1504 e conservata nella Galleria dell\'Accademia a Firenze.\r\n\r\nLargamente considerato un capolavoro della scultura mondiale, è uno degli emblemi del Rinascimento nonché simbolo di Firenze e dell\'Italia all\'estero. L\'opera, che ritrae l\'eroe biblico nel momento in cui si appresta ad affrontare Golia, originariamente fu collocata in Piazza della Signoria, come simbolo della Repubblica fiorentina vigile e vittoriosa contro i nemici.\r\n\r\nDa sempre considerato l\'ideale di bellezza maschile nell\'arte così come la Venere di Sandro Botticelli è considerata il canone di bellezza femminile, molti ritengono che il David sia l\'oggetto artistico più bello mai creato dall\'uomo.', 'images/opera10.jpg'),
(11, 'La persistenza della memoria', 'Opera di Salvador Dalì-La persistenza della memoria (in catalano La persistencia de la memòriea) è un dipinto a olio su tela (24×33 cm) del surrealista spagnolo Salvador Dalí, realizzato nel 1931 e conservato al Museum of Modern Art di New York.\r\n\r\nOpera surrealista per antonomasia, La persistenza della memoria raffigura una landa deserta dominata dalla presenza di alcuni orologi molli, dalla consistenza quasi fluida, simboli dell\'elasticità del tempo.', 'images/persistenza_della_memoria.jpg'),
(12, 'Il Bacio', 'Il bacio, realizzato nel biennio 1907-08, ha un formato perfettamente quadrato, di 180x180 cm. In pieno accordo con i canoni del liberty e con lo spirito fin de siècle, l\'opera presenta un intenso uso del colore oro, che si materializza nelle eleganti decorazioni applicate a foglia sulla tela; questa tecnica ricorda molto da vicino quella dei mosaici bizantini, che Klimt poté conoscere e apprezzare a Ravenna nel 1903.[3]\r\n\r\nDal punto di vista stilistico, il quadro si inscrive felicemente nel «periodo aureo» della produzione klimtiana, così definito per l\'intenso utilizzo del colore oro, il cui fulgore si riverbera su tutto lo sfondo della tela, eliminando l\'effetto di profondità spaziale che, pertanto, si esaurisce in una piatta bidimensionalità. Per quanto riguarda la luce, questa non proviene da una fonte esterna bensì è emanata dalla stessa coppia; analogamente, le tinte sono altrettanto calde e luminose, fatta eccezione per le cromie verdi del prato che esaltano per contrasto il «caldo» amore dei due giovani.[4]\r\n\r\nL\'eleganza dello stile e la sua aura mistico-erotica hanno reso Il bacio il manifesto dell\'arte secessionista viennese ed il maggior esponente del gusto della Belle Époque.[4][5]\r\n\r\nNote', 'images/il_bacio.jpg'),
(13, 'Guernica', 'Guernica è un dipinto di Pablo Picasso. L\'ispirazione per l\'opera, improvvisa e all\'ultimo minuto, arrivò solo dopo il bombardamento di Guernica (26 aprile 1937). Picasso compose il grande quadro in soli due mesi e lo fece esporre nel padiglione spagnolo dell\'esposizione universale di Parigi (maggio-novembre 1937). Guernica fece poi il giro del mondo, diventando molto acclamata, ma soprattutto servì a far conoscere la storia del conflitto fratricida che si stava consumando nel Paese iberico.\r\n\r\nGuernica viene generalmente considerato uno dei maggiori capolavori del pittore spagnolo Picasso', 'images/guernica.jpg'),
(14, 'La Notte Stellata', 'La Notte stellata (De sterrennacht) è un dipinto del pittore olandese Vincent van Gogh, realizzato nel 1889 e conservato al Museum of Modern Art di New York. Vera e propria icona della pittura occidentale, il dipinto raffigura un paesaggio notturno di Saint-Rémy-de-Provence, poco prima del sorgere del sole.', 'images/notte_stellata.jpg'),
(15, 'L\'Urlo', 'Lo spunto del quadro è prettamente autobiografico. È infatti lo stesso Munch a indicarci, in una pagina di diario, le circostanze che hanno portato alla genesi de L\'urlo:\r\n\r\n«Una sera camminavo lungo un viottolo in collina nei pressi di Kristiania - con due compagni. Era il periodo in cui la vita aveva ridotto a brandelli la mia anima. Il sole calava - si era immerso fiammeggiando sotto l\'orizzonte. Sembrava una spada infuocata di sangue che tagliava la volta celeste. Il cielo era di sangue - sezionato in strisce di fuoco - le pareti rocciose infondevano un blu profondo al fiordo - scolorandolo in azzurro freddo, giallo e rosso - Esplodeva il rosso sanguinante - lungo il sentiero e il corrimano - mentre i miei amici assumevano un pallore luminescente - ho avvertito un grande urlo ho udito, realmente, un grande urlo - i colori della natura - mandavano in pezzi le sue linee - le linee e i colori risuonavano vibrando - queste oscillazioni della vita non solo costringevano i miei occhi a oscillare ma imprimevano altrettante oscillazioni alle orecchie - perché io realmente ho udito quell\'urlo - e poi ho dipinto il quadro L\'urlo.»', 'images/l_urlo.jpg'),
(16, 'La Ragazza col turbante', 'La Ragazza col turbante, anche conosciuta come Ragazza con l\'orecchino di perla (\"Meisje met de parel\"), è un dipinto a olio su tela (44,5×39 cm) di Jan Vermeer, databile al 1665-1666 circa e conservato nella Mauritshuis dell\'Aia. Soprannominato talvolta la \"Monna Lisa olandese\"[2][3], è uno dei dipinti più noti dell\'artista, anche grazie a un romanzo e un film del 2003 di cui è stato oggetto[.', 'images/ragazza_turbante.jpg'),
(17, 'No.5 - Pollock', 'No. 5, 1948 is a painting by Jackson Pollock, an American painter known for his contributions to the abstract expressionist movement. It was sold on 22 May 2006 for $140 million, a new mark for highest ever price for a painting, not surpassed until April 2011.', 'images/n5_pollock.jpg'),
(18, 'Canestra di Frutta', 'La canestra di frutta (nota anche con il nome antico di fiscělla lat. diminutivo di fiscina e di físcus \'cestello\') è un dipinto a olio su tela di 31 cm di altezza e 47 di lunghezza realizzato tra il 1597 e il 1600 dal pittore italiano Caravaggio (1571-1610). È conservato nella Pinacoteca Ambrosiana di Milano.\r\n\r\nÈ considerato l\'incunabolo del genere della natura morta. L\'opera sintetizza diverse esperienze, quella tardo manierista interessata ai grandi apparati naturali e dall\'altro lato, nell\'assolutezza della figura che il cesto colmo determina e nell\'insolito punto di vista equatoriale, in cui il Merisi afferma un interesse per il soggetto inanimato non più periferico e complementare alla figura umana, ma centrale ed esauriente.', 'images/canestra_frutta.jpg'),
(19, 'Girl with Baloon', 'Girl with Balloon (o Balloon Girl o Girl and Balloon) è una serie di stencil graffiti, iniziata a Londra nel 2002 dallo street artist Banksy, che raffigura una ragazza con la mano tesa verso un palloncino rosso a forma di cuore portato via dal vento. L\'opera è in bianco e nero, ad eccezione della presenza rossa del palloncino che vola via.', 'images/girl_with_baloon.jpg'),
(20, 'Girasoli', 'I Girasoli, fu uno dei sette dipinti realizzati per esprimere una amicizia finita, però, tragicamente.\r\n\r\nVincent van Gogh, I Girasoli, 1889, olio su tela, cm 95 × 73. Amsterdam, Van Gogh Museum\r\n\r\nDESCRIZIONE. I GIRASOLI PER L’AMICO GAUGUIN\r\nIl dipinto appartiene ad una serie composta da 7 opere. Tutti i dipinti raffigurano un mazzo di girasoli all’interno di un vaso. Le opere furono realizzate per decorare la camera che Van Gogh aveva preparato, nella casa di Arles per il suo amico Gauguin. Sopra ad un piano è poggiato il vaso contenente I Girasoli. I fiori sono disposti in modo ordinato e formano un grande mazzo che riempie tutto il dipinto. Alcuni di essi possiedono ancora i petali, altri sono, invece, parzialmente sfioriti. Il vaso riporta, come fosse una dedica, il nome Vincent.', 'images/Girasoli_vanGogh.jpg');

-- --------------------------------------------------------

--
-- Struttura della tabella `settings`
--

CREATE TABLE `settings` (
  `numero_domande` int(11) NOT NULL,
  `numero_client` int(11) NOT NULL,
  `numero_carte` int(11) NOT NULL,
  `TBA` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `settings`
--

INSERT INTO `settings` (`numero_domande`, `numero_client`, `numero_carte`, `TBA`) VALUES
(5, 2, 5, 0),
(5, 2, 5, 0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `indovinello`
--
ALTER TABLE `indovinello`
  ADD PRIMARY KEY (`code`),
  ADD KEY `FK_operaIndovinello` (`opera`);

--
-- Indici per le tabelle `opera`
--
ALTER TABLE `opera`
  ADD PRIMARY KEY (`code`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `indovinello`
--
ALTER TABLE `indovinello`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT per la tabella `opera`
--
ALTER TABLE `opera`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `indovinello`
--
ALTER TABLE `indovinello`
  ADD CONSTRAINT `FK_operaIndovinello` FOREIGN KEY (`opera`) REFERENCES `opera` (`code`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
