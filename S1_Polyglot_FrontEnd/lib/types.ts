// TypeScript types generated from OpenAPI schema

export interface Token {
  access_token: string;
  token_type: string;
}

export interface BodyLoginForAccessToken {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface User {
  name: string;
  username: string;
  email: string;
  age: number;
  cpf: string;
  password: string;
  endereco: string;
  id?: number | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface UserCreate {
  name: string;
  username: string;
  email: string;
  age: number;
  cpf: string;
  password: string;
  endereco: string;
}

export interface UserPublic {
  name: string;
  username: string;
  email: string;
  age: number;
  cpf: string;
  password: string;
  endereco: string;
  id?: number | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface UserWithRelations {
  name: string;
  username: string;
  email: string;
  age: number;
  cpf: string;
  password: string;
  endereco: string;
  id?: number | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string | null;
  pagamentos?: PagamentoPublic[] | null;
}

export interface Product {
  _id?: string | null;
  image_url: string | null;
  owner_id: number;
  nome: string;
  preco: number;
  marca: string;
  desc?: string | null;
  created_at?: string;
  product_id: string;
  updated_at?: string | null;
}

export interface ProductCreate {
  nome: string;
  preco: number;
  marca: string;
  desc?: string | null;
  product_id: string;
  created_at?: string;
  image_url: string | null;
}

export interface ProductUpdate {
  nome: string | null;
  preco: number | null;
  marca: string | null;
  desc: string | null;
  image_url: string | null;
}

export interface Pagamento {
  user_id: number;
  numero_cartao: string;
  nome_titular: string;
  data_validade: string;
  cod_seguranca: number;
  id?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface PagamentoCreate {
  user_id: number;
  numero_cartao: string;
  nome_titular: string;
  data_validade: string;
  cod_seguranca: number;
}

export interface PagamentoCreateLogin {
  numero_cartao: string;
  nome_titular: string;
  data_validade: string;
  cod_seguranca: number;
}

export interface PagamentoPublic {
  user_id: number;
  numero_cartao: string;
  nome_titular: string;
  data_validade: string;
  cod_seguranca: number;
  id?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface PagamentoWithRelations {
  user_id: number;
  numero_cartao: string;
  nome_titular: string;
  data_validade: string;
  cod_seguranca: number;
  id?: number | null;
  created_at?: string;
  updated_at?: string | null;
  user: UserPublic;
}

export interface Compras {
  user_id: number;
  product_id: string;
  quantidade: number;
  data_compra: string;
  valor_pago: number;
  valor_produto: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}
