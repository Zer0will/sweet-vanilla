CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productType` enum('pastel','docena','churros') NOT NULL,
	`item` varchar(191) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`flavor` varchar(191),
	`filling` varchar(191),
	`decoration` text,
	`occasion` varchar(191),
	`deliveryDate` varchar(10) NOT NULL,
	`customerName` varchar(191) NOT NULL,
	`customerPhone` varchar(32) NOT NULL,
	`notes` text,
	`photoUrls` text,
	`estimatedTotal` int NOT NULL,
	`status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
