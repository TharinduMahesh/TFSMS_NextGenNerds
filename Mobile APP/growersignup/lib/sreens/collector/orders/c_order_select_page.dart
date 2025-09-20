import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/orders/accepted_orders_page.dart';
import 'package:growersignup/sreens/collector/orders/pending_orders_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';

class CollectorOrderSelectPage extends StatefulWidget {
  final String email;
  const CollectorOrderSelectPage({super.key, required this.email});

  @override
  State<CollectorOrderSelectPage> createState() => _CollectorOrderSelectPageState();
}

class _CollectorOrderSelectPageState extends State<CollectorOrderSelectPage> {
  int _bottomNavIndex = 0;

  // Enhanced Color Scheme (matching grower theme)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color warningOrange = Color(0xFFFF9800);
  static const Color successGreen = Color(0xFF4CAF50);

  // Navigation Methods
  void _navigateToOrders() {
    // Current page - no action needed
  }

  void _navigateToPayments() {
    Navigator.pushReplacementNamed(context, '/collector-payments', arguments: widget.email);
  }

  void _navigateToHome() {
    Navigator.pushReplacementNamed(context, '/collector-home', arguments: widget.email);
  }

  void _navigateToMessages() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => ChatListScreen(
          currentUserEmail: widget.email,
          currentUserType: "Collector",
        ),
      ),
    );
  }

  void _navigateToProfile() {
    Navigator.pushReplacementNamed(context, '/collector-profile', arguments: widget.email);
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: _navigateToOrders(); break;
      case 1: _navigateToPayments(); break;
      case 2: _navigateToHome(); break;
      case 3: _navigateToMessages(); break;
      case 4: _navigateToProfile(); break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      appBar: AppBar(
        title: const Text(
          'Order Management',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: primaryGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 15),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(10),
            ),
            child: IconButton(
              icon: const Icon(Icons.refresh, color: Colors.white, size: 22),
              onPressed: () {
                // Refresh functionality
                setState(() {});
              },
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
            
            // // Pending Orders Card
            _buildOrderCard(
              title: 'Pending Requests',
              subtitle: 'View new tea collection requests from growers',
              icon: Icons.pending_actions,
              color: warningOrange,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PendingOrdersPage(email: widget.email),
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Accepted Orders Card
            _buildOrderCard(
              title: 'Accepted Requests',
              subtitle: 'Track your confirmed collection',
              icon: Icons.check_circle_outline,
              color: successGreen,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AcceptedOrdersPage(email: widget.email),
                ),
              ),
            ),
            
            const Spacer(),
          ],
        ),
      ),
      
      // Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              blurRadius: 15,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
          child: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: _bottomNavIndex,
            selectedItemColor: primaryGreen,
            unselectedItemColor: textLight,
            backgroundColor: Colors.transparent,
            elevation: 0,
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
            unselectedLabelStyle: const TextStyle(fontSize: 11),
            onTap: _onBottomNavTapped,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.assignment_outlined),
                activeIcon: Icon(Icons.assignment),
                label: 'Orders',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.payment_outlined),
                activeIcon: Icon(Icons.payment),
                label: 'Payments',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.message_outlined),
                activeIcon: Icon(Icons.message),
                label: 'Messages',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                activeIcon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrderCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(15),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 30),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textDark,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 14,
                          color: textLight,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Icon(Icons.arrow_forward_ios, size: 16, color: textLight),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: primaryGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: primaryGreen,
                size: 24,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }
}