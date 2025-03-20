import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route,Routes, Switch } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Navbar from './components/navbar';
import './styles.css';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setOrders([...orders, orderWithId]);

    console.log('Nuevo pedido creado', orderWithId);
  };

  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return(
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<OrderForm addOrder={addOrder} />} />
            <Route path="/reception" 
              element={<OrderList orders={orders} updateOrderStatus={updateOrderStatus} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
