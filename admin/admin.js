let currentPage = 1;
let perPage = 100; // Número de elementos por página, valor predeterminado
let totalPages = 11; // Número total de páginas, valor predeterminado Número total de páginas (asumimos que hay 100 páginas)
// Definición de constantes
const impuestosValueInitial = 0.18;
let impuestosValue = 0.18;
// Función para establecer la opción seleccionada en el select
function establecerValorSeleccionado(element, value) {
  const selectElement = document.getElementById(element);
  // Iterar sobre las opciones del select
  for (let i = 0; i < selectElement.options.length; i++) {
    const option = selectElement.options[i];
    // Comprobar si el valor de la opción coincide con el valor pasado
    if (option.value != "" && option.value === value) {
      // Establecer la opción seleccionada
      option.selected = true;
      break; // Salir del bucle una vez que se establezca la opción seleccionada
    }
  }
}
// Autocompletar para el campo "finditem"
const items = []; // Los elementos de autocompletar
let ctr;
function query(endpoint, extras = "", method = "GET", data = {}) {
  const controller = new AbortController();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: method.toUpperCase(), // Convertimos el método a mayúsculas por si acaso
    headers: myHeaders,
    redirect: "follow",
    signal: controller.signal,
  };
  let result;

  if (method.toUpperCase() === "POST") {
    // Si el método es POST, agregamos los datos al cuerpo de la solicitud
    requestOptions.body = JSON.stringify(data);
    result = fetch(`../s/${endpoint}/${extras}`, requestOptions).then((res) =>
      res.json()
    );
  } else {
    result = fetch(`../g/${endpoint}/${extras}`, requestOptions).then((res) =>
      res.json()
    );
  }

  return { result, controller }; // Opcional: Puedes devolver el resultado si es necesario.
}
function updateGlobalPrices() {
  const subtotalElement = document.querySelector(".subtotal p");
  const impuestosElement = document.querySelector(".impuestos p");
  const totalElement = document.querySelector(".total p");

  // Calcular el subtotal sumando los precios individuales de cada item
  const itemList = document.querySelectorAll(".itemList li");
  const serviceList = document.querySelectorAll(".serviceList li");

  let subtotal = 0;
  let descuentoTotal = 0;

  itemList.forEach((item) => {
    const priceInput = item.querySelector("input[type='text'][name^='price-']");
    const price = parseFloat(priceInput.value);
    subtotal += price;

    const descuento = parseInt(item.getAttribute("data-descuento")); // Obtener el descuento del atributo data-descuento
    const descuentoAplicado = price * (descuento / 100); // Calcular el descuento aplicado a este item
    descuentoTotal += descuentoAplicado; // Sumar al descuento total
  });
  serviceList.forEach((item) => {
    const priceInput = item.querySelector("input[type='text'][name^='price-']");
    const price = parseFloat(priceInput.value);
    subtotal += price;

    const descuento = parseInt(item.getAttribute("data-descuento")); // Obtener el descuento del atributo data-descuento
    const descuentoAplicado = price * (descuento / 100); // Calcular el descuento aplicado a este item
    descuentoTotal += descuentoAplicado; // Sumar al descuento total
  });

  // Calcular los impuestos y el total (puedes ajustar estos cálculos según tus necesidades)
  const impuestos = subtotal * impuestosValue; // 18% de impuestos (por ejemplo)
  const total = subtotal + impuestos - descuentoTotal;

  // Actualizar los elementos del DOM con los valores calculados
  subtotalElement.textContent = formatToCurrency(
    subtotal.toFixed(2),
    document.getElementById("coin_val").value
  );
  impuestosElement.textContent = formatToCurrency(
    impuestos.toFixed(2),
    document.getElementById("coin_val").value
  );
  totalElement.textContent = formatToCurrency(
    total.toFixed(2),
    document.getElementById("coin_val").value
  );
  document.getElementById("subtotal").value = subtotal;
  document.getElementById("impuestos").value = impuestos;
  document.getElementById("total").value = total;
}
function showAutocompleteResults(
  results,
  finditemInput,
  finditemInputID,
  listclass
) {
  const autocompleteDiv = finditemInput.nextElementSibling;

  // Eliminar resultados anteriores
  while (autocompleteDiv.firstChild) {
    autocompleteDiv.removeChild(autocompleteDiv.firstChild);
  }

  // Mostrar resultados
  results.forEach(function ({
    title: { rendered },
    id,
    acf: {
      max_discount,
      precio_por_dia: { dolares, euros, pesos_colombianos },
    },
  }) {
    // Obtener el elemento de entrada con id "totaldays"
    const totaldaysInputValue = document.getElementById("totaldays").value;
    // Obtener el elemento de entrada con id "coin_val"
    const coinValInput = document.getElementById("coin_val");
    // Obtener el valor seleccionado en el elemento de entrada "coin_val"
    const selectedCoin = coinValInput.value;
    const resultItem = document.createElement("div");
    resultItem.textContent = rendered;
    resultItem.addEventListener("click", function () {
      finditemInputID.value = id;
      finditemInput.value = rendered;
      // document.querySelector('.PB-range-slider')
      finditemInput.parentElement.parentElement.setAttribute("data-id", id);
      finditemInput.parentElement.parentElement.setAttribute(
        "data-descuento",
        max_discount
      );
      finditemInput.parentElement.parentElement.setAttribute(
        "data-dolares",
        dolares
      );
      finditemInput.parentElement.parentElement.setAttribute(
        "data-euros",
        euros
      );
      finditemInput.parentElement.parentElement.setAttribute(
        "data-pesos_colombianos",
        pesos_colombianos
      );
      document
        .querySelector(`li[data-id="${id}"] input[type="range"]`)
        .setAttribute("max", max_discount);
      // Obtener el último valor numérico en el id de un elemento
      const lastIndex =
        document.querySelectorAll(`.admin main .${listclass} li`).length - 1;
      // Obtener el elemento input con el id específico
      let priceInput;
      if (listclass == "itemList") {
        priceInput = document.querySelector(`#price-${lastIndex}`);
      } else {
        priceInput = document.querySelector(`#priceservice-${lastIndex}`);
      }
      // Determinar qué valor usar en función de la moneda seleccionada
      let selectedPrice = 0;
      if (selectedCoin === "dolares") {
        selectedPrice = dolares;
      } else if (selectedCoin === "euros") {
        selectedPrice = euros;
      } else if (selectedCoin === "pesos_colombianos") {
        selectedPrice = pesos_colombianos;
      }
      // Establecer el valor del input con el precio correspondiente
      priceInput.value = selectedPrice * totaldaysInputValue;
      updateGlobalPrices();
      autocompleteDiv.style.display = "none";
    });
    autocompleteDiv.appendChild(resultItem);
  });

  autocompleteDiv.style.display = results.length > 0 ? "block" : "none";
}
function addNewItemToForm(data) {
  const listContainer = document.querySelector(".itemList");
  const listItems = document.querySelectorAll(".itemList li");
  const listItemsCounter = listItems.length;

  const newItem = document.createElement("li");
  if (data) {
    newItem.dataset.id = data.id;
    newItem.dataset.dolares = data.dolares;
    newItem.dataset.euros = data.euros;
    newItem.dataset.pesos_colombianos = data.pesos_colombianos;
    newItem.dataset.max_discount = data.max_discount;
  }
  newItem.dataset.descuento = 0;
  newItem.innerHTML = `
      <span class="search">
      <input type="hidden" name="finditemid-${listItemsCounter}" id="finditemid-${listItemsCounter}" ${
    data ? `value="${data.id}"` : ""
  }>
        <input type="text" name="finditem-${listItemsCounter}" id="finditem-${listItemsCounter}" ${
    data ? `value="${data.name}"` : ""
  } onfocus="this.select();">
      
        <div class="ui-autocomplete"></div>
      </span>
      <div class="days">
        <button type="button" id="decrease-${listItemsCounter}"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none"><path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10"/></svg></button>
        <div class="daysTotal">
        <span class="total-${listItemsCounter}">${
    document.querySelector("#totaldays").value
  }</span>
        <p>día(s)</p>
        <input type="hidden" id="daysValue-${listItemsCounter}" name="daysValue-${listItemsCounter}" value="${
    document.querySelector("#totaldays").value
  }">
        </div>
        <button type="button" id="increment-${listItemsCounter}"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none"><path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10"/><path d="M11.3137 22.6262V-0.00120872" stroke="white" stroke-width="2" stroke-miterlimit="10"/></svg></button>
      </div>
      <div class="price">
      <span>
      <input type="text" name="price-${listItemsCounter}" id="price-${listItemsCounter}" placeholder="0.00" ${
    data ? `value="${data.price}"` : `value="0"`
  } readonly>
      </span>
      </div>
      <div class="PB-range-slider-div">
        <input type="range" min="0" max="${
          data ? data.max_discount : 99
        }" value="0" class="PB-range-slider" name="discount-${listItemsCounter}" id="discount-${listItemsCounter}">
        <p class="PB-range-slidervalue" id="discountname-${listItemsCounter}">0%</p>
      </div>
      <button class="remove" type="button" onclick="removeItem(${
        data ? `${data.id}` : "''"
      }, this)"><img src="../images/delete.svg" alt="delete" /></button>
    `;
  listContainer.appendChild(newItem);

  const finditemInput = document.getElementById(`finditem-${listItemsCounter}`);
  const finditemInputID = document.getElementById(
    `finditemid-${listItemsCounter}`
  );
  finditemInput.addEventListener("input", (event) => {
    if (ctr) {
      ctr.abort();
    }
    const searchValue = finditemInput.value.toLowerCase();
    const { result, controller } = query(
      `garcia-grupos`,
      `?search=${searchValue}`
    );
    ctr = controller;
    result
      .then((response) => {
        // Update the items array with the retrieved data
        items.length = 0; // Clear the existing items array
        response.forEach((item) => items.push(item));

        // Call the showAutocompleteResults function with the updated items array
        showAutocompleteResults(
          items,
          finditemInput,
          finditemInputID,
          "itemList"
        );
      })
      .catch(() => {
        console.error("Fetch Cancelado");
      });
  });

  const decreaseButton = document.getElementById(
    `decrease-${listItemsCounter}`
  );
  const increaseButton = document.getElementById(
    `increment-${listItemsCounter}`
  );
  const totalDays = document.querySelector(`.total-${listItemsCounter}`);
  const totalDaysInput = document.getElementById(`totaldays`);

  decreaseButton.addEventListener("click", () => {
    let days = parseFloat(totalDaysInput.value);
    days -= 0.5;
    totalDays.textContent = days % 1 === 0 ? `${days}` : `${Math.floor(days)}`;
    document.querySelector(
      `.total-${listItemsCounter}`
    ).nextElementSibling.innerHTML = days % 1 === 0 ? `días` : `días y medio`;
    totalDaysInput.value = days;
    updatePrice(`price-${listItemsCounter}`);
  });

  increaseButton.addEventListener("click", () => {
    let days = parseFloat(totalDaysInput.value);
    days += 0.5;
    totalDays.textContent = days % 1 === 0 ? `${days}` : `${Math.floor(days)}`;
    document.querySelector(
      `.total-${listItemsCounter}`
    ).nextElementSibling.innerHTML = days % 1 === 0 ? `días` : `días y medio`;
    totalDaysInput.value = days;
    updatePrice(`price-${listItemsCounter}`);
  });
  document
    .getElementById(`discount-${listItemsCounter}`)
    .addEventListener("input", () =>
      updateDiscount(document.getElementById(`discount-${listItemsCounter}`))
    );

  function updatePrice(priceEl) {
    // Obtener el número de días ingresado por el usuario (asegúrate de que "totalDaysInput" esté definido)
    const days = parseFloat(totalDaysInput.value);
    // Obtener el precio por día desde el atributo "data-*" del elemento "newItem" (asegúrate de que "newItem" esté definido)
    const pricePerDay = parseFloat(
      newItem.dataset[document.getElementById("coin_val").value]
    );
    // Obtener el descuento desde el atributo "data-descuento" del elemento "newItem" (asegúrate de que "newItem" esté definido)
    const elementDiscount = parseFloat(newItem.dataset.descuento);
    // Calcular el precio base multiplicando los días por el precio por día
    let priceBase = (days * pricePerDay).toFixed(2);
    // Aplicar el descuento al precio base
    let totalPriceWithDiscount =
      priceBase - (priceBase * elementDiscount) / 100;
    // Actualizar el valor del elemento de precio con el resultado final
    const priceInput = document.getElementById(priceEl);
    priceInput.value = totalPriceWithDiscount;
    // Actualizar otras variables globales o elementos relacionados con el precio (si es necesario)
    updateGlobalPrices();
  }
  function updateDiscount(inputRange) {
    // Agregar el atributo "data-descuento" al elemento <li>
    inputRange.parentElement.parentElement.setAttribute(
      "data-descuento",
      inputRange.value
    );

    inputRange.nextElementSibling.innerHTML = `${inputRange.value}%`;
    updatePrice(`price-${listItemsCounter}`);
    updateGlobalPrices();
  }

  updateGlobalPrices();
}
function addNewServiceToForm(data) {
  const listContainer = document.querySelector(".serviceList");
  listContainer.classList.add("loading");
  const listItems = document.querySelectorAll(".serviceList li");
  const listItemsCounter = listItems.length;

  const newItem = document.createElement("li");
  if (data) {
    newItem.dataset.id = data.id;
    newItem.dataset.dolares = data.dolares;
    newItem.dataset.euros = data.euros;
    newItem.dataset.pesos_colombianos = data.pesos_colombianos;
    newItem.dataset.max_discount = data.max_discount;
  }
  newItem.dataset.counter = listItemsCounter;
  newItem.dataset.descuento = 0;
  newItem.innerHTML = `
      <span class="search">
      <input type="hidden" name="findserviceid-${listItemsCounter}" id="findserviceid-${listItemsCounter}" ${
    data ? `value="${data.id}"` : ""
  }>
        <input type="text" name="findservice-${listItemsCounter}" id="findservice-${listItemsCounter}" ${
    data ? `value="${data.name}"` : ""
  } onfocus="this.select();">
      
        <div class="ui-autocomplete"></div>
      </span>
      <div class="days">
        <button type="button" id="decreaseservice-${listItemsCounter}"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none"><path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10"/></svg></button>
        <div class="daysTotal">
        <span class="totalservice-${listItemsCounter}">${
    document.querySelector("#totaldays").value
  }</span>
        <p>día(s)</p>
        <input type="hidden" id="daysValue-${listItemsCounter}" name="daysValue-${listItemsCounter}" value="${
    document.querySelector("#totaldays").value
  }">
        </div>
        <button type="button" id="incrementservice-${listItemsCounter}"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none"><path d="M0 11.3125H22.6274" stroke="white" stroke-width="2" stroke-miterlimit="10"/><path d="M11.3137 22.6262V-0.00120872" stroke="white" stroke-width="2" stroke-miterlimit="10"/></svg></button>
      </div>
      <div class="price">
      <span>
      <input type="text" name="price-${listItemsCounter}" id="priceservice-${listItemsCounter}" placeholder="0.00" ${
    data ? `value="${data.price}"` : `value="0"`
  } readonly>
      </span>
      </div>
      <div class="PB-range-slider-div">
        <input type="range" min="0" max="${
          data ? data.max_discount : 99
        }" value="0" class="PB-range-slider" name="discountservice-${listItemsCounter}" id="discountservice-${listItemsCounter}">
        <p class="PB-range-slidervalue" id="discountnameservice-${listItemsCounter}">0%</p>
      </div>
      <button class="remove" type="button" onclick="removeItem(${
        data ? `${data.id}` : "''"
      }, this)"><img src="../images/delete.svg" alt="delete" /></button>
    `;
  listContainer.appendChild(newItem);

  const finditemInput = document.getElementById(
    `findservice-${listItemsCounter}`
  );
  const finditemInputID = document.getElementById(
    `findserviceid-${listItemsCounter}`
  );
  finditemInput.addEventListener("input", (event) => {
    if (ctr) {
      ctr.abort();
    }
    const searchValue = finditemInput.value.toLowerCase();
    const { result, controller } = query(
      `garcia-services`,
      `?search=${searchValue}`
    );
    ctr = controller;
    result
      .then((response) => {
        // Update the items array with the retrieved data
        items.length = 0; // Clear the existing items array
        response.forEach((item) => items.push(item));

        // Filter out the items that are already in the list
        const filteredItems = items.filter((item) => {
          const itemId = item.id;
          const alreadyAdded = Array.from(
            document.querySelectorAll(".serviceList li")
          ).some((li) => li.dataset.id == itemId);
          return !alreadyAdded;
        });

        // Call the showAutocompleteResults function with the updated items array
        showAutocompleteResults(
          filteredItems,
          finditemInput,
          finditemInputID,
          "serviceList"
        );
      })
      .catch(() => {
        console.error("Fetch Cancelado");
      });
  });

  const decreaseButton = document.getElementById(
    `decreaseservice-${listItemsCounter}`
  );
  const increaseButton = document.getElementById(
    `incrementservice-${listItemsCounter}`
  );
  const totalDays = document.querySelector(`.totalservice-${listItemsCounter}`);
  const totalDaysInput = document.getElementById(`totaldays`);

  decreaseButton.addEventListener("click", () => {
    let days = parseFloat(totalDaysInput.value);
    days -= 0.5;
    totalDays.textContent = days % 1 === 0 ? `${days}` : `${Math.floor(days)}`;
    document.querySelector(
      `.totalservice-${listItemsCounter}`
    ).nextElementSibling.innerHTML = days % 1 === 0 ? `días` : `días y medio`;
    totalDaysInput.value = days;
    updatePrice(`priceservice-${listItemsCounter}`);
  });

  increaseButton.addEventListener("click", () => {
    let days = parseFloat(totalDaysInput.value);
    days += 0.5;
    totalDays.textContent = days % 1 === 0 ? `${days}` : `${Math.floor(days)}`;
    document.querySelector(
      `.totalservice-${listItemsCounter}`
    ).nextElementSibling.innerHTML = days % 1 === 0 ? `días` : `días y medio`;
    totalDaysInput.value = days;
    updatePrice(`priceservice-${listItemsCounter}`);
  });
  document
    .getElementById(`discountservice-${listItemsCounter}`)
    .addEventListener("input", () =>
      updateDiscount(
        document.getElementById(`discountservice-${listItemsCounter}`),
        "serviceList"
      )
    );

  function updatePrice(priceEl) {
    // Obtener el número de días ingresado por el usuario (asegúrate de que "totalDaysInput" esté definido)
    const days = parseFloat(totalDaysInput.value);
    // Obtener el precio por día desde el atributo "data-*" del elemento "newItem" (asegúrate de que "newItem" esté definido)
    const pricePerDay = parseFloat(
      newItem.dataset[document.getElementById("coin_val").value]
    );
    // Obtener el descuento desde el atributo "data-descuento" del elemento "newItem" (asegúrate de que "newItem" esté definido)
    const elementDiscount = parseFloat(newItem.dataset.descuento);
    // Calcular el precio base multiplicando los días por el precio por día
    let priceBase = (days * pricePerDay).toFixed(2);
    // Aplicar el descuento al precio base
    let totalPriceWithDiscount =
      priceBase - (priceBase * elementDiscount) / 100;
    // Actualizar el valor del elemento de precio con el resultado final
    const priceInput = document.getElementById(priceEl);
    priceInput.value = totalPriceWithDiscount;
    // Actualizar otras variables globales o elementos relacionados con el precio (si es necesario)
    updateGlobalPrices();
  }
  function updateDiscount(inputRange, classList = "itemList") {
    // Agregar el atributo "data-descuento" al elemento <li>
    inputRange.parentElement.parentElement.setAttribute(
      "data-descuento",
      inputRange.value
    );

    inputRange.nextElementSibling.innerHTML = `${inputRange.value}%`;
    if (classList == "itemList") {
      updatePrice(`price-${listItemsCounter}`);
    } else {
      updatePrice(`priceservice-${listItemsCounter}`);
    }
    updateGlobalPrices();
  }
  listContainer.classList.remove("loading");
}
if (document.querySelector("#addItem")) {
  // Llamada a la función cuando se hace click en el botón
  document.querySelector("#addItem").addEventListener("click", () => {
    addNewItemToForm(null); // Pasar 'null' ya que se agrega un nuevo elemento vacío
    document
      .querySelector(
        `#finditem-${
          document.querySelectorAll(".admin main .itemList li").length - 1
        }`
      )
      .focus();
  });
}
if (document.querySelector("#addService")) {
  // Llamada a la función cuando se hace click en el botón
  document.querySelector("#addService").addEventListener("click", () => {
    addNewServiceToForm(null); // Pasar 'null' ya que se agrega un nuevo elemento vacío
    document
      .querySelector(
        `#findservice-${
          document.querySelectorAll(".admin main .serviceList li").length - 1
        }`
      )
      .focus();
  });
}
function totalPriceDiscount(inputValue, textSmall) {
  const totalElement = document.getElementById("total");
  const coinElement = document.getElementById("coin_val");

  const totalValue = totalElement.value;
  const discountPercentage = inputValue.value;

  const totalWithDiscount =
    totalValue - (totalValue * discountPercentage) / 100;

  const formattedTotal = formatToCurrency(
    totalWithDiscount.toFixed(2),
    coinElement.value
  );

  const textSmallElement = document.querySelector(textSmall);
  textSmallElement.innerHTML = formattedTotal;
}
function addNewItemToPayMethods() {
  const listContainer = document.querySelector(".paylist ul");
  const listItems = document.querySelectorAll(".paylist ul li");
  const listItemsCounter = listItems.length;
  const newItem = document.createElement("li");
  newItem.innerHTML = `<span><label for="desc-${listItemsCounter}">Descripción:</label><textarea name="desc-${listItemsCounter}" id="desc-${listItemsCounter}"></textarea></span><span class="aditionalDiscount"><label for="desc-${listItemsCounter}">Descuento adicional:</label><span class="flex"><input type="number" name="additionaldiscount-${listItemsCounter}" id="additionaldiscount-${listItemsCounter}" onchange="totalPriceDiscount(this, '.totalWithDiscount-${listItemsCounter}')">%</span></span><span><p>El precio total sera de <small class="totalWithDiscount-${listItemsCounter}">$0.00</small></p></span>`;
  listContainer.appendChild(newItem);
}
if (document.querySelector("#addPayItem")) {
  // Llamada a la función cuando se hace click en el botón
  document.querySelector("#addPayItem").addEventListener("click", () => {
    addNewItemToPayMethods();
    document
      .querySelector(
        `#desc-${document.querySelectorAll(".paylist ul li").length - 1}`
      )
      .focus();
  });
}
// Obtener referencias a los elementos del formulario
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
if (startInput && endInput) {
  // Agregar evento onchange al campo de fecha inicial
  startInput.addEventListener("change", function () {
    // Obtener el valor de la fecha inicial seleccionada
    const startDate = new Date(this.value);

    // Establecer la fecha mínima para el campo de fecha final
    endInput.min = this.value;

    // Comprobar si la fecha final actual es menor que la fecha inicial
    const endDate = new Date(endInput.value);
    if (endDate < startDate) {
      endInput.value = this.value;
    }
  });
}
// GET LEADS WP
function getLeads() {
  const tableTbody = document.querySelector("#leads tbody");

  const { result } = query(`garcia-leads`);
  result
    .then((response) => {
      response.forEach(
        ({ id, date, title: { rendered }, acf: { correo, telefono } }) => {
          tableTbody.innerHTML += `
        <tr>
          <td data-label="Nombre">${rendered}</td>
          <td data-label="Correo">${correo}</td>
          <td data-label="Telefono">${telefono}</td>
          <td data-label="Fecha de solicitud">${fechaNatural(date)}</td>
          <td><a href="crear-cotizacion/${id}" class="tooltip" data-tooltip="Convertir en cotización"><img src="../images/book.svg" alt="book"></a></td>
        </tr>`;
        }
      );
      tableTbody.classList.remove("loading");
    })
    .then(() => {
      anime({
        targets: "#leads tbody tr",
        easing: "easeInOutExpo",
        opacity: 1,
        delay: function (el, i, l) {
          return i * 100;
        },
        endDelay: function (el, i, l) {
          return (l - i) * 100;
        },
      });
    })
    .catch(() => {
      console.error("Fetch Cancelado");
    });
}
// GET SELLERS WP
function getSellers() {
  const selectSellers = document.querySelector("#vendedor");
  const { result } = query(`garcia-sellers`);
  result
    .then((response) => {
      response.forEach(({ id, title: { rendered } }) => {
        selectSellers.innerHTML += `<option value="${id}">${rendered}</option>`;
      });
    })
    .catch(() => {
      console.error("Fetch Cancelado");
    })
    .finally(() => {
      if (typeof idPrice !== "undefined" && idPrice !== null) {
        document.title = "EDITAR COTIZACIÓN";
        getSinglePrice(idPrice);
      }
    });
}
function formatToCurrency(value, currencyCode) {
  const currencyFormats = {
    pesos_colombianos: {
      style: "currency",
      currency: "COP",
      currencyDisplay: "symbol",
    },
    euros: { style: "currency", currency: "EUR", currencyDisplay: "symbol" },
    dolares: { style: "currency", currency: "USD", currencyDisplay: "code" },
    // Puedes agregar más configuraciones para otras monedas aquí si es necesario.
  };

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    throw new Error("El valor proporcionado no es un número válido.");
  }

  if (!currencyFormats.hasOwnProperty(currencyCode)) {
    throw new Error("El código de moneda proporcionado no es válido.");
  }

  // Modify the options to format without decimals
  const formatOptions = {
    ...currencyFormats[currencyCode],
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const formattedValue = numberValue.toLocaleString("es-CO", formatOptions);

  return formattedValue;
}
// Función para actualizar el valor de impuestosValue según el estado del checkbox
function actualizarImpuestosValue() {
  const impuestosCheckbox = document.querySelector("#impuestoscheck");
  impuestosValue = impuestosCheckbox.checked ? impuestosValueInitial : 0;
  updateGlobalPrices();
}
// GET PRICES WP
function getPrices() {
  const tableTbody = document.querySelector("#prices tbody");

  const { result } = query(`garcia-price`);
  result
    .then((response) => {
      response.forEach(({ title: { rendered } }, i) => {
        if (response[i].acf.total) {
          let {
            id,
            acf: {
              total,
              moneda,
              estado: { label: estadolabel, value: estadoValue },
              estado_cotizacion,
              fecha_final_de_rodaje,
              fecha_inicial_de_rodaje,
              version,
            },
          } = response[i];
          let img;
          let check;
          switch (estadoValue) {
            case "save":
              img = `<div class="tooltip" data-tooltip="${estadolabel}"><img src="../images/g_estado.svg" alt="${estadolabel}"></div>`;
              break;
            case "send":
              img = `<div class="tooltip" data-tooltip="${estadolabel}"><img src="../images/hubspot.svg" alt="${estadolabel}"></div>`;
              break;
            case "orden":
              img = `<div class="tooltip" data-tooltip="${estadolabel}"><img src="../images/booqable.svg" alt="${estadolabel}"></div>`;
              break;
            default:
              img = `<div class="tooltip" data-tooltip="${estadolabel}"><img src="../images/g_estado.svg" alt="${estadolabel}"></div>`;
              break;
          }
          const estado_cotizacionValue = estado_cotizacion?.value ?? null;
          const estado_cotizacionlabel = estado_cotizacion?.label ?? null;
          if (estado_cotizacionValue === null) {
          } else {
            switch (estado_cotizacionValue) {
              case "save":
                check = `<div class="tooltip" data-tooltip="${estado_cotizacionlabel}"><img src="../images/guardado.svg" alt="${estado_cotizacionlabel}"></div>`;
                break;
              case "send":
                check = `<div class="tooltip" data-tooltip="${estado_cotizacionlabel}"><img src="../images/enviado.svg" alt="${estado_cotizacionlabel}"></div>`;
                break;
              case "orden":
                check = `<div class="tooltip" data-tooltip="${estado_cotizacionlabel}"><img src="../images/abierto.svg" alt="${estado_cotizacionlabel}"></div>`;
                break;
              default:
                check = `<div class="tooltip" data-tooltip="${estado_cotizacionlabel}"><img src="../images/guardado.svg" alt="${estado_cotizacionlabel}"></div>`;
                break;
            }
          }

          tableTbody.innerHTML += `<tr><td>${id}-${
            version ? version : "1"
          }</td><td>${rendered}</td><td>${fechaNatural(
            fecha_inicial_de_rodaje
          )} - ${fechaNatural(
            fecha_final_de_rodaje
          )}</td><td>${formatToCurrency(
            total,
            moneda
          )}</td><td> ${img}</td><td> ${check}</td><td> <a target="_blank" href="/cotizaciones/admin/cotizacion-${id}">Ver cotización</a><a href="editar-cotizacion/${id}">Editar cotización</a></td></tr>`;
        }
      });
      tableTbody.classList.remove("loading");
    })
    .then(() => {
      anime({
        targets: "#prices tbody tr",
        easing: "easeInOutExpo",
        opacity: 1,
        delay: function (el, i, l) {
          return i * 100;
        },
        endDelay: function (el, i, l) {
          return (l - i) * 100;
        },
      });
    })
    .catch((err) => {
      console.error("Error getPrices()", err);
    });
}
async function queryWP(
  endpoint,
  body = "",
  method = "GET",
  extra = [],
  cache = false
) {
  let query = { langcode: this.language };
  // Ruta donde se va a guardar todos los archivos de CACHE
  const cacheAbsoluteRoute =
    "/home3/newlab/public_html/garciarental/cotizaciones/cache";
  // Validación de la variable $extra para colocar queryParams en el ENDPOINT
  if (extra.length > 0) {
    const extraParams = {};
    extra.forEach((param) => {
      const [key, value] = param.split("=");
      extraParams[key] = value;
    });
    query = { ...query, ...extraParams };
  }
  
  const queryString = new URLSearchParams(query).toString();
  const url = `https://admin.nlabph.com/wp-json/wp/v2/${endpoint}?${queryString}`;
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
  };
  if (method === "POST" || method === "PUT") {
    options.body = JSON.stringify(body);
  }
    const response = await fetch(url, options);
    return await response.json();
  
}

