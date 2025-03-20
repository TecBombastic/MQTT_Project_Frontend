import React, { useState } from 'react';

const OrderForm = ({ addOrder }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    table: '',
    items: [{ name: '', quantity: 1, price: 0, notes: '' }],
    totalPrice: 0
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    
    // Recalcular precio total
    let total = 0;
    updatedItems.forEach(item => {
      total += item.quantity * item.price;
    });
    
    setFormData({ 
      ...formData, 
      items: updatedItems,
      totalPrice: total
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0, notes: '' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      setError('El pedido debe tener al menos un producto');
      return;
    }
    
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    // Recalcular precio total
    let total = 0;
    updatedItems.forEach(item => {
      total += item.quantity * item.price;
    });
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalPrice: total
    });
    
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.clientName.trim()) {
      setError('Por favor ingrese el nombre del cliente');
      return;
    }
    
    if (!formData.table.trim()) {
      setError('Por favor ingrese el número de mesa');
      return;
    }
    
    // Validar que todos los items tengan nombre
    for (const item of formData.items) {
      if (!item.name.trim()) {
        setError('Todos los productos deben tener un nombre');
        return;
      }
    }
    
    // Enviar pedido
    addOrder(formData);
    
    // Resetear formulario
    setFormData({
      clientName: '',
      table: '',
      items: [{ name: '', quantity: 1, price: 0, notes: '' }],
      totalPrice: 0
    });
    
    setError('');
    setSuccess('¡Pedido enviado con éxito!');
    
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="order-form-container">
      <h2>Nuevo Pedido</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">Nombre del Cliente:</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="table">Mesa:</label>
          <input
            type="text"
            id="table"
            name="table"
            value={formData.table}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        
        <h3>Productos</h3>
        
        {formData.items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="form-group">
              <label>Producto:</label>
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                min="1"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                min="0"
                step="0.01"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Notas:</label>
              <input
                type="text"
                name="notes"
                value={item.notes}
                onChange={(e) => handleItemChange(index, e)}
                className="form-control"
              />
            </div>
            
            <button 
              type="button" 
              onClick={() => removeItem(index)}
              className="btn btn-danger"
            >
              Eliminar
            </button>
          </div>
        ))}
        
        <div className="form-actions">
          <button type="button" onClick={addItem} className="btn btn-secondary">
            + Agregar Producto
          </button>
        </div>
        
        <div className="order-summary">
          <h3>Total: ${formData.totalPrice.toFixed(2)}</h3>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Enviar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;