import { useState } from 'react'
import './App.css'

const PRODUCTOS = [
  { id: 1, nombre: 'Café Americano', precio: 45, categoria: 'Café' },
  { id: 2, nombre: 'Cappuccino', precio: 60, categoria: 'Café' },
  { id: 3, nombre: 'Croissant de Almendra', precio: 55, categoria: 'Repostería' },
  { id: 4, nombre: 'Matcha Latte', precio: 70, categoria: 'Bebidas' },
  { id: 5, nombre: 'Mocka', precio: 50, categoria: 'Café' },
  { id: 6, nombre: 'Espresso', precio: 35, categoria: 'Café' },
  { id: 7, nombre: 'Flat White', precio: 55, categoria: 'Café' },
  { id: 8, nombre: 'Sweet Vanilla Latte', precio: 65, categoria: 'Café' },
  { id: 9, nombre: 'Pumpkin Spice', precio: 70, categoria: 'Bebidas' },
  { id: 10, nombre: 'Cardamomo Latte', precio: 65, categoria: 'Café' },
  { id: 11, nombre: 'Golden Milk', precio: 65, categoria: 'Bebidas' }
]

function App() {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto])
  }

  const total = carrito.reduce((sum, item) => sum + item.precio, 0)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>☕ Kaffa Coffee Shop</h1>

      <h2>Catálogo de Productos</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {PRODUCTOS.map((prod) => (
          <div key={prod.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '180px' }}>
            <h3>{prod.nombre}</h3>
            <p>${prod.precio} MXN</p>
            <button onClick={() => agregarAlCarrito(prod)}>Agregar al Carrito</button>
          </div>
        ))}
      </div>

      <hr style={{ margin: '30px 0' }} />

      <h2>🛒 Carrito de Compras ({carrito.length})</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>{item.nombre} - ${item.precio} MXN</li>
            ))}
          </ul>
          <h3>Total: ${total} MXN</h3>
        </div>
      )}
    </div>
  )
}

export default App