// GET ITEMS WP
function getItems(page) {
  const tableTbody = document.querySelector("#items tbody");

  tableTbody.classList.add("loading");
  const { result } = queryWP(`garcia-equipos?per_page=${perPage}&page=${page}`);

  tableTbody.innerHTML = ""; // Limpiar la tabla antes de llenarla con nuevos datos

  result
    .then((response) => {
      response.forEach(
        ({
          title: { rendered },
          acf: {
            nombre_item,
            imagen_principal,
            peso_en_gr,
            marca,
            modelo,
            serial,
            id_hubspot,
            id_booqable,
          },
        }) => {
          tableTbody.innerHTML += `<tr><td>${rendered}</td><td>${nombre_item}</td><td>${peso_en_gr}</td><td>${marca}</td><td>${modelo}</td><td>${serial}</td><td>${id_hubspot}</td><td>${id_booqable}</td><tr>`;
        }
      );
      tableTbody.classList.remove("loading");
      anime({
        targets: "#items tbody tr",
        easing: "easeInOutExpo",
        opacity: 1,
        delay: function (el, i, l) {
          return i * 5;
        },
        endDelay: function (el, i, l) {
          return (l - i) * 5;
        },
      });
    })
    .catch((err) => {
      console.error("Error getItems()", err);
    });
}
function updatePagination() {
  const pageNumbers = document.querySelectorAll(".pageNumbers");

  // Calculamos los números de página a mostrar en la paginación
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 10);

  if (endPage - startPage < 10) {
    startPage = Math.max(1, endPage - 10);
  }

  // Generamos los enlaces de los números de página
  let pageLinks = "";
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      pageLinks += `<button type="button" class="active">${i}</button>`;
    } else {
      pageLinks += `<button type="button" onclick="goToPage(${i})">${i}</button>`;
    }
  }

  // Mostramos los enlaces en el div "pageNumbers"
  pageNumbers[0].innerHTML = pageLinks;
  pageNumbers[1].innerHTML = pageLinks;
}
function goToPage(page) {
  if (page !== currentPage && page >= 1 && page <= totalPages) {
    currentPage = page;
    getItems(currentPage);
    updatePagination();
  }
}
// Función para establecer los valores del formulario y opciones seleccionadas en los selects
function setFormValues(formData) {
  for (const field in formData) {
    const element = document.getElementById(field);
    if (element) {
      if (element.tagName === "SELECT") {
        establecerValorSeleccionado(element.id, formData[field]);
        // Actualizar el texto en el elemento select-selected del custom-select
        const customSelect = element.parentElement;
        const selectSelected = customSelect.querySelector(".select-selected");
        const selectedIndex = element.selectedIndex;
        if (selectSelected) {
          selectSelected.innerHTML = element.options[selectedIndex].innerHTML;
        }
      } else if (element.type === "checkbox") {
        // Si el elemento es un checkbox
        element.checked = formData[field]; // Establecer su estado de verificación basado en el valor de formData
      } else {
        element.value = formData[field];
      }
    }
  }
}

