
document.addEventListener('DOMContentLoaded', function() {
  function getCarrito() {
    const data = localStorage.getItem('carrito');
    return data ? JSON.parse(data) : [];
  }

  function setFecha() {
    const fecha = new Date();
    const fechaStr = fecha.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    document.getElementById('ticket-fecha').textContent = 'Fecha: ' + fechaStr;
  }

  function mostrarTicket(carrito, cliente) {
    document.getElementById('datosCliente').style.display = 'none';
    document.getElementById('ticketDetalle').style.display = 'block';
    document.getElementById('ticket-fecha').textContent += ` | Cliente: ${cliente.nombre} | DNI: ${cliente.dni}`;

    const tbody = document.querySelector('#ticketProductos tbody');
    tbody.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio * item.cantidad}</td>
      `;
      tbody.appendChild(tr);
      total += item.precio * item.cantidad;
    });

    document.getElementById('ticketTotal').textContent = `TOTAL: $${total}`;
  }

  const datosClienteForm = document.getElementById('datosCliente');
  if (datosClienteForm) {
    datosClienteForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nombre = document.getElementById('clienteNombre').value.trim();
      const dni = document.getElementById('clienteDni').value.trim();
      const email = document.getElementById('clienteEmail').value.trim();

      if (!nombre || !dni || !email) {
        alert('Completa todos los datos del cliente.');
        return;
      }

      if (!/^\d{7,9}$/.test(dni)) {
        alert('El DNI debe contener solo números.');
        return;
      }

      const carrito = getCarrito();
      mostrarTicket(carrito, { nombre, dni, email });
    });
  }

  setFecha();
});