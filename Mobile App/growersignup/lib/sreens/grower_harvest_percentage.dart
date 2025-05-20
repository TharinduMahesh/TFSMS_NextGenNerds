import 'dart:math' as math; // Needed for Pi in the painter
import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower_order_page.dart';

// Placeholder for the page navigated to by the FAB
// import 'grower_order_page.dart';

class HarvestPage extends StatefulWidget {
  const HarvestPage({super.key});

  @override
  State<HarvestPage> createState() => _HarvestPageState();
}

class _HarvestPageState extends State<HarvestPage> {
  // --- State Variables ---
  int _bottomNavIndex = 0; // Home is selected

  // TODO: Replace with actual data fetching logic
  // Example Data (replace with state variables updated from API)
  final double _totalHarvestKg = 120.0;
  final double _superTeaKg = 30.0;
  final double _normalTeaKg = 90.0;
  final String _dateRangeOrSubtitle = "..."; // Replace with actual date/subtitle

  // Calculated percentages for the gauge
  double get _superTeaPercentage => _totalHarvestKg > 0 ? (_superTeaKg / _totalHarvestKg) : 0.0;
  double get _normalTeaPercentage => _totalHarvestKg > 0 ? (_normalTeaKg / _totalHarvestKg) : 0.0;


  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Light green background
  static const Color appBarColor = pageBackgroundColor;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = titleColor;
  static const Color cardBackgroundColor = Colors.white;
  static const Color summaryCardColor = Color(0xFFDDF4DD); // Light green for summary cards
  static const Color summaryTextColor = Colors.black87;
  static const Color gaugeNormalColor = Color(0xFFB2E7AE); // Light green gauge segment
  static const Color gaugeSuperColor = Color(0xFF0a4e41); // Dark green gauge segment
  static const Color gaugeBackgroundColor = Color(0xFFE0E0E0); // Background track
  static const Color centerIconBackgroundColor = Colors.white;
  static const Color centerIconColor = titleColor;
  static const Color fabColor = Colors.black;
  static const Color fabIconColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  @override
  void initState() {
    super.initState();
    // TODO: Call function here to fetch data from API
    // _fetchHarvestData();
  }

  // Placeholder for API call
  // Future<void> _fetchHarvestData() async {
  //   setState(() => _isLoading = true);
  //   try {
  //     // final data = await ApiService().getHarvestSummary();
  //     // setState(() {
  //     //   _totalHarvestKg = data['total'];
  //     //   _superTeaKg = data['super'];
  //     //   _normalTeaKg = data['normal'];
  //     //   _dateRangeOrSubtitle = data['dateRange'];
  //     //   _isLoading = false;
  //     // });
  //   } catch (e) {
  //     // setState(() {
  //     //   _isLoading = false;
  //     //   _errorMessage = "Failed to load data";
  //     // });
  //   }
  // }


