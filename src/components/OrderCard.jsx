import React from 'react';

const OrderCard = ({ order, onClick }) => {
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  // Obtener clase CSS basada en el estado
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
  
  // Traducir estado a español
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