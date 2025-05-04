-- Migration script to add is_paid column to Orders table
ALTER TABLE `orders` 
ADD COLUMN `is_paid` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether the order has been paid for' AFTER `payment_method`;

-- Update existing orders - assume delivered orders are paid
UPDATE `orders` 
SET `is_paid` = 1 
WHERE `status` = 'delivered';

-- Log migration
INSERT INTO `migrations` (`migration_name`, `executed_at`) 
VALUES ('add_is_paid_to_orders', NOW()); 