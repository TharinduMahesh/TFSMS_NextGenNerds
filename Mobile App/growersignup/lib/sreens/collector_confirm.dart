import 'package:flutter/material.dart';

// Placeholder for a potential success page
// import 'order_confirmed_success_page.dart';

class CollectorConfirmPage extends StatefulWidget {
  const CollectorConfirmPage({super.key});

  @override
  State<CollectorConfirmPage> createState() => _CollectorConfirmPageState();
}

class _CollectorConfirmPageState extends State<CollectorConfirmPage> {
  int _bottomNavIndex = 0; // Home is selected

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color iconColor = Color(0xFF333333);
  static const Color textColor = Colors.black54;
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- Button Action ---
  void _confirmOrder() {
    print('Confirm Order button tapped');

    // *** TODO: Implement API call to finalize the order request ***
    // Example:
    /*
    try {
        // final orderId = ...; // Get order ID if needed
        // await ApiService().confirmOrder(orderId);

        ScaffoldMessenger.of(context).showSnackBar(
           const SnackBar(content: Text('Order confirmed successfully!'), backgroundColor: Colors.green),
        );
        // Navigate to a success screen or back to the home/dashboard
        Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const OrderSuccessPage()),
            (route) => route.isFirst // Go to success page, clear stack up to first route
        );

    } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
           SnackBar(content: Text('Failed to confirm order: $e'), backgroundColor: Colors.redAccent),
        );
    }
    */

    // Placeholder feedback
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Order Confirmed (Simulated)!'), backgroundColor: Colors.green),
    );
    // TODO: Implement actual navigation
    // Example: Pop back to the home page (assuming it's the root)
    Navigator.of(context).popUntil((route) => route.isFirst);
  }


  // --- Bottom Nav Logic ---
  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation based on index
    switch (index) {
      case 0: print("Navigate Home"); break; // Already here?
      case 1: print("Navigate Notifications"); break;
      case 2: print("Navigate Profile"); break;
      case 3: print("Navigate Contact Us"); break;
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      // No AppBar in this design
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Large Checkmark Icon
              const Icon(
                Icons.check_rounded, // A bold, rounded checkmark
                color: iconColor,
                size: 120.0,
              ),
              const SizedBox(height: 40),

              // Descriptive Text
              const Text(
                'Request a Collector get picked up by\na nearby community',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: textColor,
                  fontSize: 15,
                  height: 1.4, // Line spacing
                ),
              ),
              const SizedBox(height: 30),

              // Confirm Button
              ElevatedButton(
                onPressed: _confirmOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: buttonColor,
                  foregroundColor: buttonTextColor,
                  minimumSize: const Size(double.infinity, 50), // Full width
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0), // Pill shape
                  ),
                  elevation: 2,
                ),
                child: const Text(
                  'Confirm Order',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        items: const [
           BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
           BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Notification'),
           BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
           BottomNavigationBarItem(icon: Icon(Icons.star_outline), activeIcon: Icon(Icons.star), label: 'Contact us'),
        ],
      ),
    );
  }
}