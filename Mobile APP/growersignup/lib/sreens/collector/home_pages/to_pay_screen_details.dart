import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/to_payment_models.dart';
import 'package:growersignup/services/collector/to_payment_api_service.dart';
import 'package:growersignup/sreens/collector/orders/c_order_select_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/collector/home_pages/show_collector_edit_page.dart';
import 'package:growersignup/sreens/collector/home_pages/to_pay_sreen.dart';

class PaymentDetailScreen extends StatefulWidget {
  final int orderId;
  final int paymentId;

  const PaymentDetailScreen({
    super.key,
    required this.orderId,
    required this.paymentId,
  });

  @override
  State<PaymentDetailScreen> createState() => _PaymentDetailScreenState();
}

class _PaymentDetailScreenState extends State<PaymentDetailScreen> with TickerProviderStateMixin {
  late Future<PaymentDetail> _detailsFuture;
  int _bottomNavIndex = 1; // Payments tab
  bool _isAccepting = false;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final PaymentApiService _apiService = PaymentApiService();

  // Enhanced Color Scheme (matching collector theme)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color warningOrange = Color(0xFFFF9800);
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

  void _acceptPayment() async {
    setState(() {
      _isAccepting = true;
    });

    try {
      await _apiService.acceptPayment(widget.paymentId);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 10),
                Text('Payment accepted successfully!'),
              ],
            ),
            backgroundColor: successGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            duration: const Duration(seconds: 3),
          ),
        );
        
        Navigator.pop(context, true); // Return true to signal payment was processed
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error, color: Colors.white),
                const SizedBox(width: 10),
                Text('Error accepting payment: $e'),
              ],
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            duration: const Duration(seconds: 3),
          ),
        );
      }
      setState(() {
        _isAccepting = false;
      });
    }
  }

  // Navigation Methods
  void _navigateToOrders() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorOrderSelectPage(email: '')),
    );
  }

  void _navigateToPayments() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => PendingPaymentsScreen(email: '')),
    );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorHomePage(email: '')),
    );
  }

  void _navigateToMessages() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(
    //     builder: (context) => ChatListScreen(
    //       currentUserEmail: email,
    //       currentUserType: "Collector",
    //     ),
    //   ),
    // );
  }

  void _navigateToProfile() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => CollectorDetailsPage(email: '')),
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
          // Payment Status Card
          _buildStatusCard(details),
          
          const SizedBox(height: 20),
          
          // Tea Details Card
          _buildTeaDetailsCard(details),
          
          const SizedBox(height: 20),
          
          // Grower Information Card
          _buildGrowerInfoCard(details),
          
          const SizedBox(height: 30),
          
          // Action Buttons
          _buildActionButtons(details),
          
          const SizedBox(height: 100), // Space for navigation
        ],
      ),
    );
  }

  Widget _buildStatusCard(PaymentDetail details) {
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
                child: const Icon(Icons.account_balance_wallet, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 15),
              const Text(
                'Payment Pending',
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
            child: Text(
              'Awaiting Cash Payment',
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
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
          
          _buildDetailRow('Super Tea Quantity', '${details.superTeaQuantity} kg', Icons.star, warningOrange),
          const SizedBox(height: 15),
          _buildDetailRow('Green Tea Quantity', '${details.greenTeaQuantity} kg', Icons.eco_outlined, primaryGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Total Quantity', '${details.superTeaQuantity + details.greenTeaQuantity} kg', Icons.scale, successGreen),
          const SizedBox(height: 15),
          _buildDetailRow('Net Payment', 'LKR ${details.totalAmount.toStringAsFixed(2)}', Icons.account_balance_wallet, Colors.green),
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
          _buildDetailRow('Address', '${details.growerAddressLine1}', Icons.location_on, Colors.red),
          const SizedBox(height: 15),
          _buildDetailRow('City', details.growerCity, Icons.location_city_outlined, Colors.orange),
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

  Widget _buildActionButtons(PaymentDetail details) {
    return Column(
      children: [
        // Accept Payment Button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _isAccepting ? null : () => _showAcceptDialog(details),
            icon: _isAccepting 
                ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Icon(Icons.check_circle, color: Colors.white),
            label: Text(
              _isAccepting ? 'Processing Payment...' : 'Accept Payment',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: successGreen,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 3,
            ),
          ),
        ),
      ],
    );
  }

  void _showAcceptDialog(PaymentDetail details) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          title: Row(
            children: [
              Icon(Icons.account_balance_wallet, color: successGreen),
              const SizedBox(width: 10),
              Text('Confirm Payment', style: TextStyle(color: successGreen)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Are you sure you want to accept this payment?'),
              const SizedBox(height: 15),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: successGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Grower:', style: TextStyle(fontWeight: FontWeight.w500)),
                        Text(details.growerName),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Amount:', style: TextStyle(fontWeight: FontWeight.w500)),
                        Text('LKR ${details.totalAmount.toStringAsFixed(2)}', 
                             style: TextStyle(fontWeight: FontWeight.bold, color: successGreen)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: Text('Cancel', style: TextStyle(color: textLight)),
              onPressed: () => Navigator.of(context).pop(),
            ),
            ElevatedButton(
              child: const Text('Confirm Payment'),
              style: ElevatedButton.styleFrom(
                backgroundColor: successGreen,
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.of(context).pop();
                _acceptPayment();
              },
            ),
          ],
        );
      },
    );
  }
}