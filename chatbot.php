<?php
session_start();

if (!isset($_SESSION['chat_history'])) {
    $_SESSION['chat_history'] = [];
}

if (isset($_POST['message'])) {
    $userMessage = strtolower(trim($_POST['message']));
    $_SESSION['chat_history'][] = ['user' => $userMessage];

    $response = getBotResponse($userMessage);

    $_SESSION['chat_history'][] = ['bot' => $response];
    echo $response;
}

function getBotResponse($message) {
    if (strpos($message, 'website') !== false) {
        return "I can help you build a modern and responsive website. Would you like to discuss the details? You can contact me through the contact page or WhatsApp.";
    } elseif (strpos($message, 'app') !== false) {
        return "I can develop a custom application to meet your needs. Let's talk about your project. You can reach out to me via the contact form or WhatsApp.";
    } elseif (strpos($message, 'price') !== false) {
        return "My pricing varies depending on the project's scope and complexity. To get a quote, please contact me with your project details through the contact page or WhatsApp.";
    } elseif (strpos($message, 'contact') !== false) {
        return "You can contact me through the contact form on this website or by clicking the WhatsApp button. I'm looking forward to hearing from you!";
    } else {
        return "I'm not sure how to answer that. You can ask me about 'website', 'app', 'price', or 'contact'. If you need more help, feel free to use the contact form.";
    }
}
?>