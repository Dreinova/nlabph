<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "dreinovcorp@gmail.com"; // Cambia esto al correo del destinatario
    $subject = "Correo de ejemplo"; // Cambia el asunto del correo

    // Template HTML
    $message = "
    <html>
    <head>
        <title>Correo de ejemplo</title>
        <link rel='preconnect' href='https://fonts.googleapis.com'>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
        <link href='https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap' rel='stylesheet'>
        <style>
        body{ font-family:'Roboto Mono';}
        </style>
    </head>
    <body>
        <img src='https://nlabph.com/cotizaciones/images/logo.svg' alt='Logo Garcia' width='200' height='100' style='display: block; margin: 0 auto;'>
        <h1>Hola,</h1>
        <p>Este es un ejemplo de correo electrónico en formato HTML.</p>
        <p>Aquí puedes encontrar tu cotización lista</p>
    </body>
    </html>
    ";

    // Cabeceras para el correo HTML
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: info@newlabphotography.com " . "\r\n"; // Cambia esto al correo del remitente

    // Envío del correo
    $result = mail($to, $subject, $message, $headers);

    if ($result) {
        echo "Correo enviado con éxito.";
    } else {
        echo "Error al enviar el correo.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Enviar Correo</title>
</head>
<body>
    <h2>Enviar Correo de Ejemplo</h2>
    <form method="post">
        <input type="submit" value="Enviar Correo">
    </form>
</body>
</html>