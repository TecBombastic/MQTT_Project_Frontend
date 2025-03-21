import mqtt from "mqtt";

/**
 * Servicio para gestionar la comunicación MQTT en la aplicación.
 * Proporciona métodos para conectar, publicar y recibir mensajes del broker MQTT,
 * así como sincronizar pedidos con la API de backend.
 */
class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.topics = {
      NEW_ORDER: "restaurant/orders/new",
      UPDATE_ORDER: "restaurant/orders/update",
    };
    this.callbacks = {
      onConnect: () => {},
      onMessage: () => {},
      onError: () => {},
    };
    this.apiUrl = process.env.REACT_APP_API_URL;
  }


  /**
   * Establece conexión con el broker MQTT.
   * @param {string} brokerUrl - URL del broker MQTT
   * @param {Object} options - Opciones de conexión adicionales
   * @returns {boolean} Estado de la conexión
   */
  connect(brokerUrl, options = {}) {
    try {
      const defaultOptions = {
        clientId:
          "restaurant_frontend_" + Math.random().toString(16).substr(2, 8),
        username: process.env.REACT_APP_MQTT_USER,
        password: process.env.REACT_APP_MQTT_PASS,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      };

      const mqttOptions = { ...defaultOptions, ...options };

      this.client = mqtt.connect(brokerUrl, mqttOptions);

      this.client.on("connect", () => {
        this.isConnected = true;

        this.client.subscribe(Object.values(this.topics), (err) => {
          if (err) {
            console.error("Error al suscribirse a tópicos:", err);
          }
        });

        if (this.callbacks.onConnect) {
          this.callbacks.onConnect();
        }
      });

      this.client.on("message", (topic, message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          
          if (this.callbacks.onMessage) {
            this.callbacks.onMessage(topic, parsedMessage);
          }
        } catch (error) {
          console.error("Error al procesar mensaje MQTT:", error);
        }
      });

      this.client.on("error", (err) => {
        this.isConnected = false;

        if (this.callbacks.onError) {
          this.callbacks.onError(err);
        }
      });

      this.client.on("offline", () => {
        this.isConnected = false;
      });

      return true;
    } catch (error) {
      console.error("Error al conectar con MQTT:", error);
      return false;
    }
  }


  /**
   * Desconecta el cliente MQTT.
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
    }
  }


  /**
   * Configura callbacks para eventos MQTT.
   * @param {Object} callbacks - Objeto con funciones callback para eventos
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }


  /**
   * Transforma el formato del pedido al requerido por la API.
   * @param {Object} order - Pedido en formato de la aplicación
   * @returns {Object} Pedido transformado para la API
   */
  transformOrderForAPI(order) {
    const productos = order.items.map(item => ({
      producto: item.name,
      cantidad: parseInt(item.quantity),
      precio: parseFloat(item.price),
      nota: item.notes || ""
    }));

    return {
      nombre: order.clientName,
      mesa: parseInt(order.table),
      productos: productos
    };
  }


  /**
   * Publica un nuevo pedido en MQTT y lo guarda en la API.
   * @param {Object} order - Datos del pedido a publicar
   * @returns {Promise<Object>} Resultado de la operación API
   */
  async publishNewOrder(order) {
    if (this.client && this.isConnected) {
      // Publicar en MQTT con el formato original
      const mqttPayload = JSON.stringify(order);
      this.client.publish(this.topics.NEW_ORDER, mqttPayload);

      // Transformar y guardar el pedido en la base de datos a través del API
      try {
        const apiPayload = this.transformOrderForAPI(order);

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error al guardar el pedido en la base de datos:", error);
        if (this.callbacks.onError) {
          this.callbacks.onError(new Error("Error al guardar en API: " + error.message));
        }
      }
    }
  }


  /**
   * Publica una actualización de estado de un pedido.
   * @param {string} orderId - Identificador del pedido
   * @param {string} status - Nuevo estado del pedido
   */
  publishOrderUpdate(orderId, status) {
    if (this.client && this.isConnected) {
      const payload = JSON.stringify({ orderId, status });
      this.client.publish(this.topics.UPDATE_ORDER, payload);
    }
  }
}

export default new MQTTService();