-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2025 at 07:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ashesieats`
--

-- --------------------------------------------------------

--
-- Table structure for table `deliverypersons`
--

CREATE TABLE `deliverypersons` (
  `delivery_person_id` int(11) NOT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `vehicle_plate` varchar(20) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `current_location` varchar(100) DEFAULT NULL,
  `last_active` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliverypersons`
--

INSERT INTO `deliverypersons` (`delivery_person_id`, `vehicle_type`, `vehicle_plate`, `is_available`, `current_location`, `last_active`) VALUES
(1, 'Motorbike', 'AS-1234-22', 1, 'Ackornor', '2025-04-30 23:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `deliveryzones`
--

CREATE TABLE `deliveryzones` (
  `zone_id` int(11) NOT NULL,
  `zone_name` varchar(50) NOT NULL COMMENT 'Ackornor, Hallmark, Munchies',
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `estimated_delivery_time` int(11) DEFAULT NULL COMMENT 'Minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliveryzones`
--

INSERT INTO `deliveryzones` (`zone_id`, `zone_name`, `delivery_fee`, `estimated_delivery_time`) VALUES
(1, 'Ackornor', 2.50, 15),
(2, 'Hallmark', 3.00, 20),
(3, 'Munchies', 1.50, 10);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comments` text DEFAULT NULL,
  `feedback_type` enum('food_quality','service','delivery') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `order_id`, `user_id`, `rating`, `comments`, `feedback_type`, `created_at`) VALUES
(1, 1, 1, 5, 'Fast delivery and hot food. Thanks!', 'delivery', '2025-04-30 23:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `menucategories`
--

CREATE TABLE `menucategories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menucategories`
--

INSERT INTO `menucategories` (`category_id`, `category_name`, `description`, `display_order`, `is_active`) VALUES
(1, 'Breakfast', 'Morning specials and light meals', 1, 1),
(2, 'Lunch', 'Full meals for the afternoon', 2, 1),
(3, 'Drinks', 'Cold and hot beverages', 3, 1),
(4, 'Snacks', 'Light and fast meals', 4, 1),
(5, 'Main Course', 'Hearty main dishes', 1, 1),
(6, 'Appetizers', 'Light starters', 2, 1),
(7, 'Beverages', 'Drinks and refreshments', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menuitems`
--

CREATE TABLE `menuitems` (
  `item_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `nutritional_info` text DEFAULT NULL,
  `preparation_time` int(11) DEFAULT NULL COMMENT 'Minutes needed to prepare',
  `is_vegetarian` tinyint(1) DEFAULT 0,
  `contains_allergens` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `image_url` varchar(255) DEFAULT NULL,
  `restaurant_id` int(255) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menuitems`
--

INSERT INTO `menuitems` (`item_id`, `category_id`, `item_name`, `description`, `price`, `nutritional_info`, `preparation_time`, `is_vegetarian`, `contains_allergens`, `is_available`, `image_url`, `restaurant_id`) VALUES
(1, 1, 'Pancakes & Syrup', 'Fluffy pancakes served with maple syrup', 15.00, '300 kcal', 10, 1, 'gluten, eggs', 1, 'https://images.pexels.com/photos/30892992/pexels-photo-30892992/free-photo-of-delicious-pancakes-with-honey-and-strawberries.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(2, 2, 'Jollof Rice with Chicken', 'Classic Ghanaian jollof served with grilled chicken', 25.00, '600 kcal', 20, 0, 'none', 1, 'https://t4.ftcdn.net/jpg/08/36/33/67/360_F_836336748_QSgGUTSRyytsh6vER8Qi6mOqmLQUUKv8.jpg', 2),
(3, 3, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 10.00, '100 kcal', 5, 1, 'none', 1, 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(4, 4, 'Meat Pie', 'Savory pastry with meat filling', 5.00, '250 kcal', 8, 0, 'gluten', 1, 'https://images.pexels.com/photos/7906867/pexels-photo-7906867.jpeg?auto=compress&cs=tinysrgb&w=600', 0),
(5, 1, 'Jollof Rice with Chicken', 'Spicy rice with grilled chicken', 25.00, NULL, 15, 0, NULL, 1, 'https://t4.ftcdn.net/jpg/11/41/76/91/240_F_1141769173_gnVznNtGycAdtJXO1eFL0F2U4UXtnvH3.jpg', 1),
(6, 1, 'Waakye Special', 'Rice and beans with gari and spaghetti', 30.00, NULL, 20, 0, NULL, 1, 'https://i.pinimg.com/originals/ab/88/cb/ab88cb122f1c45e4677c21f84f0da199.jpg', 2),
(7, 2, 'Kelewele', 'Spicy fried plantains', 10.00, NULL, 10, 0, NULL, 1, 'https://i.pinimg.com/736x/b7/82/ce/b782ce9fca73d563b063ba79ad6e44cc.jpg', 3),
(8, 3, 'Fresh Fruit Juice', 'Seasonal fruit blend', 8.00, NULL, 5, 0, NULL, 1, 'https://images.pexels.com/photos/12973252/pexels-photo-12973252.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(9, 1, 'Spaghetti Carbonara', 'Classic Italian pasta dish', 35.00, NULL, 15, 0, NULL, 1, 'https://images.pexels.com/photos/5710178/pexels-photo-5710178.jpeg?auto=compress&cs=tinysrgb&w=600', 2),
(10, 1, 'Grilled Salmon', 'Fresh salmon with vegetables', 45.00, NULL, 20, 0, NULL, 1, 'https://images.pexels.com/photos/19532105/pexels-photo-19532105/free-photo-of-meat-rice-and-vegetables.jpeg?auto=compress&cs=tinysrgb&w=600', 3),
(11, 2, 'Garlic Bread', 'Freshly baked with garlic butter', 12.00, NULL, 5, 0, NULL, 1, 'https://images.pexels.com/photos/5593702/pexels-photo-5593702.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(12, 3, 'Iced Coffee', 'Cold brewed coffee with milk', 15.00, NULL, 5, 0, NULL, 1, 'https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(13, 1, 'Chicken Burger', 'Grilled chicken with fresh vegetables', 20.00, NULL, 10, 0, NULL, 1, 'https://images.pexels.com/photos/15662255/pexels-photo-15662255/free-photo-of-close-up-of-a-burger-and-fries.jpeg?auto=compress&cs=tinysrgb&w=600', 2),
(14, 1, 'French Fries', 'Crispy golden fries', 12.00, NULL, 8, 0, NULL, 1, 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(15, 2, 'Onion Rings', 'Crispy battered onion rings', 15.00, NULL, 8, 0, NULL, 1, 'https://images.pexels.com/photos/263049/pexels-photo-263049.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
(16, 3, 'Milkshake', 'Creamy vanilla milkshake', 18.00, NULL, 5, 0, NULL, 1, 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600', 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `message_text`, `sent_at`, `read_status`) VALUES
(1, 1, 1, 'Thank you for your service!', '2025-04-30 23:53:02', 0);

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `item_price_at_order` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`order_item_id`, `order_id`, `item_id`, `quantity`, `item_price_at_order`) VALUES
(1, 1, 2, 1, 25.00),
(2, 1, 4, 2, 5.00),
(3, 1, 3, 1, 10.00),
(4, 2, 3, 1, 10.00),
(5, 3, 6, 1, 30.00),
(6, 4, 1, 1, 15.00),
(7, 4, 3, 1, 10.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Student or staff who placed order',
  `restaurant_id` int(255) DEFAULT NULL,
  `delivery_person_id` int(11) DEFAULT NULL COMMENT 'Assigned delivery person',
  `order_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `delivery_location` varchar(100) NOT NULL COMMENT 'Charlotte, New Hosanna, Old Hosanna, Queenstar, New Masere, Old Masere, Dufie Annex, Dufie Platinum etc.',
  `delivery_option` enum('pickup','delivery') NOT NULL,
  `delivery_time_option` enum('ASAP','scheduled') NOT NULL,
  `scheduled_delivery_time` timestamp NULL DEFAULT NULL COMMENT 'For scheduled deliveries',
  `status` enum('pending','confirmed','preparing','ready_for_pickup','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('account','cash','card') NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether the order has been paid for',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when order was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `restaurant_id`, `delivery_person_id`, `order_time`, `delivery_location`, `delivery_option`, `delivery_time_option`, `scheduled_delivery_time`, `status`, `total_amount`, `payment_method`, `is_paid`, `updated_at`) VALUES
(1, 1, 1, 1, '2025-04-30 23:53:02', 'Charlotte', 'delivery', 'ASAP', NULL, 'delivered', 45.00, 'account', 1, '2025-04-30 23:53:02'),
(2, 1, 1, NULL, '2025-05-03 19:32:40', 'Pickup at restaurant', 'pickup', '', NULL, 'pending', 10.00, 'account', 1, '2025-05-04 15:57:44'),
(3, 1, 2, NULL, '2025-05-04 15:21:45', 'Pickup at restaurant', 'pickup', '', NULL, 'pending', 30.00, 'cash', 0, NULL),
(4, 1, 1, NULL, '2025-05-04 17:06:21', 'Pickup at restaurant', 'pickup', '', NULL, 'pending', 25.00, 'cash', 1, '2025-05-04 17:07:44');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `location` varchar(255) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `description`, `image_url`, `rating`, `location`, `opening_hours`, `created_at`, `updated_at`) VALUES
(1, 'Akornor', 'Authentic Ghanaian cuisine with a modern twist', 'https://ashesi.edu.gh/wp-content/uploads/2019/09/Ashesi_Dining_e.jpg', 4.0, NULL, NULL, '2025-05-02 13:36:34', '2025-05-03 12:26:41'),
(2, 'Hallmark', 'Premium dining experience with international flavors', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSipc5lfylgaTIHCfNWmXG9LhU87KjmRdMR9w&s', 4.1, NULL, NULL, '2025-05-02 13:36:34', '2025-05-03 12:58:59'),
(3, 'Munchies', 'Quick bites and snacks for your busy schedule', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZXzroLhQraiVZTXxqVrdyesPIz-BpJ_i0w&s', 3.7, NULL, NULL, '2025-05-02 13:36:34', '2025-05-03 12:59:04');

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_admins`
--

CREATE TABLE `restaurant_admins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `restaurant_id` int(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `permission_level` enum('full_access','menu_only','orders_only','reports_only','partial_access') NOT NULL DEFAULT 'partial_access'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurant_admins`
--

INSERT INTO `restaurant_admins` (`id`, `user_id`, `restaurant_id`, `created_at`, `permission_level`) VALUES
(1, 6, 1, '2025-05-03 19:57:01', 'partial_access'),
(2, 7, 2, '2025-05-03 19:57:01', 'partial_access'),
(3, 8, 3, '2025-05-03 19:57:01', 'partial_access'),
(4, 9, 3, '2025-05-04 17:12:26', 'full_access');

-- --------------------------------------------------------

--
-- Table structure for table `useraccounts`
--

CREATE TABLE `useraccounts` (
  `account_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `last_topup_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_topup_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `useraccounts`
--

INSERT INTO `useraccounts` (`account_id`, `user_id`, `balance`, `last_topup_date`, `last_topup_amount`) VALUES
(1, 1, 75.00, '2025-04-30 23:53:02', 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('student','staff','delivery_person','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `user_type`) VALUES
(1, 'Kirk', 'Kudoto', 'kirk.kudoto@ashesi.edu.gh', '0503895451', '$2b$10$sxqLLe098X1vFOBTF/dmMudDNo1/A6luGmMzyw0d1Zf21LS4A.av2', 'student'),
(6, 'Akornor', 'Admin', 'akornor.admin@ashesi.edu.gh', '0240123456', '$2b$10$sxqLLe098X1vFOBTF/dmMudDNo1/A6luGmMzyw0d1Zf21LS4A.av2', 'admin'),
(7, 'Hallmark', 'Admin', 'hallmark.admin@ashesi.edu.gh', '0550987654', '$2b$10$sxqLLe098X1vFOBTF/dmMudDNo1/A6luGmMzyw0d1Zf21LS4A.av2', 'admin'),
(8, 'Munchies', 'Admin', 'munchies.admin@ashesi.edu.gh', '0277456123', '$2b$10$sxqLLe098X1vFOBTF/dmMudDNo1/A6luGmMzyw0d1Zf21LS4A.av2', 'admin'),
(9, 'Super', 'Admin', 'super.admin@ashesi.edu.gh', '0201234567', '$2b$10$sxqLLe098X1vFOBTF/dmMudDNo1/A6luGmMzyw0d1Zf21LS4A.av2', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deliverypersons`
--
ALTER TABLE `deliverypersons`
  ADD PRIMARY KEY (`delivery_person_id`);

--
-- Indexes for table `deliveryzones`
--
ALTER TABLE `deliveryzones`
  ADD PRIMARY KEY (`zone_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `menucategories`
--
ALTER TABLE `menucategories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `menuitems`
--
ALTER TABLE `menuitems`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `delivery_person_id` (`delivery_person_id`),
  ADD KEY `orders_ibfk_3` (`restaurant_id`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `restaurant_admins`
--
ALTER TABLE `restaurant_admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Indexes for table `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deliveryzones`
--
ALTER TABLE `deliveryzones`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menucategories`
--
ALTER TABLE `menucategories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `menuitems`
--
ALTER TABLE `menuitems`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `restaurant_admins`
--
ALTER TABLE `restaurant_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `useraccounts`
--
ALTER TABLE `useraccounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deliverypersons`
--
ALTER TABLE `deliverypersons`
  ADD CONSTRAINT `deliverypersons_ibfk_1` FOREIGN KEY (`delivery_person_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `menuitems`
--
ALTER TABLE `menuitems`
  ADD CONSTRAINT `menuitems_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `menucategories` (`category_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menuitems` (`item_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`delivery_person_id`) REFERENCES `deliverypersons` (`delivery_person_id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `restaurant_admins`
--
ALTER TABLE `restaurant_admins`
  ADD CONSTRAINT `restaurant_admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `restaurant_admins_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`);

--
-- Constraints for table `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD CONSTRAINT `useraccounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
