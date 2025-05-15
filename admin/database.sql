-- Create database and table
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(20) NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(100) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room VARCHAR(50) NOT NULL,
  total DECIMAL(12,0) NOT NULL,
  status ENUM('Check In','Confirmed','Check Out') NOT NULL
);

-- Sample data
INSERT INTO bookings (booking_id, guest_name, guest_email, check_in, check_out, room, total, status) VALUES
('BK-2504', 'Rudi Setiawan', 'rudi.s@email.com', '2025-04-15', '2025-04-17', 'Deluxe Room 201', 2500000, 'Check In'),
('BK-2503', 'Maya Putri', 'maya.p@email.com', '2025-04-14', '2025-04-16', 'Suite Room 501', 4800000, 'Confirmed'),
('BK-2502', 'Bambang Wijaya', 'bambang.w@email.com', '2025-04-13', '2025-04-15', 'Executive Room 302', 3200000, 'Check Out');