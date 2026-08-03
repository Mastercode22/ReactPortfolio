<?php
include 'config.php'; // Connect to database
$success = "";
$error = "";

// Only handle form if it's submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = htmlspecialchars(strip_tags($_POST['name']));
    $email   = htmlspecialchars(strip_tags($_POST['email']));
    $phone   = htmlspecialchars(strip_tags($_POST['phone']));
    $subject = htmlspecialchars(strip_tags($_POST['subject']));
    $message = htmlspecialchars(strip_tags($_POST['message']));

    $stmt = $conn->prepare("INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);

    if ($stmt->execute()) {
        $success = "Message sent successfully. we will get back to you soon Thank You!!";
    } else {
        $error = "Error sending your message. please try again";
    }

    $stmt->close();
}
?>
