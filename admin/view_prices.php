<?php
$bodyClass = "allCotizacion";
$title = "Cotizacion #" . $_GET["cotizacionId"];
include 'includes/head.php'; ?>
<?php
    $price = $sdk->getPrice($_GET["cotizacionId"]);
    $palabras = $sdk->getPalabras($price->acf->idioma_g);
    $cargo_del_contacto = $price->acf->cargo_del_contacto;
    $dias_standby = $price->acf->dias_standby;
    $dop = $price->acf->dop;
    $email = $price->acf->email;
    $equipos = $price->acf->equipos;
    $estado = $price->acf->estado;
    $estado_cotizacion = $price->acf->estado_cotizacion;
    $fechas_de_rodaje = $price->acf->fechas_de_rodaje;
    $fechas_equipos = $price->acf->fechas_equipos;
    $formas_de_pago = $price->acf->formas_de_pago;
    $idioma = $price->acf->idioma_g;
    $iva = $price->acf->iva;
    $moneda = $price->acf->moneda;
    $nombre = $price->acf->nombre;
    $productor = $price->acf->productor;
    $project = $price->acf->project;
    $servicios = $price->acf->servicios;
    $subtotal = $price->acf->subtotal;
    $telefono = $price->acf->telefono;
    $total = $price->acf->total;
    $totaldays = $price->acf->totaldays;
    $version = $price->acf->version;
    $vendedor = $price->acf->vendedor;
    $viajes = $price->acf->viajes;
function formatText($number)
{
    // Format the number
    $formattedNumber = number_format($number, 0, ',', "'");
    // Add the currency symbol and decimal places
    $formattedText = '$' . $formattedNumber;
    return $formattedText;
}

function convertDate($dateString)
{
    $date = DateTime::createFromFormat('d/m/Y', $dateString);
    // Format day and month
    $dayMonth = $date->format('d/m');
    $year = $date->format('y');
    // Return the converted date
    return '<div class="date"><strong>' . $dayMonth . '</strong><p>/' . $year . '</p></div>';
}

?>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script>
    let idCotizacion = <?= $_GET["cotizacionId"] ?>;
    let equiposList = <?= json_encode($equipos) ?>;
    let moneda = "<?= $moneda ?>";
</script>
<div class="allCotizacion-header">
    <img src="images/garcia.svg" alt="garcia" id="logo">
    <img src="images/beyond.svg" alt="beyond">
    <div class="right">
        <h1>
            <?= $palabras[0] ?>
        </h1>
        <h2><?= $_GET["cotizacionId"] ?>-<?= isset($price->acf->version) && $price->acf->version != "" ? $price->acf->version : "1" ?></h2>
        <h3>
            <?php
            $dateString = $price->date;
            $date = new DateTime($dateString);

            // Convert to Spanish month and format
            $spanishMonth = array(
                'January' => 'Enero',
                'February' => 'Febrero',
                'March' => 'Marzo',
                'April' => 'Abril',
                'May' => 'Mayo',
                'June' => 'Junio',
                'July' => 'Julio',
                'August' => 'Agosto',
                'September' => 'Septiembre',
                'October' => 'Octubre',
                'November' => 'Noviembre',
                'December' => 'Diciembre'
            );

            $monthName = $spanishMonth[$date->format('F')];
            $day = $date->format('j');
            $year = $date->format('Y');
            // Output the converted date and time
            echo "$monthName $day · $year";
            ?>
        </h3>
    </div>
