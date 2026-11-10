-- ===========================================
-- DataMind AI - Seed Data
-- Realistic business data for demo
-- ===========================================

-- -------------------------------------------
-- CUSTOMERS (25 records)
-- -------------------------------------------
INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Alice', 'Johnson', 'alice.johnson@example.com', '555-0101', 'New York', 'NY', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Bob', 'Smith', 'bob.smith@example.com', '555-0102', 'Los Angeles', 'CA', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Carol', 'Williams', 'carol.w@example.com', '555-0103', 'Chicago', 'IL', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('David', 'Brown', 'david.b@example.com', '555-0104', 'Houston', 'TX', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Emily', 'Davis', 'emily.d@example.com', '555-0105', 'Phoenix', 'AZ', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Frank', 'Miller', 'frank.m@example.com', '555-0106', 'San Antonio', 'TX', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Grace', 'Wilson', 'grace.w@example.com', '555-0107', 'San Diego', 'CA', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Henry', 'Moore', 'henry.m@example.com', '555-0108', 'Dallas', 'TX', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Irene', 'Taylor', 'irene.t@example.com', '555-0109', 'San Jose', 'CA', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('James', 'Anderson', 'james.a@example.com', '555-0110', 'Austin', 'TX', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Karen', 'Thomas', 'karen.t@example.com', '555-0111', 'Jacksonville', 'FL', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Leo', 'Jackson', 'leo.j@example.com', '555-0112', 'Columbus', 'OH', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Maria', 'White', 'maria.w@example.com', '555-0113', 'Charlotte', 'NC', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Nathan', 'Harris', 'nathan.h@example.com', '555-0114', 'Indianapolis', 'IN', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Olivia', 'Martin', 'olivia.m@example.com', '555-0115', 'Seattle', 'WA', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Paul', 'Garcia', 'paul.g@example.com', '555-0116', 'Denver', 'CO', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Quinn', 'Martinez', 'quinn.m@example.com', '555-0117', 'Boston', 'MA', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Rachel', 'Robinson', 'rachel.r@example.com', '555-0118', 'Nashville', 'TN', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Steve', 'Clark', 'steve.c@example.com', '555-0119', 'Portland', 'OR', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Tina', 'Lewis', 'tina.l@example.com', '555-0120', 'Las Vegas', 'NV', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Uma', 'Lee', 'uma.l@example.com', '555-0121', 'Memphis', 'TN', 'SMB');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Victor', 'Walker', 'victor.w@example.com', '555-0122', 'Baltimore', 'MD', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Wendy', 'Hall', 'wendy.h@example.com', '555-0123', 'Atlanta', 'GA', 'Consumer');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Xavier', 'Allen', 'xavier.a@example.com', '555-0124', 'Miami', 'FL', 'Enterprise');

INSERT INTO customers (first_name, last_name, email, phone, city, state, segment)
VALUES ('Yara', 'Young', 'yara.y@example.com', '555-0125', 'Minneapolis', 'MN', 'SMB');

-- -------------------------------------------
-- PRODUCTS (20 records, 5 categories)
-- -------------------------------------------
INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Enterprise Server Pro', 'Hardware', 4999.99, 15, 'TechCorp Inc.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Business Laptop Elite', 'Hardware', 1299.99, 45, 'TechCorp Inc.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Wireless Mouse Pro', 'Hardware', 49.99, 200, 'PeripheralWorld');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('4K Monitor Ultra', 'Hardware', 599.99, 60, 'DisplayTech');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Cloud Suite License', 'Software', 299.99, 999, 'CloudSoft Ltd.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Security Suite Pro', 'Software', 149.99, 999, 'SecureNet');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Database Manager Tool', 'Software', 499.99, 999, 'DataTools Corp.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Project Management SaaS', 'Software', 19.99, 999, 'AgileSoft');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Premium Support Plan', 'Services', 999.99, 100, 'SupportFirst');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Training Workshop (5-day)', 'Services', 2499.99, 50, 'TechEdu');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Data Migration Service', 'Services', 3999.99, 20, 'MigrateNow');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Consulting Package (40h)', 'Services', 7999.99, 10, 'ConsultPro');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Cat6 Network Cable (100ft)', 'Accessories', 29.99, 500, 'CableCo');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('USB-C Hub 7-Port', 'Accessories', 79.99, 150, 'PeripheralWorld');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Ergonomic Keyboard', 'Accessories', 129.99, 100, 'PeripheralWorld');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Webcam HD Pro', 'Accessories', 89.99, 120, 'DisplayTech');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Cloud Storage (1TB/yr)', 'Cloud', 119.99, 999, 'CloudSoft Ltd.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('AI Analytics Platform', 'Cloud', 599.99, 999, 'DataTools Corp.');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('DevOps Pipeline Suite', 'Cloud', 399.99, 999, 'AgileSoft');

