<<<<<<< HEAD
# MQTT_Proyect
Repositorio dedicado a la creación de un servicio de comandas empleando MQTT
=======
# Sistema de Comandas - Aplicación de Gestión de Pedidos para Restaurantes

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![MQTT](https://img.shields.io/badge/MQTT-5.10.4-green.svg)](https://mqtt.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.4.0-orange.svg)](https://reactrouter.com/)

## 📋 Descripción

Sistema de Comandas es una aplicación web moderna para la gestión de pedidos en restaurantes que utiliza el protocolo MQTT para comunicación en tiempo real. Permite crear y gestionar pedidos, visualizar su estado y mantener una sincronización entre los dispositivos conectados al sistema.

## ✨ Características

- **Comunicación en tiempo real** a través de MQTT
- **Diseño responsivo** adaptado a múltiples dispositivos
- **Persistencia local** de pedidos mediante localStorage
- **Sincronización con backend** a través de API REST
- **Visualización de estados** de pedidos (pendientes, completados, cancelados)
- **Gestión completa** de pedidos con productos y notas personalizadas

## 🛠️ Tecnologías Utilizadas

- **React 19.0.0**: Biblioteca de JavaScript para construir interfaces de usuario
- **React Router 7.4.0**: Sistema de enrutamiento para aplicaciones React
- **MQTT 5.10.4**: Protocolo de mensajería ligero para comunicación M2M (Machine to Machine)
- **CSS personalizado**: Estilos propios para una experiencia de usuario única

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/sistema-de-comandas.git
cd sistema-de-comandas
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación en modo desarrollo:
```bash
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación en tu navegador.

## 📦 Estructura del Proyecto

```
sistema-de-comandas/
│
├── public/               # Archivos públicos y HTML principal
│
├── src/                  # Código fuente
│   ├── components/       # Componentes React
│   │   ├── Navbar.js     # Barra de navegación
│   │   ├── OrderCard.js  # Tarjeta de pedido individual
│   │   ├── OrderForm.js  # Formulario para crear pedidos
│   │   ├── OrderList.js  # Lista de pedidos por estado
│   │   └── OrderModal.js # Modal con detalles del pedido
│   │
│   ├── MQTTService.js    # Servicio de comunicación MQTT
│   ├── App.js            # Componente principal
│   ├── App.css           # Estilos específicos de la aplicación
│   ├── styles.css        # Estilos globales
│   └── index.js          # Punto de entrada
│
└── package.json          # Dependencias y scripts
```

## 🔧 Configuración

### Conexión MQTT

La aplicación se conecta a un broker MQTT para la comunicación en tiempo real. La configuración se encuentra en `MQTTService.js`:

```javascript
// Broker MQTT por defecto
const connected = MQTTService.connect("ws://direccionMQTT:8080");
```

Para modificar la URL del broker o las credenciales de acceso, edita los valores en el método `connect` dentro del archivo `MQTTService.js`.

### API Backend

La aplicación se sincroniza con un backend a través de una API REST. La URL base se configura en `MQTTService.js`:

```javascript
this.apiUrl = variableAPI;
```

## 📱 Uso de la Aplicación

### Crear un Pedido

1. Navega a la página principal "Crear Pedido"
2. Completa los datos del cliente y mesa
3. Agrega productos con sus cantidades, precios y notas
4. Haz clic en "Enviar Pedido"

### Gestionar Pedidos

1. Navega a la sección "Recepción"
2. Visualiza los pedidos organizados por estado (pendientes, completados, cancelados)
3. Haz clic en un pedido para ver sus detalles
4. Cambia el estado del pedido según sea necesario

## 🔄 Flujo de Comunicación

1. **Creación de Pedido**:
   - El frontend crea el pedido y lo guarda localmente
   - Se publica un mensaje MQTT en el tópico `restaurant/orders/new`
   - El pedido se guarda en la base de datos a través de la API

2. **Actualización de Estado**:
   - El frontend actualiza el estado del pedido
   - Se publica un mensaje MQTT en el tópico `restaurant/orders/update`
   - Todos los clientes conectados reciben la actualización en tiempo real

## ⚠️ Manejo de Errores

La aplicación incluye un sistema robusto de manejo de errores que distingue entre:

- **Errores de conexión MQTT**: Mostrados en una alerta roja en la parte superior
- **Errores de API**: Mostrados en una alerta amarilla con temporizador de auto-cierre

## 🧪 Pruebas

Ejecuta las pruebas automatizadas con:

```bash
npm test
```

## 🔒 Persistencia Local

La aplicación utiliza localStorage para guardar los pedidos, lo que permite:

- Recuperar los pedidos incluso después de cerrar el navegador
- Funcionar offline y sincronizar cuando se recupera la conexión
- Mejorar el rendimiento al reducir las solicitudes al servidor

## 👥 Colaboradores

- Kevin-ALR - Desarrollador Principal

>>>>>>> develop
