import productos from '../data/products.js';

let siguienteId = productos.length + 1;
let idEdicionActual = null;
let carrito = [];

function mostrarProductos(listaProductos) {
	const contenedorTarjetas = document.getElementById('contenedorTarjetasProducto');
	if (!contenedorTarjetas) {
		console.error('No se encontró el elemento #contenedorTarjetasProducto en el DOM.');
		return;
	}
	contenedorTarjetas.innerHTML = '';
	listaProductos.forEach(producto => {
		const columna = document.createElement('div');
		columna.className = 'col-md-4 mb-4';
		columna.innerHTML = '<div class="card h-100">'
			+ '<img src="' + producto.imagen + '" class="card-img-top" alt="' + producto.nombre + '" />'
			+ '<div class="card-body">'
			+ '<h5 class="card-title">' + producto.nombre + '</h5>'
			+ '<p class="card-text"><strong>Precio:</strong> $' + producto.precio + '</p>'
			+ '<p class="card-text"><strong>Origen:</strong> ' + producto.pais + '</p>'
			+ '</div>'
			+ '<div class="card-footer">'
			+ '<button class="btn btn-success" onclick="agregarAlCarrito(' + producto.id + ')">Agregar al carrito</button>'
			+ '<button class="btn btn-warning" onclick="abrirModalEdicion(' + producto.id + ')">Editar</button>'
			+ '<button class="btn btn-danger" onclick="eliminarProducto(' + producto.id + ')">Eliminar</button>'
			+ '</div>'
			+ '</div>';
		contenedorTarjetas.appendChild(columna);
	});
}

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

function quitarDelCarrito(id) {
	carrito = carrito.filter(item => item.id !== id);
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
		boton.onclick = togglePanelCarrito;
		document.body.appendChild(boton);
	}
	const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
	const cantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
	boton.innerHTML = `🛒 Carrito (${cantidad})<br><strong>Total: $${total}</strong>`;

		let panel = document.getElementById('panel-carrito');
		if (!panel) {
			panel = document.createElement('div');
			panel.id = 'panel-carrito';
			panel.style.position = 'fixed';
			panel.style.bottom = '80px';
			panel.style.right = '32px';
			panel.style.zIndex = '2001';
			panel.style.background = 'rgba(255,255,255,0.98)';
			panel.style.padding = '24px 20px 20px 20px';
			panel.style.borderRadius = '16px';
			panel.style.boxShadow = '0 8px 32px rgba(44,62,80,0.22)';
			panel.style.display = 'none';
			panel.style.minWidth = '300px';
			panel.style.maxWidth = '360px';
			panel.style.fontFamily = 'Segoe UI, Arial, sans-serif';
			panel.style.color = '#222';
			panel.style.transition = 'box-shadow 0.2s';
			document.body.appendChild(panel);
		}
		var html = '<div style="position:absolute;top:10px;right:14px;cursor:pointer;font-size:22px;color:#888;" onclick="window.cerrarPanelCarrito()" title="Cerrar">&times;</div>';
		html += '<h4 style="margin-top:0;margin-bottom:16px;font-weight:600;color:#2c3e50;">Carrito de compras</h4>';
		if (carrito.length === 0) {
			html += '<p style="color:#888;text-align:center;">El carrito está vacío.</p>';
		} else {
			html += '<ul style="list-style:none;padding:0;margin-bottom:12px;">';
			for (var i = 0; i < carrito.length; i++) {
				var item = carrito[i];
				html += '<li style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;background:#f7f7f7;padding:8px 10px;border-radius:8px;">'
					+ '<span style="font-weight:500;">' + item.nombre + '</span>'
					+ '<span style="margin-left:8px;color:#555;">x' + item.cantidad + '</span>'
					+ '<button onclick="window.quitarDelCarrito(' + item.id + ')" style="margin-left:12px;background:#e74c3c;border:none;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:13px;">Quitar</button>'
					+ '</li>';
			}
			html += '</ul>';
			html += '<div style="margin-top:8px;font-weight:bold;font-size:16px;text-align:right;">Total: $' + total + '</div>';
			html += '<button onclick="window.irATicket()" class="btn btn-success" style="margin-top:18px;width:100%;font-size:16px;border-radius:8px;">Ir al ticket</button>';
		}
		panel.innerHTML = html;
window.cerrarPanelCarrito = function() {
	let panel = document.getElementById('panel-carrito');
	if (panel) {
		panel.style.display = 'none';
	}
};
}

function togglePanelCarrito() {
	let panel = document.getElementById('panel-carrito');
	if (panel) {
		panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
	}
}

window.quitarDelCarrito = quitarDelCarrito;
window.irATicket = function() {
	localStorage.setItem('carrito', JSON.stringify(carrito));
	window.location.href = 'ticket.html';
};

function abrirResumenCarrito() {
	window.irATicket();
}

window.agregarAlCarrito = agregarAlCarrito;

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
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener('DOMContentLoaded', function() {
	mostrarProductos(productos);

	const formularioProducto = document.getElementById('formularioProducto');
	if (formularioProducto) {
		formularioProducto.addEventListener('submit', function (e) {
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
			formularioProducto.reset();
			alert('Producto agregado correctamente.');
		});
	}

	const saveEditBtn = document.getElementById('saveEditBtn');
	if (saveEditBtn) {
		saveEditBtn.addEventListener('click', guardarProductoEditado);
	}

	const searchBar = document.getElementById('barraBusqueda');
	if (searchBar) {
		searchBar.addEventListener('input', function() {
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

