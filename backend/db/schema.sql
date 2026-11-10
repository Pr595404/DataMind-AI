-- ===========================================
-- DataMind AI - IBM Db2 Database Schema
-- IBM Db2 TechX Summit 2026 Hackathon
-- ===========================================

-- Drop tables if they exist (for re-initialization)
-- Note: Execute these manually if resetting the database.
-- DROP TABLE transactions;
-- DROP TABLE order_items;
-- DROP TABLE orders;
-- DROP TABLE products;
-- DROP TABLE customers;

-- -------------------------------------------
-- CUSTOMERS
-- -------------------------------------------
CREATE TABLE customers (
    customer_id   INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(20),
    city          VARCHAR(100),
    state         VARCHAR(50),
    segment       VARCHAR(50)  DEFAULT 'Consumer',
    created_at    DATE         DEFAULT CURRENT DATE
);

-- -------------------------------------------
-- PRODUCTS
-- -------------------------------------------
CREATE TABLE products (
    product_id    INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name  VARCHAR(255) NOT NULL,
    category      VARCHAR(100) NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    stock_quantity INT         DEFAULT 0,
    supplier      VARCHAR(200),
    created_at    DATE         DEFAULT CURRENT DATE
);

-- -------------------------------------------
-- ORDERS
-- -------------------------------------------
CREATE TABLE orders (
    order_id      INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id   INT          NOT NULL,
    order_date    DATE         DEFAULT CURRENT DATE,
    status        VARCHAR(20)  DEFAULT 'Pending',
    total_amount  DECIMAL(12,2),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(50),
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);

-- -------------------------------------------
-- ORDER ITEMS
-- -------------------------------------------
CREATE TABLE order_items (
    item_id       INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id      INT          NOT NULL,
    product_id    INT          NOT NULL,
    quantity      INT          NOT NULL DEFAULT 1,
    unit_price    DECIMAL(10,2) NOT NULL,
    line_total    DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price),
    CONSTRAINT fk_item_order   FOREIGN KEY (order_id)
        REFERENCES orders(order_id),
    CONSTRAINT fk_item_product FOREIGN KEY (product_id)
        REFERENCES products(product_id)
);

-- -------------------------------------------
-- TRANSACTIONS
-- -------------------------------------------
CREATE TABLE transactions (
    transaction_id  INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id        INT          NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    payment_method  VARCHAR(50)  NOT NULL,
    status          VARCHAR(20)  DEFAULT 'Completed',
    transaction_date TIMESTAMP   DEFAULT CURRENT TIMESTAMP,
    CONSTRAINT fk_txn_order FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);

-- -------------------------------------------
-- QUERY HISTORY
-- -------------------------------------------
CREATE TABLE query_history (
    query_id              INT           NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_question         VARCHAR(1000) NOT NULL,
    generated_sql         VARCHAR(4000) NOT NULL,
    execution_status      VARCHAR(20)   NOT NULL DEFAULT 'SUCCESS',
    execution_duration_ms DECIMAL(10,2) DEFAULT 0.00,
    row_count             INT           DEFAULT 0,
    error_message         VARCHAR(2000),
    created_at            TIMESTAMP     DEFAULT CURRENT TIMESTAMP
);

-- -------------------------------------------
-- INDEXES
-- -------------------------------------------
CREATE INDEX idx_orders_customer   ON orders(customer_id);
CREATE INDEX idx_orders_date       ON orders(order_date);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_items_order       ON order_items(order_id);
CREATE INDEX idx_items_product     ON order_items(product_id);
CREATE INDEX idx_txn_order         ON transactions(order_id);
CREATE INDEX idx_txn_date          ON transactions(transaction_date);
CREATE INDEX idx_customers_segment ON customers(segment);
CREATE INDEX idx_customers_city    ON customers(city);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_qh_status         ON query_history(execution_status);
CREATE INDEX idx_qh_created_at     ON query_history(created_at);
