import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // 1. Cargar los productos desde el Backend de Railway al iniciar la página
  useEffect(() => {
    fetch('https://kaffa-backend-production.up.railway.app/api/productos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("Los datos recibidos no son un arreglo:", data);
        }
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      if (itemExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1, precio: producto.precio || producto.precio_chico || 0 }];
    });
  };

  // Calcular el total del carrito
  const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // 2. Función para Finalizar Compra y enviarla al Backend de Railway
  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const datosCompra = {
      cliente_nombre: "Cliente Kaffa",
      total: totalCarrito,
      carrito: carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    fetch('https://kaffa-backend-production.up.railway.app/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCompra)
    })
      .then(res => res.json())
      .then(data => {
        if (data.pedidoId) {
          alert(`¡Compra realizada con éxito! Número de orden: ${data.pedidoId}`);
          setCarrito([]); // Vaciamos el carrito
        } else {
          alert("Hubo un error al registrar el pedido.");
        }
      })
      .catch(err => {
        console.error("Error en la compra:", err);
        alert("No se pudo conectar con el servidor.");
      });
  };

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>☕ Kaffa Coffee Shop</h1>
      <h2>Catálogo de Productos</h2>

      {/* Botones de Categorías */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['Todas', 'Café Caliente', 'Café Frío', 'Repostería'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: categoriaSeleccionada === cat ? '#6f4e37' : '#e0d0c0',
              color: categoriaSeleccionada === cat ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listado de Productos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {productosFiltrados.map(prod => (
          <div key={prod.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
            <h3>{prod.nombre}</h3>
            <p>Categoría: {prod.categoria}</p>
            <p><strong>${prod.precio || prod.precio_chico || 0}</strong></p>
            <button
              onClick={() => agregarAlCarrito(prod)}
              style={{
                backgroundColor: '#6f4e37',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* Sección del Carrito */}
      <h2>🛒 Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {carrito.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.nombre} (x{item.cantidad})</span>
                <span>${item.precio * item.cantidad}</span>
              </li>
            ))}
          </ul>
          <h3>Total: ${totalCarrito.toFixed(2)}</h3>
          <button
            onClick={finalizarCompra}
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}