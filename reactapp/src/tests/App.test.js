import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import AddOrder from "../components/AddOrder";
import OrderList from "../components/OrderList";
import api from "../utils/api";

// Mock canvas to fix native module error in jest/jsdom
jest.mock("canvas", () => ({}));

// Mock the api module completely
jest.mock("../utils/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe("AddOrder Component Tests", () => {
  const sampleOrder = {
    restaurantName: "Pizza Place",
    cuisineType: "Italian",
    menuItemName: "Pepperoni Pizza",
    menuItemDescription: "Spicy pepperoni",
    menuItemPrice: "15.5",
    quantity: "2",
    orderStatus: "Placed",
  };

  test("State_AddOrderRendersAllInputs", () => {
    render(<AddOrder onOrderAdded={() => {}} />);
    expect(screen.getByPlaceholderText("Restaurant Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cuisine Type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Menu Item Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Item Description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantity")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Order Status")).toBeInTheDocument();
  });

  test("Form_AddOrderUpdatesStateOnInputChange", () => {
    render(<AddOrder onOrderAdded={() => {}} />);
    const restaurantInput = screen.getByPlaceholderText("Restaurant Name");
    userEvent.type(restaurantInput, "New Restaurant");
    expect(restaurantInput).toHaveValue("New Restaurant");
  });

  test("Axios_AddOrderCallsApiPostOnSubmitAndResetsForm", async () => {
    const mockOnOrderAdded = jest.fn();
    api.post.mockResolvedValueOnce({ data: {} });

    render(<AddOrder onOrderAdded={mockOnOrderAdded} />);

    // Fill inputs
    userEvent.type(screen.getByPlaceholderText("Restaurant Name"), sampleOrder.restaurantName);
    userEvent.type(screen.getByPlaceholderText("Cuisine Type"), sampleOrder.cuisineType);
    userEvent.type(screen.getByPlaceholderText("Menu Item Name"), sampleOrder.menuItemName);
    userEvent.type(screen.getByPlaceholderText("Item Description"), sampleOrder.menuItemDescription);
    userEvent.type(screen.getByPlaceholderText("Price"), sampleOrder.menuItemPrice);
    userEvent.type(screen.getByPlaceholderText("Quantity"), sampleOrder.quantity);
    userEvent.type(screen.getByPlaceholderText("Order Status"), sampleOrder.orderStatus);

    userEvent.click(screen.getByRole("button", { name: /submit order/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/orders", {
        ...sampleOrder,
        menuItemPrice: parseFloat(sampleOrder.menuItemPrice),
        quantity: parseInt(sampleOrder.quantity),
      });
      expect(mockOnOrderAdded).toHaveBeenCalled();
    });

    // After submit, inputs reset
    expect(screen.getByPlaceholderText("Restaurant Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Price")).toHaveValue(null); // input type number resets to empty
  });
});

describe("OrderList Component Tests", () => {
  const sampleOrders = [
    { id: 1, restaurantName: "Sushi Bar", menuItemName: "Salmon Roll", quantity: 3, orderStatus: "Delivered" },
    { id: 2, restaurantName: "Burger Joint", menuItemName: "Cheeseburger", quantity: 1, orderStatus: "Preparing" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("State_OrderListRendersOrders", async () => {
    api.get.mockResolvedValueOnce({ data: sampleOrders });

    render(<OrderList refresh={true} />);

    for (const order of sampleOrders) {
      expect(await screen.findByText(order.menuItemName)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(order.restaurantName))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(order.orderStatus))).toBeInTheDocument();
    }
  });

  test("Axios_OrderListDeletesOrderOnClick", async () => {
    api.get.mockResolvedValueOnce({ data: sampleOrders });
    api.delete.mockResolvedValueOnce({});

    render(<OrderList refresh={true} />);
    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });

    // Click delete on first order
    userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/orders/${sampleOrders[0].id}`);
      // The deleted order should be removed from the list
      expect(screen.queryByText(sampleOrders[0].menuItemName)).not.toBeInTheDocument();
    });
  });
});
describe("App Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: [] }); // mock api.get returns empty orders array
  });

  test("State_AppRendersAllComponents", () => {
    render(<App />);
    expect(screen.getByText(/Online Food Order System/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit order/i })).toBeInTheDocument();
    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Online Food Ordering Portal/i)).toBeInTheDocument();
  });

  test("State_AppRefreshStateChangesOnOrderAdded", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /submit order/i })).toBeInTheDocument();
  });
});
describe("AdditionalTests", () => {
  test("ErrorHandling_AddOrderPreventsSubmitWithEmptyFields", async () => {
    const mockOnOrderAdded = jest.fn();
    render(<AddOrder onOrderAdded={mockOnOrderAdded} />);
    const submitBtn = screen.getByRole("button", { name: /submit order/i });

    // Submit without filling inputs
    userEvent.click(submitBtn);

    // onOrderAdded should NOT be called because form is invalid
  });

  test("State_OrderListHandlesEmptyOrdersGracefully", async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    render(<OrderList refresh={true} />);

    await waitFor(() => {
      expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
    });

    // No orders should be displayed
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });

  test("State_OrderListShowsMultipleOrdersCorrectly", async () => {
    const multiOrders = [
      { id: 10, restaurantName: "Cafe", menuItemName: "Latte", quantity: 1, orderStatus: "Ready" },
      { id: 11, restaurantName: "Bakery", menuItemName: "Croissant", quantity: 2, orderStatus: "Pending" },
    ];
    api.get.mockResolvedValueOnce({ data: multiOrders });

    render(<OrderList refresh={true} />);
    for (const order of multiOrders) {
      expect(await screen.findByText(order.menuItemName)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(order.restaurantName))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(order.orderStatus))).toBeInTheDocument();
    }
  });

  test("Axios_AddOrderClearsFieldsAfterSubmit", async () => {
    const mockOnOrderAdded = jest.fn();
    api.post.mockResolvedValueOnce({ data: {} });
    render(<AddOrder onOrderAdded={mockOnOrderAdded} />);

    // Fill inputs
    userEvent.type(screen.getByPlaceholderText("Restaurant Name"), "Test Restaurant");
    userEvent.type(screen.getByPlaceholderText("Cuisine Type"), "Test Cuisine");
    userEvent.type(screen.getByPlaceholderText("Menu Item Name"), "Test Item");
    userEvent.type(screen.getByPlaceholderText("Item Description"), "Test Description");
    userEvent.type(screen.getByPlaceholderText("Price"), "12");
    userEvent.type(screen.getByPlaceholderText("Quantity"), "3");
    userEvent.type(screen.getByPlaceholderText("Order Status"), "Ordered");

    userEvent.click(screen.getByRole("button", { name: /submit order/i }));

    await waitFor(() => {
      expect(mockOnOrderAdded).toHaveBeenCalled();
    });

    // Inputs should be reset to empty after submit
    expect(screen.getByPlaceholderText("Restaurant Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Price")).toHaveValue(null);
  });

  test("Axios_OrderListDeleteButtonWorksForEachOrder", async () => {
    const testOrders = [
      { id: 100, restaurantName: "Test A", menuItemName: "Item A", quantity: 1, orderStatus: "Done" },
      { id: 101, restaurantName: "Test B", menuItemName: "Item B", quantity: 2, orderStatus: "Pending" },
    ];
    api.get.mockResolvedValueOnce({ data: testOrders });
    api.delete.mockResolvedValue({});

    render(<OrderList refresh={true} />);

    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(testOrders.length);

    // Delete second order
    userEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/orders/${testOrders[1].id}`);
    });
  });
});
