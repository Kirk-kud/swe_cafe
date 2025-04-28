drop database if exists AshesiEats;
create database AshesiEats;
use AshesiEats;
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'staff', 'delivery_person', 'admin') NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE DeliveryPersons (
    delivery_person_id INT PRIMARY KEY,
    vehicle_type VARCHAR(50),
    vehicle_plate VARCHAR(20),
    is_available BOOLEAN DEFAULT TRUE,
    current_location VARCHAR(100),
    last_active TIMESTAMP,
    FOREIGN KEY (delivery_person_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE MenuCategories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE MenuItems (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    nutritional_info TEXT,
    preparation_time INT COMMENT 'Minutes needed to prepare',
    is_vegetarian BOOLEAN DEFAULT FALSE,
    contains_allergens VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES MenuCategories(category_id)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'Student or staff who placed order',
    delivery_person_id INT COMMENT 'Assigned delivery person',
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_location VARCHAR(100) NOT NULL COMMENT 'Charlotte, New Hosanna, Old Hosanna, Queenstar, New Masere, Old Masere, Dufie Annex, Dufie Platinum etc.',
    delivery_option ENUM('pickup', 'delivery') NOT NULL,
    delivery_time_option ENUM('ASAP', 'scheduled') NOT NULL,
    scheduled_delivery_time TIMESTAMP NULL COMMENT 'For scheduled deliveries',
    status ENUM(
        'pending', 
        'confirmed', 
        'preparing', 
        'ready_for_pickup', 
        'out_for_delivery', 
        'delivered', 
        'cancelled'
    ) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('account', 'cash', 'card') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (delivery_person_id) REFERENCES DeliveryPersons(delivery_person_id)
);

CREATE TABLE OrderItems (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    item_price_at_order DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
);

CREATE TABLE UserAccounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_topup_date TIMESTAMP,
    last_topup_amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE DeliveryZones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(50) NOT NULL COMMENT 'Ackornor, Hallmark, Munchies',
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    estimated_delivery_time INT COMMENT 'Minutes'
);

CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_type ENUM('food_quality', 'service', 'delivery') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
