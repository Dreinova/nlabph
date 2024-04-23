<?php include 'includes/config.php'; ?>
<?php 
if(!isset($bodyClass)){
    if(isset($_GET["userwp"])){
        $_SESSION["user_logged"] = true;
    }else{
        if(!isset($_SESSION["user_logged"])){
            header('Location: https://admin.nlabph.com/wp-login.php');
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <base href="/cotizaciones/admin/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=isset($title) ? $title : "Admin - Cotizaciones"?></title>
    <link rel="manifest" href="manifest.webmanifest?v=<?=time();?>">
    <link rel="stylesheet" href="../css/styles.css">
</head>

<body class="admin <?=$bodyClass?>">
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then((registration) => {
                        console.log('Service Worker registrado con éxito:', registration);
                    })
                    .catch((error) => {
                        console.log('Error al registrar el Service Worker:', error);
                    });
            });
        }
    </script>
    <aside>
        <img src="../images/logo_cotizar.svg" alt="logo">
        <nav>
            <a href="/cotizaciones/admin/leads" class="uppercase <?= $_GET[" active"]=="0" ? "active" : ""
                ?>">SOLICITUDES</a>
            <a href="/cotizaciones/admin/listado-cotizaciones" class="uppercase <?= $_GET[" active"]=="1" ? "active"
                : "" ?>">COTIZACIONES</a>
            <a href="https://admin.nlabph.com/wp-admin/edit-tags.php?taxonomy=category&post_type=garcia-grupos"
                target="_blank" class="uppercase">CATEGORÍAS</a>
            <a href="https://admin.nlabph.com/wp-admin/edit.php?post_type=garcia-equipos" target="_blank"
                class="uppercase">ITEMS</a>
        </nav>
    </aside>
    <main>