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

/**
 * Componente principal de la aplicación de gestión de comandas.
 * Maneja el estado global de pedidos y la conexión con el servicio MQTT.
 */
function App() {
  const [orders, setOrders] = useState([]);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [mqttError, setMqttError] = useState(null);
  const [apiError, setApiError] = useState(null);

  
  useEffect(() => {
    // Configurar callbacks para el servicio MQTT
    MQTTService.setCallbacks({
      onConnect: () => {
        setMqttConnected(true);
        setMqttError(null);
      },
      onMessage: (topic, message) => {
        // Procesar mensajes según el tópico
        if (topic === MQTTService.topics.NEW_ORDER) {
          const orderExists = orders.some((order) => order.id === message.id);
          if (!orderExists) {
            setOrders((prevOrders) => [...prevOrders, message]);
          }
        } else if (topic === MQTTService.topics.UPDATE_ORDER) {
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
        // Distinguir entre errores de MQTT y errores de API
        if (error.message.includes("API")) {
          setApiError("Error al guardar en la base de datos: " + error.message);
          // Limpiar el mensaje de error después de 5 segundos
          setTimeout(() => setApiError(null), 5000);
        } else {
          setMqttConnected(false);
          setMqttError("Error de conexión MQTT: " + error.message);
        }
      },
    });

    // Iniciar conexión con el broker MQTT
    const connected = MQTTService.connect(process.env.REACT_APP_MQTT_BROKER);

    if (!connected) {
      setMqttError("No se pudo establecer conexión con el broker MQTT");
    }

    // Limpiar conexión al desmontar el componente
    return () => {
      MQTTService.disconnect();
    };
  }, [orders]);


  useEffect(() => {
    // Cargar pedidos guardados desde localStorage al iniciar
    const savedOrders = localStorage.getItem("restaurantOrders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Error al cargar pedidos desde localStorage:", e);
      }
    }
  }, []);


  useEffect(() => {
    // Guardar pedidos en localStorage cuando cambian
    if (orders.length > 0) {
      localStorage.setItem("restaurantOrders", JSON.stringify(orders));
    }
  }, [orders]);


  /**
   * Agrega un nuevo pedido al sistema.
   * @param {Object} newOrder - Datos del nuevo pedido
   * @returns {Object} El pedido creado con ID y metadatos
   */
  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setOrders((prevOrders) => [...prevOrders, orderWithId]);

    if (mqttConnected) {
      MQTTService.publishNewOrder(orderWithId)
        .catch(error => {
          // Manejar errores adicionales que podrían ocurrir durante la operación
          console.error("Error al publicar pedido:", error);
          setApiError("Error al guardar en la base de datos: " + error.message);
          // Limpiar el mensaje de error después de 5 segundos
          setTimeout(() => setApiError(null), 5000);
        });
    }

    return orderWithId;
  };


  /**
   * Actualiza el estado de un pedido existente.
   * @param {string} id - Identificador del pedido
   * @param {string} newStatus - Nuevo estado del pedido
   * @returns {Object|undefined} El pedido actualizado o undefined si no se encuentra
   */
  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    if (mqttConnected) {
      MQTTService.publishOrderUpdate(id, newStatus);
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

        {apiError && (
          <div className="alert alert-warning api-alert">
            {apiError}
            <button onClick={() => setApiError(null)} className="close-alert">
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