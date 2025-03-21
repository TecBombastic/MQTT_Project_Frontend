import React from 'react';

/**
 * Componente que muestra la información resumida de un pedido en forma de tarjeta.
 * @param {Object} order - El pedido a mostrar
 * @param {Function} onClick - Función que se ejecuta al hacer clic en la tarjeta
 */
const OrderCard = ({ order, onClick }) => {

  /**
   * Formatea una cadena de fecha a formato local
   * @param {string} dateString - Cadena de fecha a formatear
   * @returns {string} Fecha formateada en formato local
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };


  /**
   * Obtiene la clase CSS correspondiente al estado del pedido
   * @param {string} status - Estado del pedido
   * @returns {string} Clase CSS para el estado
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };


  /**
   * Traduce el estado del pedido al español
   * @param {string} status - Estado del pedido en inglés
   * @returns {string} Estado traducido al español
   */
  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  
  return (
    <div className={`order-card ${getStatusClass(order.status)}`} onClick={onClick}>
      <div className="order-header">
        <span className="order-id">Pedido #{order.id.slice(-4)}</span>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {translateStatus(order.status)}
        </span>
      </div>
      
      <div className="order-body">
        <div className="order-info">
          <p><strong>Cliente:</strong> {order.clientName}</p>
          <p><strong>Mesa:</strong> {order.table}</p>
          <p><strong>Productos:</strong> {order.items.length}</p>
          <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="order-footer">
        <span className="order-time">{formatDate(order.timestamp)}</span>
      </div>
    </div>
  );
};

export default OrderCard;