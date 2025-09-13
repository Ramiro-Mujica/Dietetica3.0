import productos from '../data/products.js';

let siguienteId = productos.length + 1;
let idEdicionActual = null;



function mostrarProductos(listaProductos) {
  const contenedorTarjetas = document.getElementById('contenedorTarjetasProducto');
  contenedorTarjetas.innerHTML = '';

  listaProductos.forEach(producto => {
    const columna = document.createElement('div');
    columna.className = 'col-md-4 mb-4';

    columna.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
          <p class="card-text"><strong>Origen:</strong> ${producto.pais}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-success" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
          <button class="btn btn-warning" onclick="abrirModalEdicion(${producto.id})">Editar</button>
          <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      </div>
    `;
let carrito = [];

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  mostrarCarritoFlotante();
}

function mostrarCarritoFlotante() {
  let boton = document.getElementById('carrito-flotante');
  if (!boton) {
    boton = document.createElement('button');
    boton.id = 'carrito-flotante';
    boton.className = 'btn btn-success';
    boton.style.position = 'fixed';
    boton.style.bottom = '32px';
    boton.style.right = '32px';
    boton.style.zIndex = '2000';
    boton.style.boxShadow = '0 4px 16px rgba(44,62,80,0.18)';
    boton.onclick = abrirResumenCarrito;
    document.body.appendChild(boton);
  }
  const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  const cantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  boton.innerHTML = `🛒 Carrito (${cantidad})<br><strong>Total: $${total}</strong>`;
}

function abrirResumenCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  window.location.href = 'ticket.html';
}

window.agregarAlCarrito = agregarAlCarrito;

    contenedorTarjetas.appendChild(columna);
  });
}

function abrirModalEdicion(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  idEdicionActual = id;

  document.getElementById('editarId').value = producto.id;
  document.getElementById('editarNombre').value = producto.nombre;
  document.getElementById('editarPrecio').value = producto.precio;
  document.getElementById('editarPais').value = producto.pais;
  const vistaImagen = document.getElementById('editImagePreview');
  if (vistaImagen) {
    vistaImagen.src = producto.imagen;
  }

  $('#editModal').modal('show');
}

function guardarProductoEditado() {
  const producto = productos.find(p => p.id === idEdicionActual);
  if (!producto) return;

  const inputNombre = document.getElementById('editarNombre');
  const inputPrecio = document.getElementById('editarPrecio');
  const inputPais = document.getElementById('editarPais');
  const inputImagen = document.getElementById('editImageFile');

  const nuevoNombre = inputNombre.value.trim();
  const nuevoPrecio = parseInt(inputPrecio.value);
  const nuevoPais = inputPais.value.trim();
  const nuevoArchivoImagen = inputImagen ? inputImagen.files[0] : null;

  if (!nuevoNombre) {
    alert('El nombre no puede estar vacío.');
    inputNombre.focus();
    return;
  }
  if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
    alert('El precio debe ser mayor a cero.');
    inputPrecio.focus();
    return;
  }
  if (!nuevoPais) {
    alert('El país no puede estar vacío.');
    inputPais.focus();
    return;
  }

    producto.nombre = nuevoNombre;
    producto.precio = nuevoPrecio;
    producto.pais = nuevoPais;
    if (nuevoArchivoImagen) {
      producto.imagen = URL.createObjectURL(nuevoArchivoImagen);
    }

    mostrarProductos(productos);
    $('#editModal').modal('hide');
    alert('Producto editado correctamente.');
}

function eliminarProducto(id) {
  const indice = productos.findIndex(p => p.id === id);
  if (indice !== -1) {
    productos.splice(indice, 1);
    mostrarProductos(productos);
    alert('Producto eliminado correctamente.');
  }
}

function limpiarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos(productos);

  document.getElementById('formularioProducto').addEventListener('submit', function (e) {
    e.preventDefault();
    const inputNombre = document.getElementById('nombreProducto');
    const inputPrecio = document.getElementById('precioProducto');
    const inputPais = document.getElementById('paisProducto');
    const inputImagen = document.getElementById('archivoImagenProducto');

    const nombre = inputNombre.value.trim();
    const precio = parseInt(inputPrecio.value);
    const pais = inputPais.value.trim();
    const archivoImagen = inputImagen.files[0];

    if (!nombre) {
      alert('El nombre no puede estar vacío.');
      inputNombre.focus();
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      alert('El precio debe ser mayor a cero.');
      inputPrecio.focus();
      return;
    }
    if (!pais) {
      alert('El país no puede estar vacío.');
      inputPais.focus();
      return;
    }
    if (!archivoImagen) {
      alert('Debes seleccionar una imagen.');
      inputImagen.focus();
      return;
    }

    const urlImagen = URL.createObjectURL(archivoImagen);
    const nuevoProducto = {
      id: siguienteId++,
      nombre,
      precio,
      pais,
      imagen: urlImagen,
      tipo: '',
    };
    productos.push(nuevoProducto);
    mostrarProductos(productos);
    document.getElementById('formularioProducto').reset();
    alert('Producto agregado correctamente.');
  });
  const saveEditBtn = document.getElementById('saveEditBtn');
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', guardarProductoEditado);
  }

  const searchBar = document.getElementById('barraBusqueda');
  if (searchBar) {
    searchBar.addEventListener('input', () => {
      const searchInput = limpiarTexto(searchBar.value);
      const filtrados = productos.filter(producto =>
        limpiarTexto(producto.nombre).includes(searchInput)
      );
      mostrarProductos(filtrados);
    });
  }

  window.abrirModalEdicion = abrirModalEdicion;
  window.eliminarProducto = eliminarProducto;
});
