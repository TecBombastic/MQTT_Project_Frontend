import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import Navbar from "./components/Navbar";
import MQTTService from "./MQTTService";
import "./styles.css";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [mqttError, setMqttError] = useState(null);

  // Configurar MQTT al iniciar la aplicación
  useEffect(() => {
    // Configurar callbacks de MQTT
    MQTTService.setCallbacks({
      onConnect: () => {
        console.log("MQTT conectado exitosamente");
        setMqttConnected(true);
        setMqttError(null);
      },
      onMessage: (topic, message) => {
        console.log("Mensaje MQTT recibido:", topic, message);

        // Procesar mensajes según el tópico
        if (topic === MQTTService.topics.NEW_ORDER) {
          // Añadir el nuevo pedido si no existe ya
          const orderExists = orders.some((order) => order.id === message.id);
          if (!orderExists) {
            setOrders((prevOrders) => [...prevOrders, message]);
          }
        } else if (topic === MQTTService.topics.UPDATE_ORDER) {
          // Actualizar el estado de un pedido existente
          if (message.orderId) {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === message.orderId
                  ? { ...order, status: message.status }
                  : order
              )
            );
          }
        }
      },
      onError: (error) => {
        console.error("Error en conexión MQTT:", error);
        setMqttConnected(false);
        setMqttError("Error de conexión MQTT: " + error.message);
      },
    });

    // Iniciar conexión con el broker MQTT
    // Nota: Cambia la URL según tu configuración de Mosquitto
    const connected = MQTTService.connect("");

    if (!connected) {
      setMqttError("No se pudo establecer conexión con el broker MQTT");
    }

    // Limpiar conexión al desmontar el componente
    return () => {
      MQTTService.disconnect();
    };
  }, [orders]);

  // Efecto para mantener sincronizada la lista de orders con localStorage
  useEffect(() => {
    // Cargar pedidos guardados al iniciar
    const savedOrders = localStorage.getItem("restaurantOrders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Error al cargar pedidos desde localStorage:", e);
      }
    }
  }, []);

  // Guardar pedidos en localStorage cuando cambian
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("restaurantOrders", JSON.stringify(orders));
    }
  }, [orders]);

  // Función para agregar nuevo pedido
  const addOrder = (newOrder) => {
    // Generar ID único y agregar campos adicionales
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    // Actualizar estado local
    setOrders((prevOrders) => [...prevOrders, orderWithId]);

    // Publicar en MQTT si está conectado
    if (mqttConnected) {
      MQTTService.publishNewOrder(orderWithId);
    } else {
      console.warn(
        "MQTT no conectado. El pedido se guardó localmente pero no se publicó."
      );
    }

    return orderWithId;
  };

  // Función para actualizar el estado de un pedido
  const updateOrderStatus = (id, newStatus) => {
    // Actualizar estado local
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    // Publicar en MQTT si está conectado
    if (mqttConnected) {
      MQTTService.publishOrderUpdate(id, newStatus);
    } else {
      console.warn(
        "MQTT no conectado. El pedido se actualizó localmente pero no se publicó."
      );
    }

    return updatedOrders.find((order) => order.id === id);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar mqttConnected={mqttConnected} />

        {mqttError && (
          <div className="alert alert-error mqtt-alert">
            {mqttError}
            <button onClick={() => setMqttError(null)} className="close-alert">
              ×
            </button>
          </div>
        )}

        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <OrderForm addOrder={addOrder} mqttConnected={mqttConnected} />
              }
            />
            <Route
              path="/reception"
              element={
                <OrderList
                  orders={orders}
                  updateOrderStatus={updateOrderStatus}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
