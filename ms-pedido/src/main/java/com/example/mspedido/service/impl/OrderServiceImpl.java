package com.example.mspedido.service.impl;

import com.example.mspedido.dto.ProductDto;
import com.example.mspedido.entity.Order;
import com.example.mspedido.entity.OrderDetail;
import com.example.mspedido.feign.ProductFeign;
import com.example.mspedido.repository.OrderRepository;
import com.example.mspedido.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductFeign productFeign;

    @Override
    public List<Order> list() {
        return orderRepository.findAll();
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Optional<Order> findById(Integer id) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        // Verifica si el Optional contiene un valor
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();

            // Recorre los detalles del pedido solo si el pedido existe
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                // Obtiene el producto asociado al detalle del pedido y lo establece
                ProductDto productDto = productFeign.getById(orderDetail.getProductId()).getBody();
                orderDetail.setProductDto(productDto);
            }

            // Retorna el Optional con el pedido modificado
            return Optional.of(order);
        } else {
            // Maneja el caso en que el pedido no se encuentra, por ejemplo:
            // Lanzar una excepción personalizada o retornar un Optional vacío
            return Optional.empty();
        }
    }

    @Override
    public void delete(Integer id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Order update(Order order) {
        return orderRepository.save(order);
    }
}