// GET EQUIPOS WP
async function fetchEquiposData(equipos) {
  
  const equipoPromises = equipos.map(({ ID }) => {
    return query(`garcia-grupos`, `?idGroup=${ID}`).result.then(
      ({ title: { rendered }, acf: { precio_por_dia, max_discount } }) => {
        let precioPorDefecto = document.querySelector("#coin_val").value;
        let max_discount_val = max_discount ? max_discount : 99;
        return {
          name: rendered,
          max_discount: max_discount_val,
          price:
            precio_por_dia[precioPorDefecto] *
            document.querySelector("#totaldays").value,
          id: ID,
          dolares: precio_por_dia.dolares,
          euros: precio_por_dia.euros,
          pesos_colombianos: precio_por_dia.pesos_colombianos,
        };
      }
    );
  });

  return await Promise.all(equipoPromises);
}
// ADD EQUIPOS TO FORM
async function addEquiposToForm(equipos) {
  try {
    const equiposData = await fetchEquiposData(equipos);
    equiposData.forEach((data) => addNewItemToForm(data));
    document.querySelector(".itemList").classList.remove("loading");
  } catch (error) {
    console.error("Error fetching equipos data:", error);
  }
}
// ADD SERVICES TO FORM
async function addServicesToForm(services) {
  try {
    const equiposData = await fetchEquiposData(equipos);
    equiposData.forEach((data) => addNewItemToForm(data));
    document.querySelector(".itemList").classList.remove("loading");
  } catch (error) {
    console.error("Error fetching equipos data:", error);
  }
}
function addFormasdePagoToForm(formasDePago) {
  const listContainer = document.querySelector(".paylist ul");
  const listItems = document.querySelectorAll(".paylist ul li");
  formasDePago.forEach((data, i) => {
    let newItem = document.createElement("li");
    newItem.innerHTML = `<span><label for="desc-${i}">Descripción:</label><textarea name="desc-${i}" id="desc-${i}">${data.descripcion}</textarea></span><span class="aditionalDiscount"><label for="desc-${i}">Descuento adicional:</label><span class="flex"><input type="number" name="additionaldiscount-${i}" id="additionaldiscount-${i}" onchange="totalPriceDiscount(this, '.totalWithDiscount-${i}')" value="${data.descuento_adicional}">%</span></span><span><p>El precio total sera de <small class="totalWithDiscount-${i}">$0.00</small></p></span>`;
    listContainer.appendChild(newItem);
    // Llamar a totalPriceDiscount después de agregar el nuevo elemento
    console.log(newItem.querySelector(`#additionaldiscount-${i}`));
    totalPriceDiscount(
      newItem.querySelector(`#additionaldiscount-${i}`),
      `.totalWithDiscount-${i}`
    );
  });
  document.querySelector(".itemList").classList.remove("loading");
}
function calcularDiferenciaEnDias(fechaInicial, fechaFinal) {
  // Convierte las cadenas de fecha en objetos Date
  const startDate = new Date(fechaInicial);
  const endDate = new Date(fechaFinal);

  // Calcula la diferencia en milisegundos entre las fechas
  const differenceInMilliseconds = endDate - startDate;

  // Calcula la diferencia en días dividiendo entre la cantidad de milisegundos en un día (86400000)
  const differenceInDays = differenceInMilliseconds / 86400000;

  return differenceInDays;
}
// GET SINGLE LEAD
function getSingleLead(idLead) {
  document.querySelector(`form#createCotizacion`).reset();
  document
    .querySelector(`form#createCotizacion .content`)
    .classList.add("loading");
  document.querySelector(".itemList").innerHTML = "";
  document.querySelector(".itemList").classList.add("loading");
  const { result } = query(`garcia-leads`, `?idLead=${idLead}`);
  result
    .then(
      ({
        title: { rendered: articleTitle },
        acf: {
          correo,
          equipos,
          fecha_final_de_rodaje,
          fecha_inicial_de_rodaje,
          telefono,
          idioma: { value: idiomaValue },
          ida,
          regreso,
        },
      }) => {
        const differenceInDays = calcularDiferenciaEnDias(
          fecha_inicial_de_rodaje,
          fecha_final_de_rodaje
        ); // Get current date
        var currentDate = new Date();

        // Extract year, month, and day
        var year = currentDate.getFullYear();
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
        var day = ("0" + currentDate.getDate()).slice(-2);

        // Format into yyyy-MM-dd
        var formattedDate = year + "-" + month + "-" + day;
        // Datos que quieres asignar a los campos del formulario
        const formData = {
          name: articleTitle,
          email: correo,
          phone: telefono,
          start: fecha_inicial_de_rodaje,
          end: fecha_final_de_rodaje,
          coin_val: "pesos_colombianos",
          lang_val: idiomaValue,
          totaldays: ida && regreso ? differenceInDays + 1 : differenceInDays,
          recogida_equipos: formattedDate,
          entrega_equipos: formattedDate,
          ida,
          regreso,
        };
        setFormValues(formData);
        document.querySelector("span.emailUser").innerHTML = correo;
        return equipos;
      }
    )
    .then((equipos) => {
      document
        .querySelector(`form#createCotizacion .content`)
        .classList.remove("loading");
      addEquiposToForm(equipos);
    })
    .catch((err) => {
      console.error(err);
    });
  // Asociar el evento de cambio del checkbox a la función para actualizar impuestosValue
  document
    .querySelector("#impuestoscheck")
    .addEventListener("change", actualizarImpuestosValue);
}

