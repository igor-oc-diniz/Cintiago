-- ============================================================
-- SCHEMA COMPLETO - SISTEMA DE PIZZARIA
-- ============================================================


-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
CREATE TABLE clients (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  street       VARCHAR(150) NOT NULL,
  number       VARCHAR(10)  NOT NULL,
  complement   VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city         VARCHAR(100) NOT NULL,
  zip_code     VARCHAR(10)  NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- FORMAS DE PAGAMENTO
-- ------------------------------------------------------------
CREATE TABLE payments (
  id     SERIAL PRIMARY KEY,
  name   VARCHAR(50) NOT NULL,   -- "Pix", "Cartão", "Dinheiro"
  active BOOLEAN DEFAULT TRUE
);


-- ------------------------------------------------------------
-- INGREDIENTES
-- ------------------------------------------------------------
CREATE TABLE ingredients (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  category   VARCHAR(50),         -- "queijo", "carne", "vegetal"
  created_at TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- PIZZAS
-- ------------------------------------------------------------
CREATE TABLE pizzas (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100)   NOT NULL UNIQUE,
  description  TEXT,
  price_small  DECIMAL(8, 2),
  price_medium DECIMAL(8, 2),
  price_large  DECIMAL(8, 2),
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- RELAÇÃO PIZZA <-> INGREDIENTES (composição base)
-- ------------------------------------------------------------
CREATE TABLE pizza_ingredients (
  pizza_id      INT REFERENCES pizzas(id)      ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity      VARCHAR(50),
  PRIMARY KEY (pizza_id, ingredient_id)
);


-- ------------------------------------------------------------
-- PREÇO DOS INGREDIENTES (adicionais por tamanho)
-- ------------------------------------------------------------
CREATE TABLE ingredient_prices (
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE PRIMARY KEY,
  price_small   DECIMAL(8, 2),
  price_medium  DECIMAL(8, 2),
  price_large   DECIMAL(8, 2)
);


-- ------------------------------------------------------------
-- BORDAS RECHEADAS
-- ------------------------------------------------------------
CREATE TABLE crusts (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100)   NOT NULL,    -- "Catupiry", "Cheddar"
  description  TEXT,
  price_small  DECIMAL(8, 2),
  price_medium DECIMAL(8, 2),
  price_large  DECIMAL(8, 2),
  active       BOOLEAN DEFAULT TRUE
);


-- ------------------------------------------------------------
-- PRODUTOS (refrigerantes, doces, etc.)
-- ------------------------------------------------------------
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)   NOT NULL,
  description TEXT,
  price       DECIMAL(8, 2)  NOT NULL,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- PEDIDOS
-- ------------------------------------------------------------
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  client_id  INT            REFERENCES clients(id),
  payment_id INT            REFERENCES payments(id),
  total      DECIMAL(8, 2),
  status     VARCHAR(50)    DEFAULT 'pending',  -- pending, preparing, delivered
  created_at TIMESTAMP DEFAULT NOW()
);


-- ------------------------------------------------------------
-- ITENS DO PEDIDO (cada pizza individualmente)
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id       SERIAL PRIMARY KEY,
  order_id INT         REFERENCES orders(id) ON DELETE CASCADE,
  crust_id INT         REFERENCES crusts(id),
  size     VARCHAR(10) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  quantity INT         DEFAULT 1
);


-- ------------------------------------------------------------
-- METADES DE CADA ITEM (suporte a pizza meio a meio)
-- ------------------------------------------------------------
CREATE TABLE order_item_halves (
  id            SERIAL PRIMARY KEY,
  order_item_id INT REFERENCES order_items(id) ON DELETE CASCADE,
  pizza_id      INT REFERENCES pizzas(id),
  half          INT NOT NULL CHECK (half IN (1, 2))
);


-- ------------------------------------------------------------
-- INGREDIENTES CUSTOMIZADOS POR METADE (add / remove)
-- ------------------------------------------------------------
CREATE TABLE order_item_half_ingredients (
  order_item_half_id INT         REFERENCES order_item_halves(id) ON DELETE CASCADE,
  ingredient_id      INT         REFERENCES ingredients(id),
  action             VARCHAR(10) NOT NULL CHECK (action IN ('add', 'remove')),
  PRIMARY KEY (order_item_half_id, ingredient_id)
);


-- ------------------------------------------------------------
-- PRODUTOS NO PEDIDO (refrigerantes, doces, etc.)
-- ------------------------------------------------------------
CREATE TABLE order_products (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id)   ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity   INT DEFAULT 1
);
