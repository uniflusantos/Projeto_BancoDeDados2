import type {
  Token,
  BodyLoginForAccessToken,
  User,
  UserCreate,
  UserWithRelations,
  Product,
  ProductCreate,
  ProductUpdate,
  Pagamento,
  PagamentoCreate,
  PagamentoCreateLogin,
  PagamentoWithRelations,
  Compras,
  HTTPValidationError,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - throw error but let the caller handle logout
      throw new Error("Unauthorized. Please log in.");
    }
    try {
      const error: HTTPValidationError = await response.json();
      const errorMessage =
        error.detail?.[0]?.msg || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return response.json();
}

// Authentication
export async function login(
  username: string,
  password: string
): Promise<Token> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error: HTTPValidationError = await response.json().catch(() => ({}));
    throw new Error(
      error.detail?.[0]?.msg || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// User Management
export async function createUser(userData: UserCreate): Promise<User> {
  return request<User>("/user/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getCurrentUser(): Promise<UserWithRelations> {
  return request<UserWithRelations>("/user/me/");
}

// Products
export async function getProducts(): Promise<Product[]> {
  return request<Product[]>("/products/");
}

export async function getProduct(productId: string): Promise<Product> {
  return request<Product>(`/products/${productId}`);
}

export async function createProduct(
  productData: ProductCreate
): Promise<Product> {
  return request<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(
  productId: string,
  productData: ProductUpdate
): Promise<Product> {
  return request<Product>(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await request(`/products/${productId}`, {
    method: "DELETE",
  });
}

// Payment Methods
export async function getPaymentMethods(): Promise<Pagamento[]> {
  return request<Pagamento[]>("/user/payment_method");
}

export async function createPaymentMethod(
  paymentData: PagamentoCreateLogin
): Promise<Pagamento> {
  return request<Pagamento>("/user/payment_method", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

export async function createPaymentMethodAlt(
  paymentData: PagamentoCreate
): Promise<Pagamento> {
  return request<Pagamento>("/payment_method/", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

// Purchases
export async function createPurchase(purchaseData: Compras): Promise<Compras> {
  return request<Compras>("/compras/", {
    method: "POST",
    body: JSON.stringify(purchaseData),
  });
}

export async function getUserPurchases(userId: number): Promise<Compras[]> {
  return request<Compras[]>(`/compras/${userId}`);
}