  // --- Bottom Nav Logic ---
  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation based on index
    switch (index) {
      case 0: print("Navigate Home"); break;
      case 1: print("Navigate Notifications"); break;
      case 2: print("Navigate Profile"); break;
      case 3: print("Navigate Contact Us"); break;
    }
  }

  // --- FAB Action ---
  void _addHarvestEntry() {
     print("FAB tapped - Navigate to Add Harvest");
    Navigator.push(context, MaterialPageRoute(builder: (context) => const GrowerOrderPage())); // Navigate to your form page
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Add Harvest screen'), backgroundColor: Colors.blueAccent),
      );
  }

  void _openSettings() {
     print('Settings icon tapped');
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey),
      );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: appBarColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Harvest',
          style: TextStyle(color: titleColor, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: _openSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              _dateRangeOrSubtitle, // Placeholder '...'
              style: TextStyle(color: Colors.grey.shade600, fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 20),
            _buildSummaryCards(),
            const SizedBox(height: 25),
            _buildTeaQualityCard(),
            const SizedBox(height: 80), // Add space to prevent overlap with potential FAB expansion
          ],
        ),
      ),
       floatingActionButtonLocation: FloatingActionButtonLocation.endFloat, // Position near bottom nav
       floatingActionButton: FloatingActionButton(
         onPressed: _addHarvestEntry,
         backgroundColor: fabColor,
         foregroundColor: fabIconColor,
         shape: const CircleBorder(), // Make it circular
         child: const Icon(Icons.add),
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

  // --- Helper Widgets ---

  Widget _buildSummaryCards() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildSummaryCard('Total\nHarvest', '${_totalHarvestKg.toStringAsFixed(0)}Kg'),
        _buildSummaryCard('Total Super\nTea Harvest', '${_superTeaKg.toStringAsFixed(0)}Kg'),
        _buildSummaryCard('Total Normal\nTea Harvest', '${_normalTeaKg.toStringAsFixed(0)}Kg'),
      ],
    );
  }

  Widget _buildSummaryCard(String title, String value) {
    return Expanded( // Use Expanded to distribute space
      child: Card(
        color: summaryCardColor,
        elevation: 1.5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
        margin: const EdgeInsets.symmetric(horizontal: 4), // Add slight horizontal margin
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 18.0, horizontal: 8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: summaryTextColor.withOpacity(0.9),
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: summaryTextColor.withOpacity(1.0),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTeaQualityCard() {
    final double gaugeSize = MediaQuery.of(context).size.width * 0.65; // Adjust size relative to screen

    return Card(
      color: cardBackgroundColor,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const Text(
              'Tea Quality',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: titleColor),
            ),
            const SizedBox(height: 25),
            SizedBox(
              width: gaugeSize,
              height: gaugeSize * 0.6, // Height is less for a semi-circle effect + labels
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // The Gauge using CustomPaint
                  CustomPaint(
                    size: Size(gaugeSize, gaugeSize * 0.55), // Control painter size
                    painter: TeaQualityPainter(
                      normalPercentage: _normalTeaPercentage, // Pass calculated percentage
                      superPercentage: _superTeaPercentage, // Pass calculated percentage
                      normalColor: gaugeNormalColor,
                      superColor: gaugeSuperColor,
                      backgroundColor: gaugeBackgroundColor,
                      strokeWidth: 18.0, // Adjust thickness of the gauge line
                    ),
                  ),
                  // Center Icon Container
                  Positioned(
                    // Position slightly above center if needed, depends on gauge visual center
                     bottom: gaugeSize * 0.15, // Adjust vertical position
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: centerIconBackgroundColor,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.3),
                            blurRadius: 8,
                            spreadRadius: 1,
                          )
                        ],
                      ),
                      child: const Icon(Icons.eco_outlined, color: centerIconColor, size: 28), // Placeholder leaf icon
                    ),
                  ),
                   // Percentage Labels below gauge arc
                   Positioned(
                     bottom: 0, // Position labels at the bottom of the Stack
                     left: 0,
                     right: 0,
                     child: Padding(
                       padding: EdgeInsets.symmetric(horizontal: gaugeSize * 0.1), // Adjust padding relative to gauge size
                       child: Row(
                         mainAxisAlignment: MainAxisAlignment.spaceBetween,
                         children: [
                           Text(
                             '${(_normalTeaPercentage * 100).toStringAsFixed(0)}%',
                             style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.black54),
                           ),
                           Text(
                             '${(_superTeaPercentage * 100).toStringAsFixed(0)}%',
                             style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.black54),
                           ),
                         ],
                       ),
                     ),
                   ),
                ],
              ),
            ),
             const SizedBox(height: 10), // Space between percentages and label
             const Text(
               'Super Tea', // This seems to label the dark green part
               style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87),
             ),
             const SizedBox(height: 5), // Padding at bottom of card
          ],
        ),
      ),
    );
  }
}


// --- Custom Painter for the Semi-Circular Gauge ---

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
    final center = Offset(size.width / 2, size.height); // Center at bottom-middle
    final radius = size.width / 2;
    const startAngle = -math.pi; // Start from the left (-180 degrees)
    const sweepAngle = math.pi; // Sweep 180 degrees for semi-circle

    // Background paint
    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round; // Rounded ends for the track

    // Draw the background track
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      backgroundPaint,
    );

    // Calculate sweep angles for segments
    final normalSweep = sweepAngle * normalPercentage;
    final superSweep = sweepAngle * superPercentage;

    // Normal Tea paint
    final normalPaint = Paint()
      ..color = normalColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Draw the normal tea arc
    if (normalSweep > 0) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle, // Start from the left
        normalSweep,
        false,
        normalPaint,
      );
    }

    // Super Tea paint
    final superPaint = Paint()
      ..color = superColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Draw the super tea arc, starting after the normal tea arc
    if (superSweep > 0) {
       canvas.drawArc(
         Rect.fromCircle(center: center, radius: radius),
         startAngle + normalSweep, // Start where normal arc ended
         superSweep,
         false,
         superPaint,
       );
    }
  }

  @override
  bool shouldRepaint(covariant TeaQualityPainter oldDelegate) {
    // Repaint if percentages or colors change
    return oldDelegate.normalPercentage != normalPercentage ||
           oldDelegate.superPercentage != superPercentage ||
           oldDelegate.normalColor != normalColor ||
           oldDelegate.superColor != superColor ||
           oldDelegate.backgroundColor != backgroundColor ||
           oldDelegate.strokeWidth != strokeWidth;
  }
}