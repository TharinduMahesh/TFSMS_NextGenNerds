import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:growersignup/models/grower/pending_payments.dart';
import 'package:growersignup/services/grower/pending_payments_api.dart';

class PendingPaymentDetailScreen extends StatefulWidget {
  final String grossPayment;
  final int growerOrderId;

  const PendingPaymentDetailScreen({
    super.key,
    required this.growerOrderId,
    required this.grossPayment,
  });

  @override
  State<PendingPaymentDetailScreen> createState() =>
      _PendingPaymentDetailScreenState();
}

class _PendingPaymentDetailScreenState extends State<PendingPaymentDetailScreen>
    with TickerProviderStateMixin {
  late Future<PaymentDetailDto> _futurePaymentDetails;
  final PaymentApiService _apiService = PaymentApiService();

  late AnimationController _animationController;
  late AnimationController _cardAnimationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;
  late Animation<double> _cardStaggerAnimation;

  bool _isProcessingPayment = false;

  // Enhanced Color Scheme (matching PaymentsListScreen)
  static const Color primaryColor = Colors.teal;
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color warningOrange = Color(0xFFFF9800);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color lightBackground = Color(0xFFF5F5F5);

  @override
  void initState() {
    super.initState();
    _futurePaymentDetails = _apiService.getPaymentDetails(widget.growerOrderId);
    _setupAnimations();
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _cardAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _slideAnimation = Tween<double>(begin: 30.0, end: 0.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic),
    );

    _cardStaggerAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _cardAnimationController,
        curve: Curves.easeOutCubic,
      ),
    );

    _animationController.forward();
    _cardAnimationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _cardAnimationController.dispose();
    super.dispose();
  }

  void _refreshDetails() {
    setState(() {
      _futurePaymentDetails = _apiService.getPaymentDetails(
        widget.growerOrderId,
      );
    });
    _animationController.forward(from: 0);
    _cardAnimationController.forward(from: 0);
    HapticFeedback.lightImpact();
  }

  void _processPayment(PaymentDetailDto details) async {
    setState(() {
      _isProcessingPayment = true;
    });

    try {
      // Simulate payment processing
      await Future.delayed(const Duration(seconds: 2));

      HapticFeedback.heavyImpact();
      _showSuccessDialog();
    } catch (e) {
      _showErrorDialog();
    } finally {
      setState(() {
        _isProcessingPayment = false;
      });
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder:
          (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            title: Row(
              children: [
                Icon(Icons.check_circle, color: successGreen, size: 28),
                const SizedBox(width: 10),
                const Text('Payment Processed'),
              ],
            ),
            content: const Text('Payment has been successfully processed!'),
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(
                    context,
                    true,
                  ); // Return to previous screen with success
                },
                child: const Text('OK'),
              ),
            ],
          ),
    );
  }

  void _showErrorDialog() {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            title: Row(
              children: [
                Icon(Icons.error_outline, color: Colors.red, size: 28),
                const SizedBox(width: 10),
                const Text('Payment Failed'),
              ],
            ),
            content: const Text('Unable to process payment. Please try again.'),
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('OK'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightBackground,
      appBar: AppBar(
        title: const Text(
          'Payment Details',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 4,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 15),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: IconButton(
              icon: const Icon(Icons.refresh, color: Colors.white, size: 22),
              onPressed: _refreshDetails,
              tooltip: 'Refresh',
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Always show the header with gross payment from parameter
          _buildHeaderSummaryCard(),

          // Show loading, error, or content based on API call
          Expanded(
            child: FutureBuilder<PaymentDetailDto>(
              future: _futurePaymentDetails,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return _buildLoadingState();
                }

                if (snapshot.hasError) {
                  return _buildErrorState(snapshot.error.toString());
                }

                if (!snapshot.hasData) {
                  return _buildNoDataState();
                }

                final details = snapshot.data!;
                return FadeTransition(
                  opacity: _fadeAnimation,
                  child: _buildPaymentDetailsContent(details),
                );
              },
            ),
          ),
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
          borderRadius: BorderRadius.circular(15),
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
              valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
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
          borderRadius: BorderRadius.circular(15),
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
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.error_outline, color: Colors.red, size: 40),
            ),
            const SizedBox(height: 20),
            Text(
              'Error Loading Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Unable to load payment details',
              textAlign: TextAlign.center,
              style: TextStyle(color: textLight, fontSize: 14),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshDetails,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNoDataState() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(30),
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
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: warningOrange.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.receipt_long, color: warningOrange, size: 50),
            ),
            const SizedBox(height: 20),
            Text(
              'No Payment Details',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textDark,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'No details found for this payment.',
              textAlign: TextAlign.center,
              style: TextStyle(color: textLight, fontSize: 14),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshDetails,
              icon: const Icon(Icons.refresh),
              label: const Text('Refresh'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentDetailsContent(PaymentDetailDto details) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(8.0),
      child: AnimatedBuilder(
        animation: _slideAnimation,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(0, _slideAnimation.value),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Grower Information Card
                _buildAnimatedCard(0, _buildGrowerInfoCard(details)),

                const SizedBox(height: 8),

                // Tea Quantity Details Card
                _buildAnimatedCard(1, _buildTeaQuantityCard(details)),

                const SizedBox(height: 8),

                // Collector Information Card
                _buildAnimatedCard(2, _buildCollectorInfoCard(details)),
                
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildAnimatedCard(int index, Widget child) {
    return AnimatedBuilder(
      animation: _cardStaggerAnimation,
      builder: (context, _) {
        final delay = (index * 0.1).clamp(0.0, 1.0);
        final animationValue = Curves.easeOutCubic.transform(
          (_cardStaggerAnimation.value - delay).clamp(0.0, 1.0),
        );

        return Transform.translate(
          offset: Offset(0, (1 - animationValue) * 20),
          child: Opacity(opacity: animationValue, child: child),
        );
      },
    );
  }

  // Header Summary Card - Shows immediately with gross payment from parameter
  Widget _buildHeaderSummaryCard() {
    return Container(
      margin: const EdgeInsets.all(8.0),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [primaryColor, primaryColor.withOpacity(0.8)],
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Payment Amount',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Order #${widget.growerOrderId}',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Gross Payment',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      'LKR ${widget.grossPayment}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGrowerInfoCard(PaymentDetailDto details) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.person, color: primaryColor, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Grower Information',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetailRow(
              'Name',
              '${details.growerFirstName} ${details.growerLastName}',
              Icons.account_circle,
            ),
            const SizedBox(height: 12),
            _buildDetailRow(
              'Order ID',
              '#${widget.growerOrderId}',
              Icons.confirmation_number,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTeaQuantityCard(PaymentDetailDto details) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.eco, color: primaryColor, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Tea Quantity Breakdown',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildQuantityRow(
              'Super Tea',
              details.superTeaQuantity,
              Icons.star,
              Colors.amber,
            ),
            const SizedBox(height: 12),
            _buildQuantityRow(
              'Green Tea',
              details.greenTeaQuantity,
              Icons.local_florist,
              successGreen,
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: primaryColor.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total Quantity',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    '${(details.superTeaQuantity + details.greenTeaQuantity).toStringAsFixed(2)} kg',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: primaryColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCollectorInfoCard(PaymentDetailDto details) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.local_shipping, color: primaryColor, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Collector Information',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetailRow(
              'Phone Number',
              details.collectorPhoneNum,
              Icons.phone,
            ),
            const SizedBox(height: 12),
            _buildDetailRow(
              'Vehicle Number',
              details.collectorVehicleNum,
              Icons.directions_car,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: textLight),
        const SizedBox(width: 8),
        Text(label, style: TextStyle(fontSize: 14, color: textLight)),
        const Spacer(),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildQuantityRow(
    String label,
    double quantity,
    IconData icon,
    Color color,
  ) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 8),
        Text(label, style: TextStyle(fontSize: 14, color: textLight)),
        const Spacer(),
        Text(
          '${quantity.toStringAsFixed(2)} kg',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: color,
          ),
        ),
      ],
    );
  }
}