// Ejemplo de uso
function formatDate(
  inputDate,
  inputFormat = "dd/MM/yyyy",
  outputFormat = "yyyy-MM-dd"
) {
  // Parse the input date string based on the input format
  var parsedDate = parseDate(inputDate, inputFormat);

  // Format the parsed date into the output format
  var formattedDate = formatDateToString(parsedDate, outputFormat);

  return formattedDate;
}

function parseDate(dateString, format) {
  // Split the date string based on the separator ("/" in this case)
  var parts = dateString.split("/");
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // Subtract 1 for zero-based month
  var year = parseInt(parts[2], 10);

  // Return a new Date object with the parsed values
  return new Date(year, month, day);
}

function formatDateToString(date, format) {
  // Format the date based on the output format
  var formattedDate = format
    .replace("yyyy", date.getFullYear())
    .replace("MM", ("0" + (date.getMonth() + 1)).slice(-2))
    .replace("dd", ("0" + date.getDate()).slice(-2));

  return formattedDate;
}
// GET SINGLE PRICE
function getSinglePrice(idPrice) {
  document.querySelector(`form#createCotizacion`).reset();
  document
    .querySelector(`form#createCotizacion .content`)
    .classList.add("loading");
  document.querySelector(".itemList").innerHTML = "";
  document.querySelector(".itemList").classList.add("loading");
  const { result } = query(`garcia-price`, `?idPrice=${idPrice}`);
  result
    .then(
      ({
        title,
        acf: {
          nombre,
          email,
          equipos,
          fechas_de_rodaje: { desde, hasta },
          telefono,
          idioma,
          ida,
          cargo_del_contacto,
          regreso,
          incluir_condiciones_transporte,
          incluir_informacion_de_crew,
          incluir_informacion_de_seguros,
          fechas_equipos: { entrega, recogida },
          iva,
          productor,
          project,
          subtotal,
          total,
          totaldays,
          moneda,
          version,
          viajes,
          formas_de_pago,
          dop,
          dias_standby,
          vendedor,
        },
      }) => {
        const differenceInDays = calcularDiferenciaEnDias(desde, hasta); // Get current date
        var currentDate = new Date();

        // Extract year, month, and day
        var year = currentDate.getFullYear();
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
        var day = ("0" + currentDate.getDate()).slice(-2);

        // Format into yyyy-MM-dd
        var formattedDate = year + "-" + month + "-" + day;
        // Datos que quieres asignar a los campos del formulario
        const formData = {
          name: nombre,
          email,
          phone: telefono,
          start: formatDate(desde),
          end: formatDate(hasta),
          totaldays: ida && regreso ? differenceInDays + 1 : differenceInDays,
          entrega_equipos: formatDate(entrega),
          recogida_equipos: formatDate(recogida),
          ida,
          regreso,
          cargo_del_contacto,
          dop,
          email,
          lang_val: idioma,
          transporte: incluir_condiciones_transporte,
          seguros: incluir_informacion_de_crew,
          crew: incluir_informacion_de_seguros,
          impuestos: iva,
          coin_val: moneda,
          productor,
          project,
          subtotal,
          telefono,
          total,
          totaldays,
          version,
          vendedor: vendedor[0].ID,
        };

        setFormValues(formData);
        document.querySelector("span.emailUser").innerHTML = email;
        return {
          formas_de_pago,
          equipos: equipos.map((eq) => eq.equipo).flat(),
          dias_standby: dias_standby.map((dias) => dias.fecha_stand_by),
          viajes: viajes.map((viaje) => ({
            date: viaje.fecha_viaje,
            destination: viaje.destino,
          })),
        };
      }
    )
    .then(({ formas_de_pago, equipos, dias_standby, viajes }) => {
      increaseDayStandBy(dias_standby);
      increaseTravels(viajes);
      document
        .querySelector(`form#createCotizacion .content`)
        .classList.remove("loading");
      addEquiposToForm(equipos);
      addFormasdePagoToForm(formas_de_pago);
    })
    .catch((err) => {
      console.error(err);
    });
  // Asociar el evento de cambio del checkbox a la función para actualizar impuestosValue
  document
    .querySelector("#impuestoscheck")
    .addEventListener("change", actualizarImpuestosValue);
}
function actualizarFechaEntrega() {
  var recogida = document.getElementById("recogida_equipos").value;
  var entregaInput = document.getElementById("entrega_equipos");

  // Establecer la fecha mínima de entrega como la fecha de recogida
  entregaInput.min = recogida;

  // Si la fecha de entrega es menor que la nueva fecha mínima, restablecerla
  if (entregaInput.value < recogida) {
    entregaInput.value = recogida;
  }
}
let transporteValues = null;
let crewValues = null;
// Función reutilizable para obtener y procesar los valores del servicio
function processService(serviceId, values) {
  if (!values) {
    const { result } = query(`garcia-services`, `?idService=${serviceId}`);
    result.then(
      ({ id, title: { rendered }, acf: { precio_por_dia, max_discount } }) => {
        let precioPorDefecto = document.querySelector("#coin_val").value;
        let max_discount_val = max_discount ? max_discount : 99;
        values = {
          name: rendered,
          max_discount: max_discount_val,
          price:
            precio_por_dia[precioPorDefecto] *
            document.querySelector("#totaldays").value,
          id,
          dolares: precio_por_dia.dolares,
          euros: precio_por_dia.euros,
          pesos_colombianos: precio_por_dia.pesos_colombianos,
        };
        // Asignar el objeto 'values' a la variable correspondiente
        if (serviceId === 1456) {
          transporteValues = values;
        } else if (serviceId === 1454) {
          crewValues = values;
        }
        addNewServiceToForm(values);
      }
    );
  } else {
    addNewServiceToForm(values);
  }
}
function fechaNatural(date) {
  moment.locale("es");
  // Fecha en formato ISO
  const fechaISO = date;
  // Crear un objeto moment con la fecha
  const fechaMoment = moment(fechaISO);
  // Obtener la representación natural de la fecha
  const fechaNatural = fechaMoment.format("D [de] MMMM [de] YYYY");
  // Mostrar la fecha natural en el HTML
  return fechaNatural;
}
// Obtener el formulario por su ID
const miFormulario = document.getElementById("createCotizacion");
if (miFormulario) {
  // Agregar un evento al formulario cuando se envíe
  miFormulario.addEventListener("submit", async (event) => {
    miFormulario.classList.add("loading");
    miFormulario.style.opacity = ".5";
    event.preventDefault(); // Evitar el envío por defecto del formulario
    // Crear un arreglo para almacenar los items
    const items = [];
    // Obtener los valores del formulario usando FormData
    const formData = new FormData(event.target);
    // Iterar a través de los campos del formulario
    for (const [clave, valor] of formData.entries()) {
      // Buscar el número de índice y el tipo de campo (finditemid, finditem, price) en el ID
      const match = clave.match(/^(finditemid|finditem|price)-(\d+)$/);

      if (match) {
        const tipoCampo = match[1];
        const indice = match[2];

        // Obtener el índice del item dentro del arreglo (o crearlo si no existe)
        if (!items[indice]) {
          items[indice] = { id: "", name: "", price: "" };
        }

        // Agregar el valor al item correspondiente según el tipo de campo
        switch (tipoCampo) {
          case "finditemid":
            items[indice].id = valor;
            break;
          case "finditem":
            items[indice].name = valor;
            break;
          case "price":
            items[indice].price = valor;
            break;
          default:
            break;
        }
      }
    }

    // Filtrar el arreglo para eliminar elementos vacíos (caso de campos faltantes)
    const itemsFiltrados = items.filter(
      (item) => item.id && item.name && item.price
    );
    // Obtener los otros campos del formulario y agregarlos al objeto
    const otrosCampos = {};
    formData.forEach((valor, clave) => {
      if (!clave.match(/^(finditemid|finditem|price)-\d+$/)) {
        otrosCampos[clave] = valor;
      }
    });
    // Crear el objeto final con los equipos en una propiedad llamada "equipos"
    const resultadoFinal = {
      equipos: itemsFiltrados,
      ...otrosCampos,
    };
    // Mostrar el resultado en la consola
    const equipoIds = resultadoFinal.equipos.map((equipo) => ({
      equipo: equipo.id,
      dias: document.querySelector(
        `.itemList li[data-id="${equipo.id}"] .daysTotal input`
      ).value,
      descuento: document.querySelector(`.itemList li[data-id="${equipo.id}"]`)
        .dataset.descuento,
    }));
    let fechasStandby = [];
    let formasdepago = [];
    let viajes = [];
    let servicios = [];
    document.querySelectorAll(".standbydates input").forEach((fecha) => {
      fechasStandby.push({ fecha_stand_by: fecha.value });
    });
    document.querySelectorAll(".paylist ul li").forEach((pay) => {
      formasdepago.push({
        descripcion: pay.querySelector("textarea").value,
        descuento_adicional: pay.querySelector("input").value,
      });
    });
    document.querySelectorAll(".travelsdates .flex").forEach((travel, i) => {
      viajes.push({
        fecha_viaje: document.querySelector(`#traveldate-${i}`).value,
        destino: document.querySelector(`#traveldestino-${i}`).value,
        tipo_de_viaje: travel.querySelector("input").value,
      });
    });
    document.querySelectorAll(".serviceList li").forEach((service, i) => {
      servicios.push({
        servicio: service.querySelector(
          `#findserviceid-${service.dataset.counter}`
        ).value,
        dias: service.querySelector(`#daysValue-${service.dataset.counter}`)
          .value,
        descuento: service.querySelector(
          `#discountservice-${service.dataset.counter}`
        ).value,
      });
    });
    const newData = {
      title: resultadoFinal.name,
      status: "publish",
      fields: {
        cargo_del_contacto: resultadoFinal.cargo_del_contacto,
        correo: resultadoFinal.email,
        dias_standby: fechasStandby,
        dop: resultadoFinal.dop,
        email: resultadoFinal.email,
        equipos: equipoIds,
        estado: resultadoFinal.estado,
        estado_cotizacion: resultadoFinal.estado,
        fecha_final_de_rodaje: resultadoFinal.end,
        fecha_inicial_de_rodaje: resultadoFinal.start,
        fechas_de_rodaje: {
          desde: resultadoFinal.start,
          hasta: resultadoFinal.end,
        },
        fechas_equipos: {
          entrega: resultadoFinal.entrega_equipos,
          recogida: resultadoFinal.recogida_equipos,
        },
        formas_de_pago: formasdepago,
        idioma: resultadoFinal.lang_val,
        impuestos: resultadoFinal.impuestos,
        incluir_condiciones_transporte: resultadoFinal.transporte,
        incluir_informacion_de_crew: resultadoFinal.crew,
        incluir_informacion_de_seguros: resultadoFinal.seguros,
        iva: resultadoFinal.impuestos,
        lead_relacionado: idLead,
        moneda: resultadoFinal.coin_val,
        nombre: resultadoFinal.name,
        productor: resultadoFinal.productor,
        project: resultadoFinal.project,
        servicios: servicios,
        subtotal: resultadoFinal.subtotal,
        telefono: resultadoFinal.phone,
        total: resultadoFinal.total,
        totaldays: resultadoFinal.totaldays,
        version: "1",
        vendedor: resultadoFinal.vendedor,
        viajes: viajes,
      },
    };
    // Enviar resultado a Wordpress
    const { result, controller } = query("garcia-price", "", "POST", newData);

    if (document.getElementById("estado").value == "enviada") {
      result.then(async (response) => {
        const requestOptions = {
          method: "POST",
          body: JSON.stringify(newData),
        };
        const makeWebHook = await fetch(
          "https://hook.us1.make.com/zw537mheu5q4wlxuoeqpejqi6uuwseik",
          requestOptions
        );
        const makeWebHookResponse = await makeWebHook.text();
        const sendEmail = await fetch(
          `https://nlabph.com/cotizaciones/s/sendEmail/?correo=${resultadoFinal.email}&idcot=${response.id}`
        );
        const sendEmailData = await sendEmail.text();
        console.log({ makeWebHookResponse, sendEmailData, response });
      });
    }

    result.finally(() => {
      miFormulario.classList.remove("loading");
      location.href = "/cotizaciones/admin/listado-cotizaciones";
    });
  });
}
function enviarCotizacion() {
  document.getElementById("estado").value = "enviada";
}
function convertirEnOrden() {
  document.getElementById("estado").value = "orden";
}
function removeItem(id = "", btn) {
  if (id == "") {
    btn.parentElement.remove();
    updateGlobalPrices();
  } else {
    document.querySelector(`[data-id="${id}"]`).remove();
    updateGlobalPrices();
  }
}
const createCustomSelect = (customSelect) => {
  const selectElement = customSelect.querySelector("select");
  const selectOptions = Array.from(selectElement.options);

  const createDiv = (className, innerHTML) => {
    const div = document.createElement("DIV");
    div.setAttribute("class", className);
    div.innerHTML = innerHTML;
    return div;
  };

  const createOptionDiv = (option) => {
    const div = createDiv("select-item", option.innerHTML);
    div.addEventListener("click", (e) => {
      const selectedOption = e.target.innerHTML;
      const selectedIndex = selectOptions.findIndex(
        (opt) => opt.innerHTML === selectedOption
      );
      selectElement.selectedIndex = selectedIndex;
      selectSelected.innerHTML = selectedOption;
      closeAllSelect();
    });
    return div;
  };

  const selectSelected = createDiv(
    "select-selected",
    selectOptions[selectElement.selectedIndex].innerHTML
  );
  customSelect.appendChild(selectSelected);

  const selectItems = createDiv("select-items select-hide", "");

  for (const option of selectOptions.slice(1)) {
    selectItems.appendChild(createOptionDiv(option));
  }
  customSelect.appendChild(selectItems);

  selectSelected.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllSelect();
    selectItems.classList.toggle("select-hide");
    selectSelected.classList.toggle("select-arrow-active");
  });
};
const closeAllSelect = () => {
  const selectItems = document.querySelectorAll(".select-items");
  const selectSelected = document.querySelectorAll(".select-selected");

  for (const item of selectItems) {
    item.classList.add("select-hide");
  }

  for (const selected of selectSelected) {
    selected.classList.remove("select-arrow-active");
  }
};

