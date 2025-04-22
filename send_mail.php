<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $to = "your@email.com";
  $subject = "Contact Form Submission";
  $message = "Name: " . $_POST['first_name'] . " " . $_POST['last_name'] . "\n";
  $message .= "Email: " . $_POST['email'] . "\n";
  $message .= "Subject: " . $_POST['subject'] . "\n";
  $message .= "Message:\n" . $_POST['message'];
  $headers = "From: " . $_POST['email'];

  if (mail($to, $subject, $message, $headers)) {
    echo "Message sent successfully.";
  } else {
    echo "Message sending failed.";
  }
}
?>
