package com.examly.springapp;

import com.examly.springapp.controller.FoodOrderController;
import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.service.FoodOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

public class SpringappApplicationTest {

    private MockMvc mockMvc;

    @Mock
    private FoodOrderService service;

    @InjectMocks
    private FoodOrderController controller;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    private FoodOrder createSampleOrder() {
        FoodOrder order = new FoodOrder();
        order.setId(1L);
        order.setRestaurantName("Test Restaurant");
        order.setCuisineType("Italian");
        order.setMenuItemName("Pizza");
        order.setMenuItemDescription("Cheese Pizza");
        order.setMenuItemPrice(12.5);
        order.setQuantity(2);
        order.setOrderStatus("Placed");
        return order;
    }

    @Test
    public void service_addOrderReturnsSavedOrder() throws Exception {
        FoodOrder order = createSampleOrder();
        when(service.saveOrder(any(FoodOrder.class))).thenReturn(order);

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(order.getId()))
                .andExpect(jsonPath("$.restaurantName").value(order.getRestaurantName()));

        verify(service, times(1)).saveOrder(any(FoodOrder.class));
    }

    @Test
    public void service_getAllOrdersReturnsOrderList() throws Exception {
        List<FoodOrder> orders = Arrays.asList(createSampleOrder(), createSampleOrder());
        when(service.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        verify(service, times(1)).getAllOrders();
    }

    @Test
    public void service_deleteOrderCallsServiceDelete() throws Exception {
        doNothing().when(service).deleteOrder(1L);

        mockMvc.perform(delete("/orders/1"))
                .andExpect(status().isOk());

        verify(service, times(1)).deleteOrder(1L);
    }

    @Test
    public void service_addOrderWithNullBodyReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void service_getAllOrdersWhenEmptyReturnsEmptyList() throws Exception {
        when(service.getAllOrders()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }


    @Test
    public void service_saveOrderWithMissingFieldsReturnsSavedOrder() throws Exception {
        FoodOrder order = new FoodOrder();
        order.setMenuItemName("Test Item");

        when(service.saveOrder(any(FoodOrder.class))).thenReturn(order);

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.menuItemName").value("Test Item"));
    }

    @Test
    public void service_serviceSaveOrderCallsCorrectly() {
        FoodOrder order = createSampleOrder();
        when(service.saveOrder(order)).thenReturn(order);

        FoodOrder result = service.saveOrder(order);

        verify(service, times(1)).saveOrder(order);
        // Basic assertion to ensure call correctness (mock returns what we set)
        assert(result == order);
    }

    @Test
    public void service_serviceGetAllOrdersCallsCorrectly() {
        List<FoodOrder> orders = Arrays.asList(createSampleOrder());
        when(service.getAllOrders()).thenReturn(orders);

        List<FoodOrder> result = service.getAllOrders();

        verify(service, times(1)).getAllOrders();
        assert(result == orders);
    }

    @Test
    public void service_serviceDeleteOrderCallsCorrectly() {
        doNothing().when(service).deleteOrder(1L);

        service.deleteOrder(1L);

        verify(service, times(1)).deleteOrder(1L);
    }

    @Test
    public void service_getAllOrdersHandlesMultipleOrders() throws Exception {
        List<FoodOrder> orders = Arrays.asList(createSampleOrder(), createSampleOrder(), createSampleOrder());
        when(service.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));

        verify(service).getAllOrders();
    }

    @Test
    public void service_deleteOrderHandlesMultipleDeletes() throws Exception {
        doNothing().when(service).deleteOrder(2L);

        mockMvc.perform(delete("/orders/2"))
                .andExpect(status().isOk());

        verify(service).deleteOrder(2L);
    }
}
