import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/to_payment_models.dart';
import 'package:growersignup/services/collector/accepted_orders_api.dart';
import 'package:growersignup/sreens/collector/orders/c_order_select_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/collector/home_pages/show_collector_edit_page.dart';
import 'package:growersignup/sreens/collector/home_pages/accepted_paymnets.dart';
import 'package:intl/intl.dart'; // For date formatting

class AcceptedPaymentDetailScreen extends StatefulWidget {
  final String email;
  final int orderId;

  const AcceptedPaymentDetailScreen({
    super.key,
    required this.orderId,
    required this.email,
  });

  @override
  State<AcceptedPaymentDetailScreen> createState() => _AcceptedPaymentDetailScreenState();
}

class _AcceptedPaymentDetailScreenState extends State<AcceptedPaymentDetailScreen> with TickerProviderStateMixin {
  late Future<PaymentDetail> _detailsFuture;
  int _bottomNavIndex = 1; // Payments tab

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final AcceptedPaymentsApiService _apiService = AcceptedPaymentsApiService();

  // Enhanced Color Scheme (matching collector theme)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color accentGreen = Color(0xFFB2E7AE);

  @override
  void initState() {
    super.initState();
    _detailsFuture = _apiService.getPaymentDetails(widget.orderId);
    
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _refreshPaymentDetails() {
    setState(() {
      _detailsFuture = _apiService.getPaymentDetails(widget.orderId);
      _animationController.forward(from: 0);
    });
  }

  // Navigation Methods
  void _navigateToOrders() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorOrderSelectPage(email: widget.email)),
    );
  }

  void _navigateToPayments() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => AcceptedPaymentsListScreen(email: widget.email)),
    );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorHomePage(email: widget.email)),
    );
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
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorDetailsPage(email: widget.email)),
    );
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
          'Payment Details',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: primaryGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _refreshPaymentDetails,
          ),
        ],
      ),
      body: FutureBuilder<PaymentDetail>(
        future: _detailsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return _buildLoadingState();
          }
          
          if (snapshot.hasError) {
            return _buildErrorState(snapshot.error.toString());
          }

          final details = snapshot.data!;
          return FadeTransition(
            opacity: _fadeAnimation,
            child: _buildPaymentDetails(details),
          );
        },
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

  Widget _buildLoadingState() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(30),
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
              strokeWidth: 3,
            ),
            const SizedBox(height: 20),
            Text(
              'Loading payment details...',
              style: TextStyle(
                color: textLight,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(30),
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Icon(Icons.error_outline, color: Colors.red, size: 40),
            ),
            const SizedBox(height: 20),
            Text(
              'Error Loading Payment',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: textLight, fontSize: 14),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshPaymentDetails,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentDetails(PaymentDetail details) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Payment Completed Status Card
          _buildCompletedStatusCard(details),
          
          const SizedBox(height: 20),
          
          // Tea Details Card
          _buildTeaDetailsCard(details),
          
          const SizedBox(height: 20),
          
          // Grower Information Card
          _buildGrowerInfoCard(details),
          
          const SizedBox(height: 20),
          
          // Payment Information Card
          _buildPaymentInfoCard(details),
          
          const SizedBox(height: 100), // Space for navigation
        ],
      ),
    );
  }

  Widget _buildCompletedStatusCard(PaymentDetail details) {
    return Container(
      padding: const EdgeInsets.all(25),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [successGreen, successGreen.withOpacity(0.8)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: successGreen.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.check_circle, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 15),
              const Text(
                'Payment Completed',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'LKR ${details.totalAmount.toStringAsFixed(2)}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            'Total Payment Amount',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.check, color: Colors.white, size: 16),
                const SizedBox(width: 5),
                Text(
                  'Cash Payment Processed',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeaDetailsCard(PaymentDetail details) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.eco, color: primaryGreen, size: 20),
              ),
              const SizedBox(width: 10),
              Text(
                'Tea Collection Summary',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          _buildDetailRow('Super Tea Quantity', '${details.superTeaQuantity} kg', Icons.star, Colors.amber),
          const SizedBox(height: 15),
          _buildDetailRow('Green Tea Quantity', '${details.greenTeaQuantity} kg', Icons.eco_outlined, primaryGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Total Quantity', '${details.superTeaQuantity + details.greenTeaQuantity} kg', Icons.scale, successGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Net Payment', 'LKR ${details.totalAmount.toStringAsFixed(2)}', Icons.account_balance_wallet, successGreen),
        ],
      ),
    );
  }

  Widget _buildGrowerInfoCard(PaymentDetail details) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.person, color: primaryGreen, size: 20),
              ),
              const SizedBox(width: 10),
              Text(
                'Grower Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          _buildDetailRow('Grower Name', details.growerName, Icons.person_outline, primaryGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Phone Number', details.growerPhoneNum, Icons.phone, Colors.blue),
          const SizedBox(height: 15),
          _buildDetailRow('Address', details.growerAddressLine1, Icons.location_on, Colors.red),
          if (details.growerAddressLine2 != null && details.growerAddressLine2!.isNotEmpty) ...[
            const SizedBox(height: 15),
            _buildDetailRow('Address Line 2', details.growerAddressLine2!, Icons.location_on_outlined, Colors.red),
          ],
          const SizedBox(height: 15),
          _buildDetailRow('City', details.growerCity, Icons.location_city_outlined, Colors.orange),
          if (details.growerPostalCode != null && details.growerPostalCode!.isNotEmpty) ...[
            const SizedBox(height: 15),
            _buildDetailRow('Postal Code', details.growerPostalCode!, Icons.markunread_mailbox, Colors.purple),
          ],
        ],
      ),
    );
  }

  Widget _buildPaymentInfoCard(PaymentDetail details) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: successGreen.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: successGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.receipt_long, color: successGreen, size: 20),
              ),
              const SizedBox(width: 10),
              Text(
                'Payment Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          _buildDetailRow('Order ID', '#${widget.orderId}', Icons.assignment, Colors.blue),
          const SizedBox(height: 15),
          _buildDetailRow('Payment Status', 'Completed', Icons.check_circle, successGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Payment Method', 'Cash Payment', Icons.money, Colors.green),
          const SizedBox(height: 15),
          _buildDetailRow('Processed Date', DateFormat.yMMMd().add_jm().format(DateTime.now()), Icons.access_time, Colors.grey),
          
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: successGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: successGreen.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Icon(Icons.verified, color: successGreen, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'This payment has been successfully processed and completed.',
                    style: TextStyle(
                      color: successGreen,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, IconData icon, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: accentGreen.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: textLight,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 14,
                    color: textDark,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}