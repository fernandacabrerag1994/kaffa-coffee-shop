import { useState, useEffect } from 'react'
import './App.css'
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del Pool de conexiones para MySQL (Railway / Local)
const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '123456789',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 1. Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.precio_chico, p.precio_mediano, p.precio_grande, p.precio, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 2. NUEVA RUTA: Registrar una nueva compra del carrito
app.post('/api/pedidos', (req, res) => {
  const { cliente_nombre, total, carrito } = req.body;

  // Guardar la orden principal
  const queryPedido = 'INSERT INTO pedidos (cliente_nombre, total) VALUES (?, ?)';

  db.query(queryPedido, [cliente_nombre || 'Cliente Kaffa', total], (err, resultadoPedido) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar el pedido: ' + err.message });
    }

    const pedidoId = resultadoPedido.insertId;

    // Guardar los productos asociados en detalle_pedidos
    const detalleQuery = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?';

    const valoresDetalle = carrito.map(item => [
      pedidoId,
      item.id,
      item.cantidad,
      item.precio
    ]);

    db.query(detalleQuery, [valoresDetalle], (errDetalle) => {
      if (errDetalle) {
        return res.status(500).json({ error: 'Error al guardar los productos del carrito: ' + errDetalle.message });
      }

      res.json({ mensaje: '¡Pedido registrado con éxito!', pedidoId: pedidoId });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});