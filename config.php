<?php
$host = "localhost";
$dbname = "contact_form";
$username = "root";
$password = ""; // Change this if your MySQL has a password

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
