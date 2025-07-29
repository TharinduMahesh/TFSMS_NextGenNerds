import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:growersignup/models/grower/grower_harvest_model.dart';
import 'package:growersignup/services/grower/grower_harwest_api.dart';
import 'package:growersignup/sreens/grower/home_pages/g_payment_select.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';

class GrowerHarvestPage extends StatefulWidget {
  final String email;
  const GrowerHarvestPage({super.key, required this.email});

  @override
  State<GrowerHarvestPage> createState() => _GrowerHarvestPageState();
}

class _GrowerHarvestPageState extends State<GrowerHarvestPage> with TickerProviderStateMixin {
  GrowerHarvestSummary? _harvestSummary;
  bool _isLoading = true;
  String _errorMessage = '';
  int _bottomNavIndex = 0;
  String _selectedTimePeriod = 'This Week';

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _gaugeAnimation;

  // Enhanced Color Scheme
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color warningOrange = Color(0xFFFF9800);
  static const Color superTeaColor = Color(0xFF0a4e41);
  static const Color normalTeaColor = Color(0xFFB2E7AE);
  static const Color gaugeBackgroundColor = Color(0xFFE8F5E8);

  // Time period options
  final List<String> _timePeriods = [
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'Last 3 Months',
    'This Year',
    'Next Week',
    'Next Month',
    'Next 3 Months',
  ];