document.addEventListener("click", closeAllSelect);

const decreaseButtonStandby = document.getElementById(`standby-decrease`);
const increaseButtonStandby = document.getElementById(`standby-increment`);

const totalDaysStandby = document.querySelector(`.standby-days span`);
const totalDaysInputStandby = document.querySelector(`#totalStandbyDays`);
const realTotalDaysInputStandby = document.querySelector(
  `#realtotalStandbyDays`
);

function increaseDayStandBy(datesArray) {
  let days = parseFloat(realTotalDaysInputStandby.value);
  realTotalDaysInputStandby.value = days;
  totalDaysInputStandby.value = days / 2;
  let valueDays = parseFloat(document.getElementById("totaldays").value);
  document.getElementById("totaldays").value = valueDays + 0.5;

  document
    .querySelectorAll(".admin main .itemList li .daysTotal input")
    .forEach((el, i) => {
      let value1 = parseFloat(el.value);
      el.value = value1 + 0.5;
      const totalDays = document.querySelector(`.total-${i}`);
      totalDays.textContent =
        el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
      document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
        el.value % 1 === 0 ? `días` : `días y medio`;
    });
  const standbyDates = document.querySelector(".standbydates");
  const newElementIndex = document.querySelectorAll(
    ".standbydates .flex"
  ).length;

  // Recorremos el array de fechas
  datesArray.forEach((date, index) => {
    const newElementHTML = `<span class="flex" id="standbyflex-${
      newElementIndex + index
    }">
       <input type="date" name="standbydate-${
         newElementIndex + index
       }" value="${date}">
       <button class="remove" type="button" onclick="removeElement(this)">
           <img src="../images/delete.svg" alt="delete">
       </button>
   </span>`;
    standbyDates.insertAdjacentHTML("beforeend", newElementHTML);
  });
  totalDaysStandby.textContent = datesArray.length;
  totalDaysStandby.nextElementSibling.innerHTML = `días`;

  updateAlEquiposPrices();
}