</div>
<div class="grid-container">
    <div class="left">
        <div class="break">
            <section>
                <div class="grid-contact">
                    <h2>
                        <?= $palabras[1] ?>
                    </h2>
                    <span>
                        <input readonly type="text" value="<?= $productor ?>">
                        <label for="">
                            <?= $palabras[2] ?>
                        </label>
                    </span>
                    <span>
                        <input readonly type="text" value="<?= $cargo_del_contacto ?>">
                        <label for="">
                            <?= $palabras[3] ?>
                        </label>
                    </span>
                    <span>
                        <input readonly type="text" value="<?= $project ?>">
                        <label for="">
                            <?= $palabras[4] ?>
                        </label>
                    </span>
                    <span>
                        <input readonly type="text" value="<?= $telefono ?>">
                        <label for="">
                            <?= $palabras[5] ?>
                        </label>
                    </span>
                    <span>
                        <input readonly type="text" value="<?= $dop ?>">
                        <label for="">
                            <?= $palabras[6] ?>
                        </label>
                    </span>
                </div>
            </section>
            <section>
                <h4><?= $palabras[7] ?></h4>
                <div class="cronograma">
                    <span>
                        <label for="">
                            <?= $palabras[8] ?>
                        </label>
                        <?= convertDate($fechas_de_rodaje->desde) ?>
                    </span>
                    <span>
                        <label for="">
                            <?= $palabras[9] ?>
                        </label>
                        <?= convertDate($fechas_de_rodaje->hasta) ?>
                    </span>
                </div>
            </section>
            <!-- <div class="info-txt">
                <h3 class="uppercase">entrega equipos</h3>
                <p>Se entrega el equipo en las instalaciones de NEW LAB PHOTOGRAPHY SAS en la calle 108 # 16 - 60 apto 406 a la 1:00 pm. Momento en el cual se firma el acta de entrega.</p>
            </div> -->
            <?php if (isset($viajes) && $viajes) { ?>
            <section>
                <?php if (count($viajes) > 0) { ?>
                    <div class="viajes">
                        <h4>
                            <?= $palabras[10] ?>
                        </h4>
                        <?php
                            for ($i = 0; $i < count($viajes); $i++) {
                                $fecha_viaje = $viajes[$i]->fecha_viaje;
                                $destino = $viajes[$i]->destino;
                                $tipo_de_viaje = $viajes[$i]->tipo_de_viaje;
                            ?>
                        <div class="flex">
                            <p>
                                <?= $destino ?>
                            </p>
                            <div class="date">
                                <strong>
                                    <?php
                                    $date = new DateTime($fecha_viaje);
                                    $monthName = $spanishMonth[$date->format('F')];
                                    $day = $date->format('j');
                                    $year = $date->format('Y');
                                    echo "$day de $monthName del $year";
                                    ?>
                                </strong>
                                <?php if ($tipo_de_viaje == "terrestre") { ?>
                                <img src="images/terrestre.svg" alt="terrestre">
                                <?php } else { ?>
                                <img src="images/aereo.svg" alt="aereo">
                                <?php } ?>
                            </div>
                        </div>
                        <?php } ?>
                    </div>
                <?php } ?>
            </section>
            <?php } ?>
            <?php if (isset($dias_standby) && $dias_standby) { ?>
            <section>
                <?php if (count($dias_standby) > 0) { ?>
                    <div class="info-txt">
                        <h3 class="uppercase">
                            <?= $palabras[11] ?>
                        </h3>
                        <?php
                            for ($i = 0; $i < count($dias_standby); $i++) {
                                $count = $i + 1;
                                $fecha = $dias_standby[$i]->fecha_stand_by;
                                $date = new DateTime($fecha);
                                $monthName = $spanishMonth[$date->format('F')];
                                $day = $date->format('j');
                                $year = $date->format('Y');
                                echo "<p style='margin-bottom: 14px;'>Día de Stand by $count :  $day de $monthName del $year</p>";
                            }
                            ?>
                    </div>
                <?php } ?>
            </section>
            <?php } ?>

        </div>
        <!-- <div class="info-txt">
            <h3 class="uppercase">REGRESO EQUIPOS</h3>
            <p>Regreso y entrega de los equipos en la en las instalaciones de NEW LAB PHOTOGRAPHY SAS en la calle 108 # 16 -60 int 406 el día 20 de octubre de 2023 a la 2:00 pm. Momento en el cual se revisa el equipo y firma acta de recibido.</p>
        </div> -->
        <!-- <div class="info-txt">
            <h3 class="uppercase">nota</h3>
            <p>POR FAVOR CONTEMPLAR SUFICIENTE TIEMPO PARA LA REVISION DEL EQUIPO EN NUESTRAS INSTALACIONES EL DIA DEL REGRESO DE EQUIPOS.</p>
        </div> -->
        <div class="break">
            <div class="equipos">
                <h3 class="uppercase">
                    <?= $palabras[13] ?>
                </h3>
                <div class="equipo">
                </div>
            </div>
        </div>
        <div class="break">
            <section>
                <div class="politics">
                    <details open>
                        <summary>
                         <span>
                         <?= $palabras[18] ?> 
                         </span>
                            <img src="images/arrow.svg" alt="arrow"> <small>LETRA PEQUEÑA</small>
                        </summary>
                        <div class="content">
                        <?=$sdk->infoGnrl->acf->responsabilidad_y_seguro?>
                        </div>
                    </details>
                    <details open>
                        <summary>
                         <span>
                         <?= $palabras[19] ?>
                         </span>
                            <img src="images/arrow.svg" alt="arrow">
                        </summary>
                        <div class="content">
                        <?=$sdk->infoGnrl->acf->condiciones_de_alquiler?>
                        </div>
                    </details>
                    <details open>
                        <summary>
                         <span><?= $palabras[20] ?></span>
                            <img src="images/arrow.svg" alt="arrow">
                        </summary>
                        <div class="content">
                            <?=$sdk->infoGnrl->acf->normas_aplicable_y_arbitraje?>
                        </div>
                    </details>
                </div>
            </section>
        </div>
       
    </div>
    <div class="right break">
        <div class="resumen">
            <h3><?= $palabras[21] ?></h3>
            <div class="subtotal">
                <label for="">
                    <?= $palabras[22] ?>
                </label>
                <input type="text" readonly value="<?= formatText($subtotal) ?>">
            </div>
            <div class="impuestos">
                <label for="">IVA</label>
                <input type="text" readonly value="<?= formatText($iva) ?>">
            </div>
            <div class="total">
                <label for="">
                    <?= $palabras[23] ?>
                </label>
                <input type="text" readonly value="<?= formatText($total) ?>">
            </div>
            <h3>
                <?= $palabras[24] ?>
            </h3>
            <ul class="options">
                <?php for ($i = 0; $i < count($formas_de_pago); $i++) {
                        $forma_de_pago = $formas_de_pago[$i]; ?>
                <li>
                    <p class="option">
                        <?= $palabras[25] ?>
                        <?= $i + 1 ?>
                    </p>
                    <p class="title">
                        <?= $forma_de_pago->descripcion ?>
                    </p>
                    <p class="discount">-<?= $forma_de_pago->descuento_adicional ?>%
                    </p>
                    <p class="price">
                        <strong>
                            <?php
                                    // Convert percentage discount to decimal
                                    $discountPercentage = $forma_de_pago->descuento_adicional / 100;
                                    // Calculate the discount amount
                                    $discountAmount = $total * $discountPercentage;
                                    // Calculate the discounted price
                                    $discountedTotal = $total - $discountAmount;
                                    // Make sure the discounted total is not less than 0
                                    if ($discountedTotal < 0) {
                                        $discountedTotal = 0;
                                    }
                                    echo formatText($discountedTotal);
                                    ?>
                        </strong>
                        <svg xmlns="http://www.w3.org/2000/svg" width="212" height="25" viewBox="0 0 212 25"
                            fill="none">
                            <path
                                d="M18.5965 13.6L8.18246 5.4L212 0L202.33 3.4L212 7.2L202.33 11.4L212 22.4L0 25L18.5965 13.6Z"
                                fill="currentColor" />
                        </svg>
                    </p>
                    <a href="https://api.whatsapp.com/send/?phone=573104247964&text=He revisado la cotización que me enviaron y quiero avanzar con la opción <?= $i + 1 ?>.El número de la cotización es <?= $_GET["
                        cotizacionId"] ?>-
                        <?= isset($price->acf->version) && $price->acf->version != "" ? $price->acf->version : "1" ?>."
                        target="_blank">
                        <?= $palabras[26] ?>
                    </a>
                </li>
                <?php } ?>
            </ul>

            <button type="button" id="printButton" onclick="window.print()"><svg width="62" height="60"
                    viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_3)">
                        <path
                            d="M30.9019 59.9999C25.3188 59.9999 19.7356 59.9999 14.1525 59.9999C11.4148 59.9999 9.93517 58.5145 9.93103 55.7668C9.9269 53.3008 9.89792 50.8327 9.94966 48.3667C9.96621 47.6073 9.7241 47.4508 9.02466 47.4738C7.33813 47.5259 5.64747 47.4988 3.95887 47.4884C1.56255 47.4717 0.0126066 45.9215 0.00846791 43.5056C0.000190486 35.3732 -0.00187887 27.2429 0.00639856 19.1126C0.00846791 16.5506 1.52945 15.0255 4.05199 15.0151C5.74059 15.0088 7.43125 14.9775 9.11778 15.0317C9.82757 15.0547 9.95587 14.8043 9.94966 14.1492C9.91655 10.8132 9.92896 7.47932 9.93517 4.14332C9.93724 1.5271 11.4479 0.00201233 14.0387 0.00201233C25.3415 -7.39763e-05 36.6464 -0.00216028 47.9493 0.00201233C50.5546 0.00201233 52.0569 1.5125 52.0652 4.13081C52.0756 7.39587 52.1149 10.663 52.0383 13.9281C52.0155 14.9024 52.3177 15.0693 53.1827 15.0317C54.7988 14.9629 56.4212 15.0004 58.0415 15.013C60.442 15.0338 61.9836 16.561 61.9878 18.9957C62.0043 27.1949 62.0023 35.3961 61.9898 43.5953C61.9857 45.8861 60.4275 47.4508 58.1553 47.4821C56.4316 47.5051 54.7078 47.5384 52.9861 47.4654C52.1687 47.4299 52.0342 47.7116 52.0487 48.4543C52.0963 50.9203 52.0756 53.3884 52.0652 55.8544C52.0549 58.4748 50.5463 59.9958 47.9596 59.9958C42.273 59.9978 36.5864 59.9958 30.8998 59.9958L30.9019 59.9999ZM31.0985 17.4623C22.1382 17.4623 13.1779 17.4623 4.21754 17.4623C2.85176 17.4623 2.43996 17.8086 2.43789 19.0187C2.42962 27.1845 2.42962 35.3482 2.43789 43.514C2.43789 44.6009 2.86211 45.0244 3.94025 45.037C5.66402 45.0557 7.38779 45.0077 9.1095 45.0578C9.80273 45.0787 9.96001 44.8554 9.95173 44.1837C9.91241 41.2649 9.94759 38.3462 9.92276 35.4274C9.91448 34.4677 10.3387 33.193 9.73858 32.6401C9.22331 32.1665 7.97756 32.4837 7.05256 32.4753C5.56676 32.4628 4.9563 32.0998 4.97699 31.2152C4.99769 30.3682 5.58538 30.0218 7.01738 30.0218C22.8355 30.0218 38.6537 30.0218 54.4719 30.026C54.8857 30.026 55.2996 30.0218 55.7114 30.0385C56.4667 30.0698 57.0048 30.4349 57.0068 31.2235C57.0089 32.0539 56.4771 32.4628 55.6638 32.4691C54.7326 32.4774 53.8014 32.5066 52.8723 32.4607C52.2701 32.4315 52.0404 32.5588 52.0487 33.241C52.0859 36.9233 52.0776 40.6077 52.0507 44.2901C52.0466 44.8701 52.1976 45.0683 52.7916 45.0557C54.4098 45.0182 56.0301 45.0432 57.6504 45.039C59.2686 45.037 59.5666 44.7365 59.5666 43.0904C59.5687 35.2042 59.5666 27.3159 59.5666 19.4297C59.5666 17.7147 59.308 17.4623 57.5656 17.4623C48.7439 17.4623 39.9202 17.4623 31.0985 17.4623ZM31.0509 32.4753C25.1946 32.4753 19.3383 32.5045 13.4821 32.4482C12.4908 32.4378 12.3356 32.7528 12.3398 33.652C12.3749 40.9457 12.3584 48.2394 12.3584 55.5331C12.3584 57.2815 12.615 57.5506 14.3077 57.5506C25.4347 57.5506 36.5616 57.5506 47.6885 57.5506C49.3771 57.5506 49.6379 57.2815 49.6399 55.5331C49.642 48.1706 49.6234 40.8059 49.6648 33.4434C49.6689 32.5671 49.3709 32.4565 48.6197 32.4607C42.7635 32.4878 36.9072 32.4753 31.0509 32.4753ZM31.0033 15.013C36.9279 15.013 42.8524 15.0046 48.7749 15.0255C49.3978 15.0276 49.671 14.9379 49.6606 14.1993C49.6151 10.8654 49.6441 7.53148 49.6337 4.19965C49.6296 2.78931 49.2799 2.45133 47.8334 2.45133C36.605 2.44925 25.3767 2.44925 14.1484 2.45133C12.6709 2.45133 12.3584 2.7768 12.3563 4.31232C12.3522 7.54191 12.3832 10.7715 12.3356 14.0011C12.3232 14.8002 12.497 15.0443 13.3331 15.038C19.2224 14.9984 25.1118 15.0171 31.0033 15.0151V15.013Z"
                            fill="currentColor" />
                        <path
                            d="M50.8876 22.5196C51.645 22.5196 52.4044 22.5091 53.1618 22.5216C53.9606 22.5342 54.5131 22.8909 54.5172 23.7505C54.5193 24.5579 53.9937 24.9418 53.2466 24.9543C51.6284 24.9814 50.0081 24.9856 48.3878 24.9501C47.6842 24.9355 47.202 24.5349 47.1896 23.7818C47.1751 22.9869 47.649 22.5613 48.4085 22.5258C49.2341 22.4862 50.0619 22.5175 50.8896 22.5175L50.8876 22.5196Z"
                            fill="currentColor" />
                        <path
                            d="M30.9203 38.7301C27.0631 38.7301 23.2058 38.7301 19.3485 38.726C18.9719 38.726 18.5808 38.7343 18.2228 38.6342C17.662 38.4777 17.3826 38.0375 17.4033 37.4533C17.4219 36.913 17.7116 36.5207 18.2269 36.3789C18.5518 36.2892 18.9077 36.2871 19.2492 36.2871C27.1024 36.2829 34.9556 36.2829 42.8088 36.2871C43.1171 36.2871 43.4379 36.2829 43.7297 36.3622C44.2925 36.5145 44.5926 36.9255 44.5946 37.5117C44.5946 38.1022 44.2822 38.5111 43.7255 38.6592C43.4006 38.7447 43.0426 38.7301 42.6991 38.7301C38.7735 38.7343 34.8459 38.7322 30.9203 38.7301Z"
                            fill="currentColor" />
                        <path
                            d="M30.9948 53.7432C27.1375 53.7432 23.2803 53.7432 19.4209 53.7432C19.1105 53.7432 18.798 53.7557 18.4918 53.7161C17.8213 53.6263 17.4157 53.2279 17.4054 52.5436C17.395 51.8613 17.7799 51.4399 18.4504 51.3356C18.7546 51.2876 19.0691 51.3001 19.3775 51.3001C27.1272 51.3001 34.8769 51.3001 42.6267 51.3001C42.7653 51.3001 42.9019 51.2959 43.0405 51.3001C44.0752 51.3293 44.6443 51.7716 44.5905 52.5561C44.5263 53.4866 43.8993 53.7536 43.0819 53.7494C42.3246 53.7474 41.5672 53.7474 40.8077 53.7474C37.5361 53.7474 34.2644 53.7474 30.9907 53.7474L30.9948 53.7432Z"
                            fill="currentColor" />
                        <path
                            d="M30.8914 46.2367C27.032 46.2367 23.1747 46.2367 19.3154 46.2367C19.0402 46.2367 18.7587 46.2575 18.4897 46.2158C17.8317 46.1115 17.4136 45.7276 17.4033 45.037C17.393 44.3485 17.7944 43.9438 18.4483 43.8186C18.7153 43.7686 18.9967 43.7915 19.2719 43.7915C27.092 43.7915 34.9142 43.7915 42.7343 43.7915C42.7695 43.7915 42.8026 43.7915 42.8378 43.7915C44.0504 43.8019 44.634 44.2129 44.6091 45.0475C44.5864 45.8423 44.0256 46.2346 42.8792 46.2367C40.5015 46.2408 38.1238 46.2367 35.7482 46.2367C34.1299 46.2367 32.5096 46.2367 30.8893 46.2367H30.8914Z"
                            fill="currentColor" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1_3">
                            <rect width="62" height="60" fill="white" />
                        </clipPath>
                    </defs>
                </svg></button>
        </div>
    </div>
    <div id="end-marker"></div>
</div>

<div class="footer break">
    <div class="sellers">
            <h6 class="uppercase">¿<?= $palabras[17] ?>?</h6>
            <ul>
                <li>
                    <p>Nicola García Ruiz A.D.F.C</p>
                    <small>CEO</small>
                    <small>nicogarcia.ceo@garciarental.co</small>
                    <small>(49) 160 91777858</small>
                    <small>(57) 313 393 1322</small>
                    <small>Berlín</small>
                </li>
                <li>
                    <p>Hernan Avelino</p>
                    <small>COO</small>
                    <small>
                        hernanavelino.coo@garciarental.co
                    </small>
                    <small>
                        (57) 313 393 1322
                    </small>
                    <small>
                        Berlín
                    </small>
                </li>
                <li>
                    <div class="info">
                        <p>NEW LAB PHOTOGRAPHY SAS</p>
                        <small>NIT 900.338.551-3</small>
                        <small>CALLE 108 16 60 INT 406</small>
                        <small>(57) 3133931322</small>
                        <small>(57) 3103182658</small>
                    </div>
                </li>
            </ul>
        </div>
        <img src="https://garciarental.co/img/outside.png" alt="outside" class="outside">

</div>
<?php include 'includes/footer.php'; ?>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
    AOS.init();
</script>