  @override
  void initState() {
    super.initState();
    _fetchHarvestSummary();
    
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    
    _gaugeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.elasticOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _fetchHarvestSummary() async {
    try {
      final apiService = ApiService();
      final summary = await apiService.fetchHarvestSummaryByPeriod(
        widget.email, 
        _selectedTimePeriod
      );
      setState(() {
        _harvestSummary = summary;
        _isLoading = false;
      });
      _animationController.forward();
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load harvest data. Please try again.';
        _isLoading = false;
      });
    }
  }

  void _onTimePeriodChanged(String period) {
    setState(() {
      _selectedTimePeriod = period;
      _isLoading = true;
    });
    _animationController.reset();
    _fetchHarvestSummary();
  }

  // Navigation Methods
  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerHomePage(email: widget.email)),
    );
  }

  void _navigateToPayments() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerPaymentDetailsSelectPage(email: widget.email)),
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
      MaterialPageRoute(builder: (context) => GrowerPaymentDetailsSelectPage(email: widget.email)),
    );
  }

  void _navigateToAddOrder() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => GrowerOrderPage(email: widget.email)),
    );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: break;
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
      body: CustomScrollView(
        slivers: [
          // Custom App Bar
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: primaryGreen,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [primaryGreen, primaryGreen.withOpacity(0.8)],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.eco, color: Colors.white, size: 20),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              'Harvest Summary',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 15),
                        // Time Period Selector
                        _buildTimePeriodSelector(),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 15),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: IconButton(
                  icon: const Icon(Icons.refresh, color: Colors.white),
                  onPressed: () {
                    setState(() {
                      _isLoading = true;
                    });
                    _fetchHarvestSummary();
                  },
                ),
              ),
            ],
          ),

          // Main Content
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                if (_isLoading)
                  _buildLoadingState()
                else if (_harvestSummary == null)
                  _buildErrorState()
                else
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: _buildHarvestContent(),
                  ),
              ]),
            ),
          ),
        ],
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

  Widget _buildTimePeriodSelector() {
    return Container(
      height: 40,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _timePeriods.length,
        itemBuilder: (context, index) {
          final period = _timePeriods[index];
          final isSelected = period == _selectedTimePeriod;
          
          return Container(
            margin: const EdgeInsets.only(right: 10),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(20),
                onTap: () => _onTimePeriodChanged(period),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected 
                        ? Colors.white
                        : Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected 
                          ? Colors.white
                          : Colors.white.withOpacity(0.3),
                    ),
                  ),
                  child: Text(
                    period,
                    style: TextStyle(
                      color: isSelected ? primaryGreen : Colors.white,
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadingState() {
    return Container(
      height: 400,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
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
              children: [
                CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
                  strokeWidth: 3,
                ),
                const SizedBox(height: 20),
                Text(
                  'Loading harvest data for $_selectedTimePeriod...',
                  style: TextStyle(
                    color: textLight,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Container(
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
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: warningOrange.withOpacity(0.1),
              borderRadius: BorderRadius.circular(50),
            ),
            child: Icon(
              Icons.eco_outlined,
              color: warningOrange,
              size: 50,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'No Harvest Data Found',
            style: TextStyle(
              color: textDark,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'No harvest data available for $_selectedTimePeriod',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: textLight,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              setState(() {
                _isLoading = true;
              });
              _fetchHarvestSummary();
            },
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
    );
  }

  Widget _buildHarvestContent() {
    final totalHarvest = _harvestSummary!.totalHarvest;
    final superTea = _harvestSummary!.totalSuperTeaQuantity;
    final normalTea = _harvestSummary!.totalGreenTeaQuantity;
    
    return Column(
      children: [
        // Period Summary Header
        _buildPeriodSummaryHeader(),
        
        const SizedBox(height: 20),
        
        // Summary Cards
        _buildSummarySection(),
        
        const SizedBox(height: 30),
        
        // Tea Quality Distribution
        _buildQualityDistribution(totalHarvest, superTea, normalTea),
        
        const SizedBox(height: 30),
        
        // Harvest Timeline (if orders exist)
        if (_harvestSummary!.orders.isNotEmpty)
          _buildHarvestTimeline(),
        
        const SizedBox(height: 100), // Space for FAB and bottom nav
      ],
    );
  }

  Widget _buildPeriodSummaryHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [primaryGreen.withOpacity(0.1), accentGreen.withOpacity(0.1)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: primaryGreen.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.calendar_today, color: primaryGreen, size: 20),
              ),
              const SizedBox(width: 10),
              Text(
                'Harvest Summary for $_selectedTimePeriod',
                style: TextStyle(
                  fontSize: 16,
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
                'Orders',
                '${_harvestSummary!.orders.length}',
                Icons.receipt_long,
                primaryGreen,
              ),
              Container(
                width: 1,
                height: 40,
                color: primaryGreen.withOpacity(0.2),
              ),
              _buildQuickStat(
                'Total Harvest',
                '${_harvestSummary!.totalHarvest.toStringAsFixed(1)} kg',
                Icons.eco,
                successGreen,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStat(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 5),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: textLight,
          ),
        ),
      ],
    );
  }

  Widget _buildSummarySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Harvest Breakdown',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
        ),
        const SizedBox(height: 15),
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: cardBackground,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: primaryGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.eco, color: primaryGreen, size: 24),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Total Harvest',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textDark,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${_harvestSummary!.totalHarvest.toStringAsFixed(1)} Kg',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: primaryGreen,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 15),
        Row(
          children: [
            Expanded(
              child: _buildSummaryCard(
                'Normal Tea',
                '${_harvestSummary!.totalGreenTeaQuantity.toStringAsFixed(1)} Kg',
                Icons.local_florist,
                accentGreen.withOpacity(0.8),
              ),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: _buildSummaryCard(
                'Super Tea',
                '${_harvestSummary!.totalSuperTeaQuantity.toStringAsFixed(1)} Kg',
                Icons.star,
                successGreen,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(16),
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
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textDark,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: textLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQualityDistribution(double totalHarvest, double superTea, double normalTea) {
    if (totalHarvest == 0) {
      return Container(
        padding: const EdgeInsets.all(25),
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
          children: [
            Row(
              children: [
                Icon(Icons.pie_chart, color: textLight, size: 24),
                const SizedBox(width: 10),
                Text(
                  'Tea Quality Distribution',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              'No harvest data available for this period',
              style: TextStyle(
                color: textLight,
                fontSize: 14,
              ),
            ),
          ],
        ),
      );
    }

    final normalPercentage = normalTea / totalHarvest;
    final superPercentage = superTea / totalHarvest;
    final gaugeSize = MediaQuery.of(context).size.width * 0.7;

    return Container(
      padding: const EdgeInsets.all(25),
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
        children: [
          Row(
            children: [
              Icon(Icons.pie_chart, color: primaryGreen, size: 24),
              const SizedBox(width: 10),
              Text(
                'Tea Quality Distribution',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 25),
          AnimatedBuilder(
            animation: _gaugeAnimation,
            builder: (context, child) {
              return SizedBox(
                width: gaugeSize,
                height: gaugeSize * 0.7,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CustomPaint(
                      size: Size(gaugeSize, gaugeSize * 0.6),
                      painter: TeaQualityPainter(
                        normalPercentage: normalPercentage * _gaugeAnimation.value,
                        superPercentage: superPercentage * _gaugeAnimation.value,
                        normalColor: normalTeaColor,
                        superColor: superTeaColor,
                        backgroundColor: gaugeBackgroundColor,
                        strokeWidth: 20.0,
                      ),
                    ),
                    Positioned(
                      bottom: gaugeSize * 0.2,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: primaryGreen.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Icon(Icons.eco, size: 30, color: primaryGreen),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildLegendItem('Normal Tea', '${(normalPercentage * 100).toStringAsFixed(0)}%', normalTeaColor),
              _buildLegendItem('Super Tea', '${(superPercentage * 100).toStringAsFixed(0)}%', superTeaColor),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(String label, String percentage, Color color) {
    return Column(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: textLight,
          ),
        ),
        Text(
          percentage,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildHarvestTimeline() {
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
              Icon(Icons.timeline, color: primaryGreen, size: 24),
              const SizedBox(width: 10),
              Text(
                'Recent Harvest Activity',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...(_harvestSummary!.orders.take(5).map((order) => _buildTimelineItem(order))),
          if (_harvestSummary!.orders.length > 5)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Text(
                'and ${_harvestSummary!.orders.length - 5} more orders...',
                style: TextStyle(
                  color: textLight,
                  fontSize: 12,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(dynamic order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: lightGreen.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: BorderSide(
            width: 4,
            color: primaryGreen,
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: primaryGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(Icons.eco, color: primaryGreen, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Order #${order.growerOrderId ?? 'N/A'}',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Super: ${order.superTeaQuantity ?? 0}kg, Green: ${order.greenTeaQuantity ?? 0}kg',
                  style: TextStyle(
                    fontSize: 12,
                    color: textLight,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${((order.superTeaQuantity ?? 0) + (order.greenTeaQuantity ?? 0)).toStringAsFixed(1)}kg',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: primaryGreen,
            ),
          ),
        ],
      ),
    );
  }
}

class TeaQualityPainter extends CustomPainter {
  final double normalPercentage;
  final double superPercentage;
  final Color normalColor;
  final Color superColor;
  final Color backgroundColor;
  final double strokeWidth;

  TeaQualityPainter({
    required this.normalPercentage,
    required this.superPercentage,
    required this.normalColor,
    required this.superColor,
    required this.backgroundColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height);
    final radius = size.width / 2 - strokeWidth / 2;
    const startAngle = -math.pi;
    const sweepAngle = math.pi;

    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final normalPaint = Paint()
      ..color = normalColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final superPaint = Paint()
      ..color = superColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Draw background arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      backgroundPaint,
    );

    // Draw normal tea arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle * normalPercentage,
      false,
      normalPaint,
    );

    // Draw super tea arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle + (sweepAngle * normalPercentage),
      sweepAngle * superPercentage,
      false,
      superPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}