function updateAlEquiposPrices() {
  const totalDaysInput = document.getElementById(`totaldays`);
  document
    .querySelectorAll(".admin main .itemList li")
    .forEach((newItem, i) => {
      // Obtener el número de días ingresado por el usuario (asegúrate de que "totalDaysInput" esté definido)
      const days = parseFloat(totalDaysInput.value);
      // Obtener el precio por día desde el atributo "data-*" del elemento "newItem" (asegúrate de que "newItem" esté definido)
      const pricePerDay = parseFloat(
        newItem.dataset[document.getElementById("coin_val").value]
      );
      // Obtener el descuento desde el atributo "data-descuento" del elemento "newItem" (asegúrate de que "newItem" esté definido)
      const elementDiscount = parseFloat(newItem.dataset.descuento);
      // Calcular el precio base multiplicando los días por el precio por día
      let priceBase = (days * pricePerDay).toFixed(2);
      // Aplicar el descuento al precio base
      let totalPriceWithDiscount =
        priceBase - (priceBase * elementDiscount) / 100;
      // Actualizar el valor del elemento de precio con el resultado final
      const priceInput = document.getElementById(`price-${i}`);
      priceInput.value = totalPriceWithDiscount;
    });
  // Actualizar otras variables globales o elementos relacionados con el precio (si es necesario)
  updateGlobalPrices();
}
if (decreaseButtonStandby || increaseButtonStandby) {
  decreaseButtonStandby.addEventListener("click", () => {
    let days = parseFloat(realTotalDaysInputStandby.value);
    days -= 1;
    realTotalDaysInputStandby.value = days;
    totalDaysInputStandby.value = days / 2;
    let valueDays = parseFloat(document.getElementById("totaldays").value);
    document.getElementById("totaldays").value = valueDays - 0.5;

    document
      .querySelectorAll(".admin main .itemList li .daysTotal input")
      .forEach((el, i) => {
        let value1 = parseFloat(el.value);
        el.value = value1 - 0.5;
        const totalDays = document.querySelector(`.total-${i}`);
        totalDays.textContent =
          el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
        document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
          el.value % 1 === 0 ? `días` : `días y medio`;
      });
    document
      .querySelector(
        `#standbyflex-${
          document.querySelectorAll(".standbydates .flex").length - 1
        }`
      )
      .remove();
    totalDaysStandby.textContent = days;
    totalDaysStandby.nextElementSibling.innerHTML = `días`;
    updateAlEquiposPrices();
  });
  increaseButtonStandby.addEventListener("click", () => {
    let days = parseFloat(realTotalDaysInputStandby.value);
    days += 1;
    realTotalDaysInputStandby.value = days;
    totalDaysInputStandby.value = days / 2;
    let valueDays = parseFloat(document.getElementById("totaldays").value);
    document.getElementById("totaldays").value = valueDays + 0.5;

    document
      .querySelectorAll(".admin main .itemList li .daysTotal input")
      .forEach((el, i) => {
        let value1 = parseFloat(el.value);
        el.value = value1 + 0.5;
        const totalDays = document.querySelector(`.total-${i}`);
        totalDays.textContent =
          el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
        document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
          el.value % 1 === 0 ? `días` : `días y medio`;
      });

    // Agregar un nuevo elemento a la lista de fechas de espera
    const standbyDates = document.querySelector(".standbydates");
    const newElementIndex = document.querySelectorAll(
      ".standbydates .flex"
    ).length;
    const newElementHTML = `<span class="flex" id="standbyflex-${newElementIndex}">
       <input type="date" name="standbydate-${newElementIndex}" id="standbydate-${newElementIndex}">
       <button class="remove" type="button" onclick="removeElement(this)">
           <img src="../images/delete.svg" alt="delete">
       </button>
   </span>`;
    standbyDates.insertAdjacentHTML("beforeend", newElementHTML);

    totalDaysStandby.textContent = days;
    totalDaysStandby.nextElementSibling.innerHTML = `días`;
    updateAlEquiposPrices();
  });
}

