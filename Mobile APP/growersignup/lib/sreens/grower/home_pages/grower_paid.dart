import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:growersignup/models/grower/pending_payments.dart';
import 'package:growersignup/services/grower/pending_payments_api.dart';
import 'package:growersignup/sreens/grower/home_pages/pending_payments.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';

class PaidPaymentsListScreen extends StatefulWidget {
  final String email;

  const PaidPaymentsListScreen({super.key, required this.email});

  @override
  State<PaidPaymentsListScreen> createState() => _PaidPaymentsListScreenState();
}

class _PaidPaymentsListScreenState extends State<PaidPaymentsListScreen> 
    with TickerProviderStateMixin {
  late Future<List<PaymentDto>> _paymentsFuture;
  int _bottomNavIndex = 1; // Payments tab

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final PaymentApiService _apiService = PaymentApiService();

  // Enhanced Color Scheme (matching PendingPaymentsScreen)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);

  @override
  void initState() {
    super.initState();
    _paymentsFuture = _apiService.getPaidCashPayments(widget.email);
    
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

  void _refreshPayments() {
    setState(() {
      _paymentsFuture = _apiService.getPaidCashPayments(widget.email);
      _animationController.forward(from: 0);
    });
    HapticFeedback.lightImpact();
  }

  // Navigation Methods
  void _navigateToHarvest() {
    // Navigate to harvest page
  }

  void _navigateToPayments() {
    // Current page - no action needed
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerHomePage(email: widget.email)),
    );
  }

  void _navigateToMessages() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => ChatListScreen(
          currentUserEmail: widget.email,
          currentUserType: "Grower",
        ),
      ),
    );
  }

  void _navigateToProfile() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerDetailsPage(email: widget.email)),
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
        title: const Text(
          'Paid Payments',
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
              onPressed: _refreshPayments,
              tooltip: 'Refresh',
            ),
          ),
        ],
      ),
      body: FutureBuilder<List<PaymentDto>>(
        future: _paymentsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return _buildLoadingState();
          }
          
          if (snapshot.hasError) {
            return _buildErrorState(snapshot.error.toString());
          }

          final payments = snapshot.data!;
          
          if (payments.isEmpty) {
            return _buildEmptyState();
          }

          return FadeTransition(
            opacity: _fadeAnimation,
            child: _buildPaymentsList(payments),
          );
        },
      ),
      
      // Bottom Navigation Bar (matching PendingPaymentsScreen)
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
              'Loading paid payments...',
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
              child: Icon(Icons.error_outline, color: Colors.red, size: 40),
            ),
            const SizedBox(height: 20),
            Text(
              'Error Loading Payments',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Unable to load paid payment information',
              textAlign: TextAlign.center,
              style: TextStyle(color: textLight, fontSize: 14),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshPayments,
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

  Widget _buildEmptyState() {
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
                color: successGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Icon(Icons.check_circle, color: successGreen, size: 50),
            ),
            const SizedBox(height: 20),
            Text(
              'No Paid Payments',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'You have no completed payments yet.',
              textAlign: TextAlign.center,
              style: TextStyle(color: textLight, fontSize: 14),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshPayments,
              icon: const Icon(Icons.refresh),
              label: const Text('Refresh'),
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

  Widget _buildPaymentsList(List<PaymentDto> payments) {
    final totalAmount = payments.fold<double>(
      0.0, 
      (sum, payment) => sum + payment.grossPayment,
    );

    return Column(
      children: [
        // Summary Header Section
        Container(
          padding: const EdgeInsets.all(20),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [successGreen.withOpacity(0.1), successGreen.withOpacity(0.05)],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: successGreen.withOpacity(0.2)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: successGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.check_circle, color: successGreen, size: 20),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      '${payments.length} Completed Payment${payments.length > 1 ? 's' : ''}',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textDark,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 15),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildQuickStat(
                      'Total Earned',
                      'LKR ${totalAmount.toStringAsFixed(2)}',
                      Icons.account_balance_wallet,
                      successGreen,
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: successGreen.withOpacity(0.2),
                    ),
                    _buildQuickStat(
                      'Average',
                      'LKR ${(totalAmount / payments.length).toStringAsFixed(2)}',
                      Icons.trending_up,
                      primaryGreen,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        
        // Payments List
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async => _refreshPayments(),
            color: primaryGreen,
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: payments.length,
              itemBuilder: (context, index) {
                final payment = payments[index];
                return _buildPaymentCard(payment, index);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildQuickStat(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 5),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
          textAlign: TextAlign.center,
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: textLight,
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentCard(PaymentDto payment, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: successGreen.withOpacity(0.2)),
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
          onTap: () {
            HapticFeedback.lightImpact();
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PendingPaymentDetailScreen(
                  growerOrderId: payment.growerOrderId,
                  grossPayment: payment.grossPayment.toString(),
                ),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: successGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.check_circle, color: successGreen, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${payment.collectorFirstName} ${payment.collectorLastName}',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textDark,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Row(
                            children: [
                              Icon(Icons.receipt_long, size: 14, color: textLight),
                              const SizedBox(width: 4),
                              Text(
                                'Order #${payment.growerOrderId}',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: textLight,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: successGreen.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: successGreen.withOpacity(0.3)),
                          ),
                          child: Text(
                            'LKR ${payment.grossPayment.toStringAsFixed(2)}',
                            style: TextStyle(
                              color: successGreen,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Icon(Icons.arrow_forward_ios, size: 16, color: textLight),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 15),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.location_on_outlined, size: 16, color: textLight),
                      const SizedBox(width: 8),
                      Text(
                        payment.collectorCity,
                        style: TextStyle(
                          fontSize: 13,
                          color: textLight,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: successGreen.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'PAID',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: successGreen,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: successGreen.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.visibility, color: successGreen, size: 16),
                      const SizedBox(width: 5),
                      Text(
                        'Tap to view details',
                        style: TextStyle(
                          color: successGreen,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}