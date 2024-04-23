<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$prices = $sdk->getLeads(isset($_GET['idLead']) ? $_GET['idLead'] : "");
echo json_encode($prices);