const decreaseButtontravels = document.getElementById(`travels-decrease`);
const increaseButtontravels = document.getElementById(`travels-increment`);

const totalDaystravels = document.querySelector(`.travels-days span`);
const totalDaysInputtravels = document.querySelector(`#totaltravelsDays`);
const realTotalDaysInputtravels = document.querySelector(
  `#realtotaltravelsDays`
);

const increaseTravels = (travelsArray) => {
  realTotalDaysInputtravels;
  let valueDays = parseFloat(document.getElementById("totaldays").value);
  document.getElementById("totaldays").value = valueDays + 0.5;

  document
    .querySelectorAll(".admin main .itemList li .daysTotal input")
    .forEach((el, i) => {
      let value1 = parseFloat(el.value);
      el.value = value1 + 0.5;
      const totalDays = document.querySelector(`.total-${i}`);
      totalDays.textContent =
        el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
      document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
        el.value % 1 === 0 ? `días` : `días y medio`;
    });

  // Agregar nuevos elementos a la lista de viajes
  const travelsDates = document.querySelector(".travelsdates");
  const newElementIndex = document.querySelectorAll(
    ".travelsdates .flex"
  ).length;

  // Recorremos el array de viajes
  travelsArray.forEach((travel, index) => {
    const newElementHTML = `<div class="flex" id="travelflex-${
      newElementIndex + index
    }">
       <span>
           <label for="traveldate-${newElementIndex + index}">Fecha</label>
           <input type="date" name="traveldate-${
             newElementIndex + index
           }" id="traveldate-${newElementIndex + index}" value="${travel.date}">
       </span>
       <span>
           <label for="traveldestino-${
             newElementIndex + index
           }">Destino:</label>
           <input type="text" name="traveldestino-${
             newElementIndex + index
           }" id="traveldestino-${newElementIndex + index}" value="${
      travel.destination
    }">
       </span>
       <button class="remove" type="button" onclick="removeElement(this)">
           <img src="../images/delete.svg" alt="delete">
       </button>
   </div>`;
    travelsDates.insertAdjacentHTML("beforeend", newElementHTML);
    updateDisplayedValue();
  });
};

function updateAlEquiposPrices() {
  const totalDaysInput = document.getElementById(`totaldays`);
  document
    .querySelectorAll(".admin main .itemList li")
    .forEach((newItem, i) => {
      // Obtener el número de días ingresado por el usuario (asegúrate de que "totalDaysInput" esté definido)
      const days = parseFloat(totalDaysInput.value);
      // Obtener el precio por día desde el atributo "data-*" del elemento "newItem" (asegúrate de que "newItem" esté definido)
      const pricePerDay = parseFloat(
        newItem.dataset[document.getElementById("coin_val").value]
      );
      // Obtener el descuento desde el atributo "data-descuento" del elemento "newItem" (asegúrate de que "newItem" esté definido)
      const elementDiscount = parseFloat(newItem.dataset.descuento);
      // Calcular el precio base multiplicando los días por el precio por día
      let priceBase = (days * pricePerDay).toFixed(2);
      // Aplicar el descuento al precio base
      let totalPriceWithDiscount =
        priceBase - (priceBase * elementDiscount) / 100;
      // Actualizar el valor del elemento de precio con el resultado final
      const priceInput = document.getElementById(`price-${i}`);
      priceInput.value = totalPriceWithDiscount;
    });
  // Actualizar otras variables globales o elementos relacionados con el precio (si es necesario)
  updateGlobalPrices();
}
// Función para actualizar el valor visual en la interfaz
function updateDisplayedValue() {
  let days = parseFloat(realTotalDaysInputtravels.value);
  totalDaystravels.textContent = days;
  totalDaystravels.nextElementSibling.innerHTML = `días`;
  updateAlEquiposPrices();
}
if (decreaseButtontravels || increaseButtontravels) {
  decreaseButtontravels.addEventListener("click", () => {
    let days = parseFloat(realTotalDaysInputtravels.value);
    days -= 1;
    realTotalDaysInputtravels.value = days;
    totalDaysInputtravels.value = days / 2;
    let valueDays = parseFloat(document.getElementById("totaldays").value);
    document.getElementById("totaldays").value = valueDays - 0.5;
    updateDisplayedValue();
    document
      .querySelectorAll(".admin main .itemList li .daysTotal input")
      .forEach((el, i) => {
        let value1 = parseFloat(el.value);
        el.value = value1 - 0.5;
        const totalDays = document.querySelector(`.total-${i}`);
        totalDays.textContent =
          el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
        document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
          el.value % 1 === 0 ? `días` : `días y medio`;
      });
    document
      .querySelector(
        `#travelflex-${
          document.querySelectorAll(".travelsdates .flex").length - 1
        }`
      )
      .remove();
  });

  increaseButtontravels.addEventListener("click", () => {
    let days = parseFloat(realTotalDaysInputtravels.value);
    days += 1;
    realTotalDaysInputtravels.value = days;
    totalDaysInputtravels.value = days / 2;
    let valueDays = parseFloat(document.getElementById("totaldays").value);
    document.getElementById("totaldays").value = valueDays + 0.5;
    updateDisplayedValue();
    document
      .querySelectorAll(".admin main .itemList li .daysTotal input")
      .forEach((el, i) => {
        let value1 = parseFloat(el.value);
        el.value = value1 + 0.5;
        const totalDays = document.querySelector(`.total-${i}`);
        totalDays.textContent =
          el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
        document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
          el.value % 1 === 0 ? `días` : `días y medio`;
      });

    // Agregar un nuevo elemento a la lista de viajes
    const travelsDates = document.querySelector(".travelsdates");
    const newElementIndex = document.querySelectorAll(
      ".travelsdates .flex"
    ).length;
    const newElementHTML = `<div class="flex" id="travelflex-${newElementIndex}">
       <span>
           <label for="traveldate-${newElementIndex}">Fecha</label>
           <input type="date" name="traveldate-${newElementIndex}" id="traveldate-${newElementIndex}">
       </span>
       <span>
           <label for="traveldestino-${newElementIndex}">Destino:</label>
           <input type="text" name="traveldestino-${newElementIndex}" id="traveldestino-${newElementIndex}">
       </span>
       <button class="remove" type="button" onclick="removeElement(this)">
           <img src="../images/delete.svg" alt="delete">
       </button>
   </div>`;
    travelsDates.insertAdjacentHTML("beforeend", newElementHTML);
  });
}

function addOrRemoveDays(isChecked) {
  const totalDaysElement = document.getElementById("totaldays");
  let totalDays = parseInt(totalDaysElement.value);

  if (isChecked) {
    totalDays = totalDays - 1;
  } else {
    totalDays = totalDays + 1;
  }

  totalDaysElement.value = totalDays;
}

