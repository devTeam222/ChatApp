<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=chatapp;', 'root', '');
} catch (Exception $e) {
    // die('Une erreur a été trouvé : ' . $e->getMessage()); 
?>
    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./theme/style.css">
        <link rel="icon" href="./assets/icon.svg" type="image/svg+xml" media="(prefers-color-scheme:light)">
        <link rel="icon" href="./assets/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme:dark)">
        <title>ChatApp</title>
    </head>

    <body>
        <main class="container disconnected">
            <h1 class="logo">
                <span class="icon">
                    <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                        <path fill="#dc143c" stroke="#dc143c" d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7" />
                    </svg>
                </span>
                <span>ChatApp</span>
            </h1>
            <section>
                <h2>Salut à tous !</h2>
                <p>
                <ul>
                    <li>🛠️✨Nous espérons que vous passez une excellente journée ! 😊 Nous tenions juste à vous informer que notre service subit actuellement une petite mise à jour, ce qui signifie qu'il sera temporairement indisponible. Pas d'inquiétude, nos experts travaillent dur pour le remettre en ligne aussi rapidement que possible !</li> 
                    <li>Nous vous prions de bien vouloir nous excuser pour ce petit contretemps et vous remercions pour votre patience et votre compréhension. En attendant, n'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.</li>
                    <li>Nous avons hâte de vous retrouver très bientôt et de vous offrir une expérience encore meilleure !</li>
                    <li>À très bientôt !</li>
                </ul>
                L'équipe ChatApp 😊✨
                </p>
            </section>
        </main>
    </body>

    </html>
<?php
    exit();
}
?>