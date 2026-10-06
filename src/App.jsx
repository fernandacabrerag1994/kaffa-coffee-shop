import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')

  // Obtener los productos desde la base de datos de MySQL
  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al conectar con la API:', err))
  }, [])

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto])
  }

  const total = carrito.reduce((sum, item) => sum + Number(item.precio), 0)

  // Filtrado dinámico de productos
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter((p) => p.categoria === categoriaSeleccionada)

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>☕ Kaffa Coffee Shop</h1>
      <h2>Catálogo de Productos</h2>

      {/* Botones de Filtro */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['Todas', 'Café', 'Bebidas', 'Repostería'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: categoriaSeleccionada === cat ? '#5a3825' : '#f0e6df',
              color: categoriaSeleccionada === cat ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos cargados desde MySQL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {productosFiltrados.map((prod) => (
          <div
            key={prod.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <h3>{prod.nombre}</h3>
            <p><strong>Categoría:</strong> {prod.categoria}</p>
            <p style={{ fontWeight: 'bold', color: '#2e7d32' }}>${prod.precio} MXN</p>
            <button
              onClick={() => agregarAlCarrito(prod)}
              style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      {/* Carrito de Compras */}
      <div style={{ marginTop: '40px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
        <h2>🛒 Carrito ({carrito.length})</h2>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div>
            <ul>
              {carrito.map((item, index) => (
                <li key={index}>
                  {item.nombre} - ${item.precio} MXN
                </li>
              ))}
            </ul>
            <h3>Total: ${total} MXN</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default App