function removeElement(element) {
  let days = parseFloat(realTotalDaysInputtravels.value);
  days -= 1;
  realTotalDaysInputtravels.value = days;
  totalDaysInputtravels.value = days / 2;
  let valueDays = parseFloat(document.getElementById("totaldays").value);
  document.getElementById("totaldays").value = valueDays - 0.5;
  updateDisplayedValue();
  document
    .querySelectorAll(".admin main .itemList li .daysTotal input")
    .forEach((el, i) => {
      let value1 = parseFloat(el.value);
      el.value = value1 - 0.5;
      const totalDays = document.querySelector(`.total-${i}`);
      totalDays.textContent =
        el.value % 1 === 0 ? `${el.value}` : `${Math.floor(el.value)}`;
      document.querySelector(`.total-${i}`).nextElementSibling.innerHTML =
        el.value % 1 === 0 ? `días` : `días y medio`;
    });
  element.parentElement.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#vendedor")) {
    getSellers();
  }
  if (document.getElementById("transporte")) {
    document.getElementById("transporte").addEventListener("change", (e) => {
      if (e.target.checked) {
        processService(1456, transporteValues);
      } else {
        removeItem(1456);
      }
      updateGlobalPrices();
    });
  }
  if (document.getElementById("crew")) {
    document.getElementById("crew").addEventListener("change", (e) => {
      if (e.target.checked) {
        processService(1454, crewValues);
      } else {
        removeItem(1454);
      }
      updateGlobalPrices();
    });
  }
  if (document.querySelector("#leads")) {
    getLeads();
    document.title = "SOLICITUDES RECIBIDAS";
  }
  if (document.querySelector("#prices")) {
    document.title = "COTIZACIONES";
    getPrices();
  }
  if (document.querySelector("#items")) {
    // Llenar la tabla con los datos de la página actual al cargar la página
    getItems(currentPage);
    updatePagination();

    // Event listeners para los botones "Página Anterior" y "Página Siguiente"
    document.querySelector(".btnPrev").addEventListener("click", () => {
      goToPage(currentPage - 1);
    });

    document.querySelector(".btnNext").addEventListener("click", () => {
      goToPage(currentPage + 1);
    });
  }
  if (typeof idLead !== "undefined" && idLead !== null) {
    document.title = "CREAR COTIZACIÓN";
    getSingleLead(idLead);
  }

  setCredits("#000", "garcia");
  setTimeout(() => {
    const customSelects = document.querySelectorAll(".custom-select");
    for (const customSelect of customSelects) {
      createCustomSelect(customSelect);
    }
  }, 1000);
});

// Función para agregar una clase cuando se hace scroll más allá de un límite
function agregarClaseCuandoScrollSuperaLimite(elemento, limite, clase) {
  // Obtén una referencia al elemento que deseas controlar
  var elementoControlado = document.querySelector(elemento);

  // Agrega un evento scroll al elemento
  window.addEventListener("scroll", function () {
    // Obtiene la posición actual del scroll
    var scrollY = window.scrollY || window.pageYOffset;

    // Comprueba si la posición actual del scroll supera el límite
    if (scrollY > limite) {
      // Si sí, agrega la clase al elemento
      elementoControlado.classList.add(clase);
    } else {
      // Si no, quita la clase del elemento
      elementoControlado.classList.remove(clase);
    }
  });
}
if (document.querySelector(".grid-container .right")) {
  agregarClaseCuandoScrollSuperaLimite(".grid-container .right", 200, "fixed");
}

// Agregar animación al abrir y cerrar los detalles
var detalles = document.getElementById("miDetails");
document.querySelectorAll("details").forEach((detailEl) => {
  detailEl.addEventListener("toggle", function () {
    if (detalles.open) {
      detalles.style.maxHeight = detalles.scrollHeight + "px";
    } else {
      detalles.style.maxHeight = null;
    }
  });
});

async function getEquiposCotizacion() {
  document.querySelector(".equipos").classList.add("loading");
  document.querySelector(".equipos").style.opacity = ".5";
  const equiposContainer = document.querySelector(".equipos .equipo");
  let equiposHTML = "";

  // Array para almacenar promesas de consultas
  const queries = [];
  for (const item of equiposList) {
    // Agregar consulta a la lista de promesas
    queries.push(query(`garcia-grupos`, `?idGroup=${item.equipo[0].ID}`));
  }

  // Esperar a que todas las consultas se completen
  const responses = await Promise.all(queries);

  for (let i = 0; i < responses.length; i++) {
    const { result } = await responses[i];
    const responseEquipos = await result;
    const item = equiposList[i]; // Accede al elemento correspondiente en equiposList
    // Resto del procesamiento y construcción del HTML
    const {
      title: { rendered },
      acf: { categoria, precio_por_dia, list_items },
    } = responseEquipos;
    const primeraCategoria = categoria[0];
    const { name: categoriaName } = primeraCategoria;
    console.log(categoriaName);

    // Array para almacenar promesas de consultas de elementos individuales
    const itemQueries = [];

    if (list_items) {
      for (const element of list_items) {
        itemQueries.push(queryWP(`garcia-equipos/${element.items.item[0].ID}`));
      }
    }
    // Esperar a que todas las consultas de elementos individuales se completen
    const itemResponses = await Promise.all(itemQueries);
    let listaHTML = "";
    for (const [index, responsePromise] of itemResponses.entries()) {
      const result  = await responsePromise;
      listaHTML += `<li><p>${result.acf.nombre_item.toLowerCase()}</p><small>x${list_items[index].items.cantidad}</small></li>`;
    }
    const descuento = parseFloat(item.descuento);
    const dias = parseFloat(item.dias);
    let precioConDescuento =
      precio_por_dia[moneda] - (precio_por_dia[moneda] * descuento) / 100;
      precioConDescuento = precioConDescuento * dias;
    const template = `
    <article class="single-equipo">
    <span class="category">${categoriaName}</span>
    <details open>
        <summary>  ${rendered}  <img src="images/arrow.svg" alt="arrow"></summary>
        <div class="content">
          <ul>
            ${listaHTML}
          </ul>
            <div class="priceday">
                <label for="">Precio x día</label>
                <input readonly type="text" value="${formatToCurrency(
                  precio_por_dia[moneda],
                  moneda
                )}">
                <label for="">Precio x ${dias > 1 ? `${Math.trunc(dias)} ${dias % 1 === 0 ? `días` : `días y medio`}`:`${Math.trunc(dias)} día`}</label>
                <input readonly type="text" value="${formatToCurrency(
                  precio_por_dia[moneda] * dias,
                  moneda
                )}">
                    <label for="">Precio con descuento <strong>-${descuento}%</strong></label>
                    <input readonly type="text" value="${formatToCurrency(
                      precioConDescuento,
                      moneda
                    )}">
            </div>
        </div>
    </details>
    </article>
      `;
    equiposHTML += template;
  }

  // Actualizar el contenedor de equipos con el HTML construido
  equiposContainer.innerHTML = equiposHTML;
  document.querySelector(".equipos").classList.remove("loading");
  document.querySelector(".equipos").style.opacity = "1";
}

// async function getEquiposCotizacion() {
//   document.querySelector(".equipos").classList.add("loading");
//   document.querySelector(".equipos").style.opacity = ".5";
//   const equiposContainer = document.querySelector(".equipos .equipo");
//   let equiposHTML = "";

//   for (const item of equiposList) {
//     const { result } = await query(`garcia-grupos/${item.equipo[0].ID}`);
//     const response = await result;

//     const {
//       title: { rendered },
//       acf: { categoria, precio_por_dia, list_items },
//     } = response;

//     const primeraCategoria = categoria[0];
//     const { name: categoriaName } = primeraCategoria;

//     let listaHTML = "";
//     if (list_items) {
//       for (const element of list_items) {
//         const { result } = await query(
//           `garcia-equipos/${element.items.item[0].ID}`
//         );
//         const response = await result;
//         listaHTML += `<li><p>${response.acf.nombre_item}</p><small>x${element.items.cantidad}</small></li>`;
//       }
//     }

//     // <span class="category">${categoriaName}</span>
//     const template = `

//       <details open>
//           <summary>  ${rendered}  <img src="images/arrow.svg" alt="arrow"></summary>
//           <div class="content">
//             <ul>
//               ${listaHTML}
//             </ul>
//               <div class="priceday">
//                   <h4 class="uppercase">resumen y descuento</h4>
//                   <label for="">Precio x día</label>
//                   <input readonly type="text" value="${formatToCurrency(
//                     precio_por_dia[moneda],
//                     moneda
//                   )}">
//                   <div class="discount">
//                       <label for="">Precio con descuento <strong>-${
//                         item.descuento
//                       }%</strong></label>
//                       <input readonly type="text" value="$1’000.000">
//                   </div>
//               </div>
//           </div>
//       </details>
//       `;
//     equiposHTML += template;
//   }

//   equiposContainer.innerHTML = equiposHTML;
//   document.querySelector(".equipos").classList.remove("loading");
//   document.querySelector(".equipos").style.opacity = "1";
// }

if (document.querySelector(".equipos .equipo")) {
  getEquiposCotizacion();
}


const gridContainer = document.getElementById('grid-container');
const endMarker = document.getElementById('end-marker');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Intersection observed, you've reached the end
      document.querySelector('.resumen').classList.add('absolute');
      // Implement your logic here, like fetching more items or appending new content
    } else {
      // Entry is not intersecting, remove the class
      document.querySelector('.resumen').classList.remove('absolute');
    }
  });
});

// Start observing the end marker
observer.observe(endMarker);