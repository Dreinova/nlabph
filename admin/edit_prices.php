<?php 
include 'includes/head.php'; ?>
<script>
    let idPrice = <?= $_GET["idPrice"] ?>;
</script>
<h1 class="uppercase">Editando COTIZACIÓN</h1>
<form action="" id="createCotizacion">
    <div class="content">
        <span>
            <label for="name">Nombre:</label>
            <input type="text" name="name" id="name" readonly>
        </span>
        <span>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" readonly>
        </span>
        <span>
            <label for="phone">Teléfono:</label>
            <input type="tel" name="phone" id="phone" readonly>
        </span>
        <span>
            <label for="productor">Productor:</label>
            <input type="text" name="productor" id="productor" >
        </span>
        <span>
            <label for="project">Proyecto:</label>
            <input type="text" name="project" id="project" >
        </span>
        <span>
            <label for="dop">DoP:</label>
            <input type="text" name="dop" id="dop" >
        </span>
        <span>
            <label for="cargo_del_contacto">Cargo del contacto:</label>
            <input type="text" name="cargo_del_contacto" id="cargo_del_contacto" >
        </span>
        <span>
            <label for="">Vendedor:</label>
            <div class="custom-select">
                <select name="vendedor" id="vendedor">
                    <option value="">Selecciona un vendedor</option>
                </select>
            </div>
        </span>
        <span>
            <label for="start">Fechas de rodaje</label>
            <div class="flex">
                <span>
                    <label for="start">desde:</label>
                    <input type="date" name="start" id="start" readonly>
                </span>
                <span>
                    <label for="end">hasta:</label>
                    <input type="date" name="end" id="end" readonly>
                </span>
            </div>
        </span>
        <span>
            <div class="flex">
                <span>
                    <label for="">Recogida de equipos</label>
                    <input type="date" name="recogida_equipos" id="recogida_equipos" onchange="actualizarFechaEntrega()">
                </span>
                <span>
                    <label for="">Entrega de equipos</label>
                    <input type="date" name="entrega_equipos" id="entrega_equipos">
                </span>
            </div>
        </span>
        <span>
            <label for="">Moneda:</label>
            <div class="custom-select">
                <select name="coin_val" id="coin_val">
                    <option value="">Selecciona una moneda</option>
                    <option value="dolares">Dolares</option>
                    <option value="euros">Euros</option>
                    <option value="pesos_colombianos">Pesos</option>
                </select>
            </div>
        </span>
        <span>
            <label for="">Idioma:</label>
            <div class="custom-select">
                <select name="lang_val" id="lang_val">
                    <option value="">Selecciona un idioma</option>
                    <option value="es">Español</option>
                    <option value="en">Ingles</option>
                    <option value="de">Alemán</option>
                </select>
            </div>
        </span>
        <span>
            <label for="ida">Días standby:</label>
            <span class="standby">
                <button type="button" id="standby-decrease"><svg xmlns="http://www.w3.org/2000/svg" width="23"
                        height="23" viewBox="0 0 23 23" fill="none">
                        <path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    </svg></button>
                <div class="standby-days">
                    <span>0</span>
                    <p>días</p>
                </div>
                <button type="button" id="standby-increment"><svg xmlns="http://www.w3.org/2000/svg" width="23"
                        height="23" viewBox="0 0 23 23" fill="none">
                        <path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                        <path d="M11.3137 22.6262V-0.00120872" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    </svg></button>
            </span>
        </span>
        <span class="standbydates"></span>
        <span>
            <label for="travels">Viajes:</label>
            <span class="travels">
                <button type="button" id="travels-decrease"><svg xmlns="http://www.w3.org/2000/svg" width="23"
                        height="23" viewBox="0 0 23 23" fill="none">
                        <path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    </svg></button>
                <div class="travels-days">
                    <span>0</span>
                    <p>días</p>
                </div>
                <button type="button" id="travels-increment"><svg xmlns="http://www.w3.org/2000/svg" width="23"
                        height="23" viewBox="0 0 23 23" fill="none">
                        <path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                        <path d="M11.3137 22.6262V-0.00120872" stroke="white" stroke-width="2" stroke-miterlimit="10" />
                    </svg></button>
            </span>
        </span>
        <span class="travelsdates"></span>
        <label class="cl-checkbox" for="transporte">
            <input type="checkbox" name="transporte" id="transporte">
            <span>Incluir condiciones transporte</span>
        </label>
        <label class="cl-checkbox" for="seguros">
            <input type="checkbox" name="seguros" id="seguros">
            <span>Incluir información de seguros</span>
        </label>
        <label class="cl-checkbox" for="crew">
            <input type="checkbox" name="crew" id="crew">
            <span>Incluir condiciones del crew</span>
        </label>
        <input type="hidden" name="totaldays" id="totaldays" value="1">
        <input type="hidden" name="subtotal" id="subtotal" value="">
        <input type="hidden" name="impuestos" id="impuestos" value="">
        <input type="hidden" name="total" id="total" value="">
        <input type="hidden" name="estado" id="estado" value="save">
        <input type="hidden" name="totalTravelDays" id="totalTravelDays">
        <input type="hidden" name="totalStandbyDays" id="totalStandbyDays" value="0">
        <input type="hidden" name="realtotalStandbyDays" id="realtotalStandbyDays" value="0">
        <input type="hidden" name="totaltravelsDays" id="totaltravelsDays" value="0">
        <input type="hidden" name="realtotaltravelsDays" id="realtotaltravelsDays" value="0">

    </div>
    <hr>
    <div class="itemlist-header">
        <strong>Equipo</strong>
        <strong>Días</strong>
        <strong>Precio</strong>
        <strong>Descuento para este equipo</strong>
        <strong></strong>
    </div>
    <div class="itemListContainer">
        <ul class="itemList"> </ul>
    </div>
    <button id="addItem" class="uppercase primary btn" type="button">Agregar Equipo</button>
    <hr>
    <div class="servicelist-header">
        <strong>Servicio</strong>
        <strong>Días</strong>
        <strong>Precio</strong>
        <strong>Descuento para este equipo</strong>
        <strong></strong>
    </div>
    <div class="serviceListContainer">
        <ul class="serviceList"></ul>
    </div>
    <button id="addService" class="uppercase primary btn" type="button">Agregar Servicio</button>
    <hr>
    <div class="subtotal"><strong>SUBTOTAL</strong>
        <p>$0</p>
    </div>
    <div class="impuestos"> <label class="cl-checkbox" for="impuestoscheck">
            <input checked="" type="checkbox" name="impuestoscheck" id="impuestoscheck">
            <span></span>
        </label><strong>IVA</strong>
        <p>$0</p>
    </div>
    <div class="total"><strong>TOTAL</strong>
        <p>$0</p>
    </div>
    <hr>
    <div class="paylist">
        <h2>Formas de pago</h2>
        <ul></ul>
    </div>
    <button id="addPayItem" class="uppercase primary btn" type="button">Agregar forma de pago</button>
    <hr>
    <div class="actions">
        <button type="submit" class="uppercase primary btn">Guardar</button>
        <button type="button" class="uppercase primary btn" id="updateDetails">Enviar cotización</button>
        <button type="submit" onclick="convertirEnOrden()" class="uppercase secondary btn">Convertir en orden</button>
    </div>
  <!-- Simple pop-up dialog box, containing a form -->
<dialog id="favDialog">
    <div class="content">
<h2>Enviar cotización</h2>
<p>Se va a enviar la cotización al correo <span class="emailUser"></span></p>
<menu>
    <button  type="button" id="cancel" class="secondary btn" >Cancelar</button>
    <button type="submit" onclick="enviarCotizacion()" class="primary btn">Enviar</button>
</menu>
    </div>
  
</dialog>
</form>

<?php include 'includes/footer.php'; ?>
<script>
  (function () {
    var updateButton = document.getElementById("updateDetails");
    var cancelButton = document.getElementById("cancel");
    var favDialog = document.getElementById("favDialog");

    // Update button opens a modal dialog
    updateButton.addEventListener("click", function () {
      favDialog.showModal();
    });

    // Form cancel button closes the dialog box
    cancelButton.addEventListener("click", function () {
      favDialog.close();
    });
  })();
</script>