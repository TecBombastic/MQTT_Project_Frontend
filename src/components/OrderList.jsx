import React, { useState } from 'react';
import OrderCard from './OrderCard';
import OrderModal from './OrderModal';


/**
 * Componente que muestra la lista de pedidos organizados por estado.
 * @param {Object[]} orders - Array de pedidos a mostrar
 * @param {Function} updateOrderStatus - Función para actualizar el estado de un pedido
 */
const OrderList = ({ orders, updateOrderStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Filtrar órdenes por estado
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');


  /**
   * Abre el modal con la información del pedido seleccionado
   * @param {Object} order - El pedido seleccionado
   */
  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };


  /**
   * Cierra el modal de pedido
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  return (
    <div className="order-list-container">
      <h2>Recepción de Pedidos</h2>
      
      <div className="order-sections">
        <div className="order-section">
          <h3>Pendientes ({pendingOrders.length})</h3>
          <div className="order-cards">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openOrderModal(order)}
                />
              ))
            ) : (
              <p className="no-orders">No hay pedidos pendientes</p>
            )}
          </div>
        </div>
        
        <div className="order-section">
          <h3>Completados ({completedOrders.length})</h3>
          <div className="order-cards">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openOrderModal(order)}
                />
              ))
            ) : (
              <p className="no-orders">No hay pedidos completados</p>
            )}
          </div>
        </div>
        
        <div className="order-section">
          <h3>Cancelados ({cancelledOrders.length})</h3>
          <div className="order-cards">
            {cancelledOrders.length > 0 ? (
              cancelledOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openOrderModal(order)}
                />
              ))
            ) : (
              <p className="no-orders">No hay pedidos cancelados</p>
            )}
          </div>
        </div>
      </div>
      
      {isModalOpen && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={closeModal}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default OrderList;