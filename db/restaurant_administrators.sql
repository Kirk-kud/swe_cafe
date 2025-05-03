-- Table for mapping staff users to restaurants they can administer
CREATE TABLE IF NOT EXISTS `restaurant_administrators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,  -- References users.user_id
  `restaurant_id` int(255) NOT NULL,  -- References restaurants.id
  `permission_level` enum('full_access','menu_only','orders_only','reports_only') NOT NULL DEFAULT 'full_access',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,  -- User who granted this access
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_restaurant_unique` (`user_id`, `restaurant_id`),
  KEY `fk_admin_user` (`user_id`),
  KEY `fk_admin_restaurant` (`restaurant_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_admin_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert example administrators
INSERT INTO `restaurant_administrators` (`user_id`, `restaurant_id`, `permission_level`) VALUES 
(1, 1, 'full_access');  -- Give the first user admin access to Akornor restaurant 