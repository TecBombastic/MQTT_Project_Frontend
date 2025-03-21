import mqtt from "mqtt";

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
  }

  connect(brokerUrl = "", options = {}) {
    try {
      const defaultOptions = {
        clientId:
          "restaurant_frontend_" + Math.random().toString(16).substr(2, 8),
        username: "",
        password: "",
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      };

      const mqttOptions = { ...defaultOptions, ...options };

      this.client = mqtt.connect(brokerUrl, mqttOptions);

      this.client.on("connect", () => {
        console.log("Conectado a MQTT broker");
        this.isConnected = true;

        this.client.subscribe(Object.values(this.topics), (err) => {
          if (err) {
            console.error("Error al suscribirse a tópicos:", err);
          } else {
            console.log("Suscrito a tópicos de órdenes");
          }
        });

        if (this.callbacks.onConnect) {
          this.callbacks.onConnect();
        }
      });

      this.client.on("message", (topic, message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log("Mensaje recibido en tópico:", topic, parsedMessage);

          if (this.callbacks.onMessage) {
            this.callbacks.onMessage(topic, parsedMessage);
          }
        } catch (error) {
          console.error("Error al procesar mensaje MQTT:", error);
        }
      });

      this.client.on("error", (err) => {
        console.error("Error MQTT:", err);
        this.isConnected = false;

        if (this.callbacks.onError) {
          this.callbacks.onError(err);
        }
      });

      this.client.on("offline", () => {
        console.log("MQTT cliente desconectado");
        this.isConnected = false;
      });

      return true;
    } catch (error) {
      console.error("Error al conectar con MQTT:", error);
      return false;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log("🔌 Desconectado de MQTT broker");
    }
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Publicar un nuevo pedido en MQTT
   */
  publishNewOrder(order) {
    if (this.client && this.isConnected) {
      const payload = JSON.stringify(order);
      this.client.publish(this.topics.NEW_ORDER, payload);
      console.log("Pedido publicado en MQTT:", order);
    } else {
      console.warn("No conectado a MQTT. No se pudo publicar el pedido.");
    }
  }

  /**
   * Publicar actualización de estado de un pedido
   */
  publishOrderUpdate(orderId, status) {
    if (this.client && this.isConnected) {
      const payload = JSON.stringify({ orderId, status });
      this.client.publish(this.topics.UPDATE_ORDER, payload);
      console.log("Estado del pedido actualizado en MQTT:", { orderId, status });
    } else {
      console.warn("No conectado a MQTT. No se pudo actualizar el pedido.");
    }
  }
}

export default new MQTTService();
