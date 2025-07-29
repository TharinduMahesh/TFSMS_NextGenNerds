import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/home_pages/accepted_paymnets.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/collector/home_pages/show_collector_edit_page.dart';
import 'package:growersignup/sreens/collector/home_pages/to_pay_sreen.dart';
import 'package:growersignup/sreens/collector/orders/c_order_select_page.dart';
import 'package:growersignup/sreens/grower/orders/g_accepted_by_c.dart';
import 'package:growersignup/sreens/grower/orders/g_peding_orders.dart';
import '../../grower/home_pages/grower_home_page.dart';
import '../../grower/home_pages/grower_harvest.dart';

import '../../conversation_pages/conversation_list_screen.dart';
import '../../grower/home_pages/show_supplier_details.dart';

class PaymentSelect extends StatefulWidget {
  final String email;
  const PaymentSelect({super.key, required this.email});

  @override
  State<PaymentSelect> createState() => _PaymentSelectPageState();
}

class _PaymentSelectPageState extends State<PaymentSelect> {
  int _bottomNavIndex = 2;

  // Enhanced Color Scheme
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color warningOrange = Color(0xFFFF9800);
  static const Color successGreen = Color(0xFF4CAF50);

  // Navigation Methods
  void _navigateToHarvest() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorOrderSelectPage(email: widget.email)),
    );
  }

  void _navigateToPayments() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => PaymentsPage(email: widget.email)),
    // );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorHomePage(email: widget.email)),
    );
  }

  void _navigateToMessages() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => ConversationListScreen(email: widget.email)),
    // );
  }

  void _navigateToProfile() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorDetailsPage(email: widget.email)),
    );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: _navigateToHarvest(); break;
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
        title: const Text('Paymen Management', style: TextStyle(color: Colors.white)),
        backgroundColor: primaryGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Pending Orders Card
            _buildOrderCard(
              title: 'Pending Payments',
              subtitle: 'View incoming order requests',
              icon: Icons.pending_actions,
              color: warningOrange,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => PendingPaymentsScreen(email: widget.email)),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Accepted Orders Card
            _buildOrderCard(
              title: 'Paid Payments',
              subtitle: 'Track your accepted orders',
              icon: Icons.check_circle_outline,
              color: successGreen,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AcceptedPaymentsListScreen(email: widget.email)),
              ),
            ),
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
                icon: Icon(Icons.eco_outlined),
                activeIcon: Icon(Icons.eco),
                label: 'Harvest',
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
                Icon(Icons.arrow_forward_ios, size: 16, color: textLight),
              ],
            ),
          ),
        ),
      ),
    );
  }
}