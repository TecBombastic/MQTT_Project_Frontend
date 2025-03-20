import { connect } from 'mqtt';

class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.topics = {
      NEW_ORDER: 'restaurant/orders/new',
      UPDATE_ORDER: 'restaurant/orders/update'
    };
    this.callbacks = {
      onConnect: () => {},
      onMessage: () => {},
      onError: () => {}
    };
  }

  // Conectar al broker MQTT
  connect(brokerUrl = '', options = {}) {
    try {
      // Opciones por defecto
      const defaultOptions = {
        clientId: 'restaurant_frontend_' + Math.random().toString(16).substr(2, 8),
        username: '',
        password: '',
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000
      };

      // Combinar opciones
      const mqttOptions = { ...defaultOptions, ...options };
      
      // Conectar al broker
      this.client = connect(brokerUrl, mqttOptions);
      
      // Configurar eventos
      this.client.on('connect', () => {
        console.log('Conectado a MQTT broker');
        this.isConnected = true;
        
        // Suscribirse a tópicos relevantes
        this.client.subscribe(Object.values(this.topics), (err) => {
          if (err) {
            console.error('Error al suscribirse a tópicos:', err);
          } else {
            console.log('Suscrito a tópicos de órdenes');
          }
        });
        
        if (this.callbacks.onConnect) {
          this.callbacks.onConnect();
        }
      });
      
      this.client.on('message', (topic, message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log('Mensaje recibido en tópico:', topic, parsedMessage);
          
          if (this.callbacks.onMessage) {
            this.callbacks.onMessage(topic, parsedMessage);
          }
        } catch (error) {
          console.error('Error al procesar mensaje MQTT:', error);
        }
      });
      
      this.client.on('error', (err) => {
        console.error('Error MQTT:', err);
        this.isConnected = false;
        
        if (this.callbacks.onError) {
          this.callbacks.onError(err);
        }
      });
      
      this.client.on('offline', () => {
        console.log('MQTT cliente desconectado');
        this.isConnected = false;
      });
      
      return true;
    } catch (error) {
      console.error('Error al conectar con MQTT:', error);
      return false;
    }
  }
  
  // Publicar un nuevo pedido
  publishNewOrder(order) {
    if (!this.isConnected || !this.client) {
      console.error('No hay conexión con MQTT');
      return false;
    }
    
    try {
      const message = JSON.stringify(order);
      this.client.publish(this.topics.NEW_ORDER, message, { qos: 1, retain: false });
      console.log('Pedido publicado en MQTT:', order.id);
      return true;
    } catch (error) {
      console.error('Error al publicar pedido:', error);
      return false;
    }
  }
  
  // Publicar actualización de estado de un pedido
  publishOrderUpdate(orderId, status) {
    if (!this.isConnected || !this.client) {
      console.error('No hay conexión con MQTT');
      return false;
    }
    
    try {
      const update = {
        orderId,
        status,
        timestamp: new Date().toISOString()
      };
      const message = JSON.stringify(update);
      this.client.publish(this.topics.UPDATE_ORDER, message, { qos: 1, retain: false });
      console.log('Actualización de pedido publicada en MQTT:', orderId, status);
      return true;
    } catch (error) {
      console.error('Error al publicar actualización:', error);
      return false;
    }
  }
  
  // Desconectar del broker
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log('Desconectado de MQTT broker');
    }
  }
  
  // Configurar callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

export default new MQTTService();