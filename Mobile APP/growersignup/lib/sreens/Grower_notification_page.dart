import 'package:flutter/material.dart';

class GrowerNotificationsPage extends StatefulWidget {
  const GrowerNotificationsPage({super.key});

  @override
  State<GrowerNotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<GrowerNotificationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 255, 255, 255),
        elevation: 2,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.black),
            onPressed: () {
              // Handle settings press
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(
              child: Text(
                "Notifications",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0C330D),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              "Today",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 10),
            NotificationItem(
                title: "Payment",
                message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit.",
                isSelected: false),
            const SizedBox(height: 20),
            const Text(
              "Earlier",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: 6, // Number of "Earlier" items
                itemBuilder: (context, index) {
                  return NotificationItem(
                      title: "Payment",
                      message:
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit.",
                      isSelected: false);
                },
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
      bottomNavigationBar: navigationBar(),
    );
  }
}

class NotificationItem extends StatelessWidget {
  const NotificationItem(
      {Key? key,
      required this.title,
      required this.message,
      required this.isSelected})
      : super(key: key);

  final String title;
  final String message;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: isSelected
            ? Border.all(color: Colors.lightBlueAccent, width: 2.0)
            : null,
        borderRadius: BorderRadius.circular(8.0),
      ),
      padding: const EdgeInsets.all(8.0),
      margin: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.topRight,
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Color(0xFF0C330D),
                  shape: BoxShape.circle,
                ),
              ),
              Positioned(
                top: 5,
                right: 5,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: const BoxDecoration(
                    color: Colors.lightGreen,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  message,
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                ),
              ],
            ),
          ),
          const Text(
            "1m ago.",
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
Widget navigationBar() {
  return BottomNavigationBar(
    type: BottomNavigationBarType.fixed,
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.notifications),
        label: 'Notifications',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person),
        label: 'profile',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.contact_support),
        label: 'contact',
      ),   
    ],
    selectedItemColor: const Color.fromARGB(255, 0, 0, 0),
  );
}

