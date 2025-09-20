import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/pending_order_details.dart';
import 'package:growersignup/services/collector/order_accepted_api.dart';
import 'package:growersignup/sreens/collector/orders/c_order_select_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/collector/orders/weighing_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/collector/home_pages/show_collector_edit_page.dart';

class AcceptedOrderDetailsPage extends StatefulWidget {
  final String email;
  final int orderId;

  const AcceptedOrderDetailsPage({
    super.key,
    required this.orderId,
    required this.email,
  });

  @override
  State<AcceptedOrderDetailsPage> createState() =>
      _AcceptedOrderDetailsPageState();
}

class _AcceptedOrderDetailsPageState extends State<AcceptedOrderDetailsPage>
    with TickerProviderStateMixin {
  late Future<OrderDetails> _detailsFuture;
  int _bottomNavIndex = 0;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

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
    _detailsFuture = OrderAcceptedApiService.getOrderDetails(widget.orderId);

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

  void _refreshOrderDetails() {
    setState(() {
      _detailsFuture = OrderAcceptedApiService.getOrderDetails(widget.orderId);
      _animationController.forward(from: 0);
    });
  }

  void _navigateToOrders() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => CollectorOrderSelectPage(email: widget.email),
      ),
    );
  }

  void _navigateToPayments() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(
    //     builder: (context) => CollectorPaymentSelectPage(email: widget.email),
    //   ),
    // );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => CollectorHomePage(email: widget.email),
      ),
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
      MaterialPageRoute(
        builder: (context) => CollectorDetailsPage(email: widget.email),
      ),
    );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    switch (index) {
      case 0:
        _navigateToOrders();
        break;
      case 1:
        _navigateToPayments();
        break;
      case 2:
        _navigateToHome();
        break;
      case 3:
        _navigateToMessages();
        break;
      case 4:
        _navigateToProfile();
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      appBar: AppBar(
        title: const Text(
          'Accepted Collection Details',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: primaryGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _refreshOrderDetails,
          ),
        ],
      ),
      body: FutureBuilder<OrderDetails>(
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
            child: _buildOrderDetails(details),
          );
        },
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    return Container(
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
          selectedLabelStyle:
              const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
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
    );
  }

  Widget _buildOrderDetails(OrderDetails details) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          _buildStatusCard(details),
          const SizedBox(height: 20),
          _buildTeaDetailsCard(details),
          const SizedBox(height: 20),
          _buildGrowerCard(details),
          const SizedBox(height: 20),
          _buildCollectionCard(details),
          const SizedBox(height: 20),
          ElevatedButton.icon(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => WeighingPage(
          orderId: widget.orderId,
          email: widget.email,
          superLeafWeight: details.superTeaQuantity.toString(),
          greenLeafWeightFromOrder: details.greenTeaQuantity.toString(),

        ),
      ),
    );
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: primaryGreen,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  icon: const Icon(Icons.scale),
  label: const Text(
    'Weighing',
    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
  ),
),

          const SizedBox(height: 100),
        ],
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
              'Loading collection details...',
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
              child:
                  const Icon(Icons.error_outline, color: Colors.red, size: 40),
            ),
            const SizedBox(height: 20),
            Text(
              'Error Loading Collection',
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
              onPressed: _refreshOrderDetails,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
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

  Widget _buildStatusCard(OrderDetails details) {
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
                child: const Icon(Icons.check_circle,
                    color: Colors.white, size: 24),
              ),
              const SizedBox(width: 15),
              const Text(
                'Collection Accepted',
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
            '${details.totalTea} kg',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            'Total Tea for Collection',
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
              'Collection #${widget.orderId}',
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeaDetailsCard(OrderDetails details) {
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
                'Tea Collection Details',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildDetailRow(
              'Super Tea', '${details.superTeaQuantity} kg', Icons.star, successGreen),
          const SizedBox(height: 15),
          _buildDetailRow(
              'Green Tea', '${details.greenTeaQuantity} kg', Icons.eco_outlined, primaryGreen),
          const SizedBox(height: 15),
          _buildDetailRow(
              'Payment Method', details.paymentMethod, Icons.payment, Colors.blue),
          const SizedBox(height: 15),
          _buildDetailRow(
              'Collection Date', _formatDate(details.placeDate), Icons.calendar_today, Colors.orange),
        ],
      ),
    );
  }

  Widget _buildGrowerCard(OrderDetails details) {
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
          _buildDetailRow('Name', details.growerName, Icons.person_outline, primaryGreen),
          const SizedBox(height: 15),
          _buildDetailRow('NIC Number', details.nic, Icons.credit_card, Colors.orange),
          const SizedBox(height: 15),
          _buildDetailRow('Phone Number', details.phoneNumber, Icons.phone, Colors.green),
          const SizedBox(height: 15),
          _buildDetailRow('Location', details.city, Icons.location_on, Colors.red),
        ],
      ),
    );
  }

  Widget _buildCollectionCard(OrderDetails details) {
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
                child:
                    Icon(Icons.local_shipping, color: primaryGreen, size: 20),
              ),
              const SizedBox(width: 10),
              Text(
                'Collection Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildDetailRow(
              'Collection Address',
              '${details.addressLine1}, ${details.addressLine2 ?? ''}, ${details.city}',
              Icons.location_on_outlined,
              Colors.blue),
          const SizedBox(height: 15),
          _buildDetailRow(
              'Postal Code',
              details.postalCode ?? 'Not specified',
              Icons.local_post_office,
              Colors.purple),
          const SizedBox(height: 15),
          _buildDetailRow(
              'Status', 'Ready for Collection', Icons.check_circle_outline, successGreen),
        ],
      ),
    );
  }

  Widget _buildDetailRow(
      String label, String value, IconData icon, Color iconColor) {
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

  String _formatDate(DateTime date) =>
      '${date.day}/${date.month}/${date.year}';
}