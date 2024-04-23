<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$prices = $sdk->getGrupos(isset($_GET['idGroup']) ? $_GET['idGroup'] : "",isset($_GET['search']) ? $_GET['search'] : "");
echo json_encode($prices);