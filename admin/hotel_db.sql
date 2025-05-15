-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Bulan Mei 2025 pada 14.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_id` varchar(20) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `guest_email` varchar(100) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `room` varchar(50) NOT NULL,
  `total` decimal(12,0) NOT NULL,
  `status` enum('Check In','Confirmed','Check Out') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `booking_id`, `guest_name`, `guest_email`, `check_in`, `check_out`, `room`, `total`, `status`) VALUES
(1, 'BK-2504', 'Rudi Setiawan', 'rudi.s@email.com', '2025-04-15', '2025-04-17', 'Deluxe Room 201', 2500000, 'Check In'),
(2, 'BK-2503', 'Maya Putri', 'maya.p@email.com', '2025-04-14', '2025-04-16', 'Suite Room 501', 4800000, 'Confirmed'),
(3, 'BK-2502', 'Bambang Wijaya', 'bambang.w@email.com', '2025-04-13', '2025-04-15', 'Executive Room 302', 3200000, 'Check Out'),
(4, 'BK-2504', 'Rudi Setiawan', 'rudi.s@email.com', '2025-04-15', '2025-04-17', 'Deluxe Room 201', 2500000, 'Check In'),
(5, 'BK-2503', 'Maya Putri', 'maya.p@email.com', '2025-04-14', '2025-04-16', 'Suite Room 501', 4800000, 'Confirmed'),
(6, 'BK-2502', 'Bambang Wijaya', 'bambang.w@email.com', '2025-04-13', '2025-04-15', 'Executive Room 302', 3200000, 'Check Out'),
(7, 'BK-2501', 'Intan Permata', 'intan.p@email.com', '2025-04-12', '2025-04-14', 'Standard Room 105', 1500000, 'Confirmed'),
(8, 'BK-2500', 'Agus Santoso', 'agus.s@email.com', '2025-04-11', '2025-04-13', 'Superior Room 307', 2800000, 'Check In'),
(9, 'BK-2499', 'Sari Wulandari', 'sari.w@email.com', '2025-04-10', '2025-04-12', 'Deluxe Room 202', 2600000, 'Confirmed'),
(10, 'BK-2498', 'Dewi Ratnasari', 'dewi.r@email.com', '2025-04-09', '2025-04-11', 'Suite Room 502', 5000000, 'Check Out'),
(11, 'BK-2497', 'Budi Hartono', 'budi.h@email.com', '2025-04-08', '2025-04-10', 'Executive Room 303', 3300000, 'Check In'),
(12, 'BK-2496', 'Citra Maharani', 'citra.m@email.com', '2025-04-07', '2025-04-09', 'Standard Room 106', 1550000, 'Confirmed'),
(13, 'BK-2495', 'Eko Prasetyo', 'eko.p@email.com', '2025-04-06', '2025-04-08', 'Superior Room 308', 2900000, 'Check Out'),
(14, 'BK-2494', 'Fiona Kusuma', 'fiona.k@email.com', '2025-04-05', '2025-04-07', 'Deluxe Room 203', 2550000, 'Confirmed'),
(15, 'BK-2493', 'Galih Pratama', 'galih.p@email.com', '2025-04-04', '2025-04-06', 'Suite Room 503', 5100000, 'Check In');

-- --------------------------------------------------------

--
-- Struktur dari tabel `receptionists`
--

CREATE TABLE `receptionists` (
  `id` int(11) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `receptionists`
--

INSERT INTO `receptionists` (`id`, `avatar_url`, `name`, `username`, `email`, `status`, `created_at`) VALUES
(2, 'https://i.pravatar.cc/150?img=2', 'Budi Pratama', 'budi_p', 'budi.p@hotelbahagia.com', 'Aktif', '2025-02-02 00:00:00'),
(3, 'https://i.pravatar.cc/150?img=3', 'Siti Dewi', 'siti_d', 'siti.d@hotelbahagia.com', 'Nonaktif', '2025-01-10 00:00:00'),
(4, 'https://i.pravatar.cc/150?img=4', 'Indra Hermawan', 'indra_h', 'indra.h@hotelbahagia.com', 'Aktif', '2024-12-05 00:00:00'),
(5, 'https://i.pravatar.cc/150?img=5', 'Dian Wulandari', 'dian_w', 'dian.w@hotelbahagia.com', 'Aktif', '2024-11-20 00:00:00'),
(6, 'https://i.pravatar.cc/150?img=6', 'Eka Surya', 'eka_s', 'eka.s@hotelbahagia.com', 'Nonaktif', '2024-10-12 00:00:00'),
(8, 'https://i.pravatar.cc/150?img=8', 'Gilang Adi', 'gilang_a', 'gilang.a@hotelbahagia.com', 'Aktif', '2024-08-18 00:00:00'),
(9, 'https://i.pravatar.cc/150?img=9', 'Hendra Kurnia', 'hendra_k', 'hendra.k@hotelbahagia.com', 'Nonaktif', '2024-07-07 00:00:00'),
(10, 'https://i.pravatar.cc/150?img=10', 'Intan Permata', 'intan_p', 'intan.p@hotelbahagia.com', 'Aktif', '2024-06-25 00:00:00'),
(11, 'https://i.pravatar.cc/150?img=11', 'Joko Santoso', 'joko_s', 'joko.s@hotelbahagia.com', 'Aktif', '2024-05-13 00:00:00'),
(12, 'https://i.pravatar.cc/150?img=12', 'Kartika Sari', 'kartika_s', 'kartika.s@hotelbahagia.com', 'Nonaktif', '2024-04-01 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_number` varchar(50) DEFAULT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  `status` enum('available','occupied') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rooms`
--

INSERT INTO `rooms` (`id`, `room_number`, `room_type`, `status`) VALUES
(1, '101', 'Deluxe', 'available'),
(2, '102', 'Standard', 'occupied'),
(3, '103', 'Superior', 'available'),
(4, '104', 'Deluxe', 'occupied');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `receptionists`
--
ALTER TABLE `receptionists`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `receptionists`
--
ALTER TABLE `receptionists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
