import UserNotifications   
   
class NotificationService: UNNotificationServiceExtension {
    // This function is called when a notification is received
    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        print("============DEBUG: Notification service extension triggered")
    }
}
