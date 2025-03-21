import React from 'react';

/**
 * Componente de modal que muestra los detalles completos de un pedido.
 * @param {Object} order - El pedido a mostrar en detalle
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} updateOrderStatus - Función para actualizar el estado del pedido
 */
const OrderModal = ({ order, onClose, updateOrderStatus }) => {

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
  

  /**
   * Maneja el cambio de estado de un pedido
   * @param {string} newStatus - Nuevo estado a asignar al pedido
   */
  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
    onClose();
  };
  
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Pedido #{order.id.slice(-4)}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="order-details">
            <p><strong>Estado:</strong> {translateStatus(order.status)}</p>
            <p><strong>Cliente:</strong> {order.clientName}</p>
            <p><strong>Mesa:</strong> {order.table}</p>
            <p><strong>Fecha y hora:</strong> {formatDate(order.timestamp)}</p>
            <p><strong>Total:</strong> ${Number(order.totalPrice).toFixed(2)}</p>
          </div>
          
          <div className="order-items">
            <h3>Productos:</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>${(Number(item.quantity) * Number(item.price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total:</strong></td>
                  <td><strong>${Number(order.totalPrice).toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <div className="item-notes">
              <h4>Notas:</h4>
              <ul>
                {order.items.map((item, index) => (
                  item.notes && (
                    <li key={index}>
                      <strong>{item.name}:</strong> {item.notes}
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          {order.status === 'pending' && (
            <>
              <button 
                className="btn btn-success" 
                onClick={() => handleStatusChange('completed')}
              >
                Completar Pedido
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleStatusChange('cancelled')}
              >
                Cancelar Pedido
              </button>
            </>
          )}
          {order.status !== 'pending' && (
            <button 
              className="btn btn-secondary" 
              onClick={() => handleStatusChange('pending')}
            >
              Marcar como Pendiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;