INSERT INTO products (product_name, category, unit_price, stock_quantity, supplier)
VALUES ('Backup & Recovery Cloud', 'Cloud', 249.99, 999, 'SecureNet');

-- -------------------------------------------
-- ORDERS (40 records, spread across 2025-2026)
-- -------------------------------------------
INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (1, '2025-01-15', 'Completed', 5299.98, 'New York', 'NY');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (2, '2025-01-22', 'Completed', 1349.98, 'Los Angeles', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (3, '2025-02-10', 'Completed', 8499.98, 'Chicago', 'IL');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (5, '2025-02-28', 'Completed', 149.98, 'Phoenix', 'AZ');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (7, '2025-03-05', 'Completed', 12999.97, 'San Diego', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (4, '2025-03-18', 'Completed', 599.99, 'Houston', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (9, '2025-04-02', 'Completed', 3799.97, 'San Jose', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (1, '2025-04-15', 'Completed', 999.99, 'New York', 'NY');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (10, '2025-05-01', 'Completed', 2549.98, 'Austin', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (13, '2025-05-20', 'Completed', 4999.99, 'Charlotte', 'NC');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (6, '2025-06-08', 'Completed', 719.98, 'San Antonio', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (15, '2025-06-15', 'Completed', 7999.99, 'Seattle', 'WA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (8, '2025-07-01', 'Completed', 329.98, 'Dallas', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (11, '2025-07-12', 'Completed', 1899.97, 'Jacksonville', 'FL');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (3, '2025-07-25', 'Completed', 2499.99, 'Chicago', 'IL');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (14, '2025-08-05', 'Completed', 449.97, 'Indianapolis', 'IN');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (18, '2025-08-18', 'Completed', 6499.98, 'Nashville', 'TN');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (22, '2025-09-01', 'Completed', 9999.98, 'Baltimore', 'MD');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (16, '2025-09-15', 'Completed', 1199.98, 'Denver', 'CO');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (20, '2025-10-02', 'Completed', 89.99, 'Las Vegas', 'NV');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (24, '2025-10-20', 'Completed', 15499.97, 'Miami', 'FL');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (12, '2025-11-01', 'Completed', 3999.99, 'Columbus', 'OH');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (19, '2025-11-15', 'Completed', 679.98, 'Portland', 'OR');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (7, '2025-12-01', 'Completed', 2999.98, 'San Diego', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (1, '2025-12-15', 'Completed', 4299.98, 'New York', 'NY');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (21, '2026-01-10', 'Completed', 1999.98, 'Memphis', 'TN');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (23, '2026-01-22', 'Completed', 259.98, 'Atlanta', 'GA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (25, '2026-02-05', 'Completed', 899.98, 'Minneapolis', 'MN');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (9, '2026-02-18', 'Completed', 5599.98, 'San Jose', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (2, '2026-03-01', 'Completed', 1429.98, 'Los Angeles', 'CA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (4, '2026-03-15', 'Completed', 3499.98, 'Houston', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (17, '2026-04-01', 'Processing', 749.98, 'Boston', 'MA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (13, '2026-04-12', 'Processing', 12999.98, 'Charlotte', 'NC');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (15, '2026-05-01', 'Processing', 2799.98, 'Seattle', 'WA');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (6, '2026-06-10', 'Pending', 499.99, 'San Antonio', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (10, '2026-07-05', 'Pending', 8999.98, 'Austin', 'TX');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (22, '2026-08-01', 'Pending', 1599.98, 'Baltimore', 'MD');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (18, '2026-09-15', 'Pending', 24999.97, 'Nashville', 'TN');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (24, '2026-10-01', 'Pending', 3299.98, 'Miami', 'FL');

INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_city, shipping_state)
VALUES (3, '2026-11-01', 'Pending', 5999.98, 'Chicago', 'IL');

-- -------------------------------------------
-- ORDER ITEMS (60+ records)
-- -------------------------------------------
-- Order 1 (Alice - Enterprise Server + Cloud Suite)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 5, 1, 299.99);

-- Order 2 (Bob - Laptop + Mouse)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 2, 1, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 3, 1, 49.99);

-- Order 3 (Carol - Consulting + Training)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (3, 12, 1, 7999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (3, 7, 1, 499.99);

-- Order 4 (Emily - Security Suite + Mouse)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (4, 6, 1, 149.99);

-- Order 5 (Grace - Server + Migration + Support)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (5, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (5, 11, 1, 3999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (5, 9, 1, 999.99);

-- Order 6 (David - Monitor)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (6, 4, 1, 599.99);

-- Order 7 (Irene - Laptops x2 + AI Analytics)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (7, 2, 2, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (7, 18, 1, 599.99);

-- Order 8 (Alice - Support Plan)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (8, 9, 1, 999.99);

-- Order 9 (James - Training + DB Manager)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (9, 10, 1, 2499.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (9, 3, 1, 49.99);

-- Order 10 (Maria - Server)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (10, 1, 1, 4999.99);

-- Order 11 (Frank - Keyboard + Hub + Monitor)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (11, 15, 1, 129.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (11, 14, 1, 79.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (11, 4, 1, 599.99);

-- Order 12 (Olivia - Consulting)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (12, 12, 1, 7999.99);

-- Order 13 (Henry - Cloud Storage + Project Mgmt)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 17, 1, 119.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 8, 1, 19.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 16, 1, 89.99);

-- Order 14 (Karen - Laptop + Accessories)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (14, 2, 1, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (14, 3, 2, 49.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (14, 15, 1, 129.99);

-- Order 15 (Carol - Training)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (15, 10, 1, 2499.99);

-- Order 16 (Nathan - Cables + Hub + Mouse)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 13, 3, 29.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 14, 1, 79.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 3, 1, 49.99);

-- Order 17 (Rachel - Server + Laptop)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (17, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (17, 2, 1, 1299.99);

-- Order 18 (Victor - Server x2)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (18, 1, 2, 4999.99);

-- Order 19 (Paul - AI Analytics + Cloud Storage)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (19, 18, 1, 599.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (19, 17, 1, 119.99);

-- Order 20 (Tina - Webcam)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (20, 16, 1, 89.99);

-- Order 21 (Xavier - Server x2 + Migration + Consulting)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (21, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (21, 11, 1, 3999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (21, 12, 1, 7999.99);

-- Order 22 (Leo - Migration)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (22, 11, 1, 3999.99);

-- Order 23 (Steve - DevOps + Cloud Storage)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (23, 19, 1, 399.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (23, 17, 1, 119.99);

-- Order 24 (Grace - Laptop x2 + Monitors)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (24, 2, 2, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (24, 4, 1, 599.99);

-- Order 25 (Alice - Server + AI Analytics + Support)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (25, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (25, 18, 1, 599.99);

-- Order 26 (Uma - Laptop + DevOps)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 2, 1, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 19, 1, 399.99);

-- Order 27 (Wendy - Keyboard + Mouse)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (27, 15, 1, 129.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (27, 3, 1, 49.99);

-- Order 28 (Yara - Cloud Suite x2 + Backup)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (28, 5, 2, 299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (28, 20, 1, 249.99);

-- Order 29 (Irene - Server + Support)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (29, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (29, 9, 1, 999.99);

-- Order 30 (Bob - Laptop + Monitor)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (30, 2, 1, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (30, 4, 1, 599.99);

-- Order 31 (David - Migration + DB Manager)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (31, 11, 1, 3999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (31, 7, 1, 499.99);

-- Order 32 (Quinn - Cloud Suite + Project Mgmt)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (32, 5, 1, 299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (32, 8, 1, 19.99);

-- Order 33 (Maria - Server x2 + Training)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 1, 2, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 10, 1, 2499.99);

-- Order 34 (Olivia - AI Analytics x2 + Backup)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 18, 2, 599.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 20, 1, 249.99);

-- Order 35 (Frank - DB Manager)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (35, 7, 1, 499.99);

-- Order 36 (James - Server + Consulting)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 1, 1, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 12, 1, 7999.99);

-- Order 37 (Victor - Laptop x2 + Security)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (37, 2, 2, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (37, 6, 1, 149.99);

-- Order 38 (Rachel - Server x3 + Migration + Consulting)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (38, 1, 3, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (38, 11, 1, 3999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (38, 12, 1, 7999.99);

-- Order 39 (Xavier - Laptop + AI Analytics + DevOps)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 2, 1, 1299.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 18, 1, 599.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 19, 1, 399.99);

-- Order 40 (Carol - Server x2 + Support)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (40, 1, 2, 4999.99);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (40, 9, 1, 999.99);

-- -------------------------------------------
-- TRANSACTIONS (one per order)
-- -------------------------------------------
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (1, 5299.98, 'Credit Card', 'Completed', '2025-01-15 10:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (2, 1349.98, 'PayPal', 'Completed', '2025-01-22 14:15:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (3, 8499.98, 'Wire Transfer', 'Completed', '2025-02-10 09:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (4, 149.98, 'Credit Card', 'Completed', '2025-02-28 16:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (5, 12999.97, 'Wire Transfer', 'Completed', '2025-03-05 11:20:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (6, 599.99, 'Credit Card', 'Completed', '2025-03-18 13:10:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (7, 3799.97, 'Wire Transfer', 'Completed', '2025-04-02 10:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (8, 999.99, 'Credit Card', 'Completed', '2025-04-15 15:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (9, 2549.98, 'PayPal', 'Completed', '2025-05-01 09:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (10, 4999.99, 'Wire Transfer', 'Completed', '2025-05-20 11:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (11, 719.98, 'Credit Card', 'Completed', '2025-06-08 14:20:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (12, 7999.99, 'Wire Transfer', 'Completed', '2025-06-15 10:15:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (13, 329.98, 'PayPal', 'Completed', '2025-07-01 16:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (14, 1899.97, 'Credit Card', 'Completed', '2025-07-12 12:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (15, 2499.99, 'Wire Transfer', 'Completed', '2025-07-25 09:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (16, 449.97, 'Credit Card', 'Completed', '2025-08-05 11:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (17, 6499.98, 'Wire Transfer', 'Completed', '2025-08-18 10:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (18, 9999.98, 'Wire Transfer', 'Completed', '2025-09-01 14:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (19, 1199.98, 'PayPal', 'Completed', '2025-09-15 13:15:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (20, 89.99, 'Credit Card', 'Completed', '2025-10-02 15:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (21, 15499.97, 'Wire Transfer', 'Completed', '2025-10-20 10:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (22, 3999.99, 'Wire Transfer', 'Completed', '2025-11-01 09:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (23, 679.98, 'Credit Card', 'Completed', '2025-11-15 12:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (24, 2999.98, 'PayPal', 'Completed', '2025-12-01 14:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (25, 4299.98, 'Wire Transfer', 'Completed', '2025-12-15 10:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (26, 1999.98, 'Credit Card', 'Completed', '2026-01-10 11:15:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (27, 259.98, 'PayPal', 'Completed', '2026-01-22 15:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (28, 899.98, 'Credit Card', 'Completed', '2026-02-05 09:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (29, 5599.98, 'Wire Transfer', 'Completed', '2026-02-18 10:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (30, 1429.98, 'Credit Card', 'Completed', '2026-03-01 13:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (31, 3499.98, 'Wire Transfer', 'Completed', '2026-03-15 11:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (32, 749.98, 'PayPal', 'Processing', '2026-04-01 14:15:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (33, 12999.98, 'Wire Transfer', 'Processing', '2026-04-12 10:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (34, 2799.98, 'Credit Card', 'Processing', '2026-05-01 09:45:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (35, 499.99, 'Credit Card', 'Pending', '2026-06-10 16:30:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (36, 8999.98, 'Wire Transfer', 'Pending', '2026-07-05 10:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (37, 1599.98, 'PayPal', 'Pending', '2026-08-01 12:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (38, 24999.97, 'Wire Transfer', 'Pending', '2026-09-15 09:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (39, 3299.98, 'Credit Card', 'Pending', '2026-10-01 11:00:00');
INSERT INTO transactions (order_id, amount, payment_method, status, transaction_date) VALUES (40, 5999.98, 'Wire Transfer', 'Pending', '2026-11-01 10:30:00');
