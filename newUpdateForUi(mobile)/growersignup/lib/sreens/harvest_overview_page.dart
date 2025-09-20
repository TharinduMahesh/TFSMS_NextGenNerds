import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart'; // Import the charting library

// Enum for time frame selection
enum TimeFrame { monthly, annually }

// Placeholder for the page navigated to by the FAB
// import 'grower_order_page.dart';

class HarvestOverviewPage extends StatefulWidget {
  const HarvestOverviewPage({super.key});

  @override
  State<HarvestOverviewPage> createState() => _HarvestOverviewPageState();
}

class _HarvestOverviewPageState extends State<HarvestOverviewPage> {
  // --- State Variables ---
  int _bottomNavIndex = 0; // Home selected
  TimeFrame _selectedTimeFrame = TimeFrame.annually; // Default selection

  // TODO: Replace with actual data fetching logic and state management
  // Example Placeholder Data (replace with state updated from API)
  Map<TimeFrame, List<FlSpot>> _chartData = {
    TimeFrame.monthly: [
      const FlSpot(0, 5.5), // Example: Month 1, 5.5 kg
      const FlSpot(1, 6.1),
      const FlSpot(2, 5.8),
      const FlSpot(3, 6.5),
      const FlSpot(4, 6.2),
      const FlSpot(5, 7.0),
    ],
    TimeFrame.annually: [
      const FlSpot(0, 50), // Example: Year 1, 50 kg (Matches screenshot somewhat)
      const FlSpot(1, 58),
      const FlSpot(2, 62),
      const FlSpot(3, 70),
      const FlSpot(4, 71),
      const FlSpot(5, 75), // Example: Year 6, 75 kg
    ],
  };
  // Chart axis limits - should be calculated based on actual data
  double _minY = 40;
  double _maxY = 80; // Add padding above max data point
  double _yInterval = 10;


  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color appBarColor = pageBackgroundColor;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = titleColor;
  static const Color cardBackgroundColor = Colors.white;
  static const Color toggleSelectedBgColor = Colors.white; // Selected tab background
  static const Color toggleUnselectedBgColor = Colors.transparent; // Unselected tab bg
  static const Color toggleSelectedTextColor = titleColor;
  static const Color toggleUnselectedTextColor = Colors.black54;
  static Color chartLineColor = Colors.black;
  static Color chartDotColor = Colors.black;
  static List<Color> chartGradientColors = [ titleColor.withOpacity(0.8), gaugeNormalColor.withOpacity(0.6), gaugeNormalColor.withOpacity(0.1)]; // Dark to light green gradient
  static const Color gaugeNormalColor = Color(0xFFB2E7AE); // Light green for gradient end
  static const Color motivationCardColor = Colors.white;
  static const Color motivationTextColor = Colors.black87;
  static const Color fabColor = Colors.black;
  static const Color fabIconColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---


  @override
  void initState() {
    super.initState();
    // TODO: Call function here to fetch initial chart data
    // _loadChartData(_selectedTimeFrame);
    _updateChartBounds(); // Calculate bounds based on initial data
  }

  // Placeholder for API data fetching
  Future<void> _loadChartData(TimeFrame timeFrame) async {
     print("Loading data for: $timeFrame");
    // setState(() => _isLoading = true); // Add loading state if needed
    // try {
    //   // final data = await ApiService().getHarvestChartData(timeFrame);
    //   // Update _chartData[timeFrame] = processDataToFlSpots(data);
    //   // Recalculate bounds: _updateChartBounds();
    //   // setState(() => _isLoading = false);
    // } catch (e) {
    //   // Handle error
    //   // setState(() => _isLoading = false);
    // }
     _updateChartBounds(); // Update bounds after (simulated) data load
  }

  // Calculate appropriate Y axis bounds based on current data
  void _updateChartBounds() {
     final List<FlSpot> currentData = _chartData[_selectedTimeFrame] ?? [];
     if (currentData.isEmpty) {
       _minY = 0;
       _maxY = 10; // Default range if no data
       _yInterval = 2;
       return;
     }

     double minY = currentData.first.y;
     double maxY = currentData.first.y;
     for (var spot in currentData) {
       if (spot.y < minY) minY = spot.y;
       if (spot.y > maxY) maxY = spot.y;
     }

     // Determine a reasonable interval (e.g., 10, 20, 50)
     double range = maxY - minY;
     if (range <= 0) range = 10; // Avoid division by zero or zero range

     if (range <= 50) _yInterval = 10;
     else if (range <= 100) _yInterval = 20;
     else if (range <= 200) _yInterval = 50;
     else _yInterval = 100;

     // Adjust min/max to align with intervals and add padding
     _minY = ((minY - _yInterval) / _yInterval).floor() * _yInterval; // Round down to nearest interval below data
     _maxY = ((maxY + _yInterval) / _yInterval).ceil() * _yInterval; // Round up to nearest interval above data

     if (_minY < 0) _minY = 0; // Don't go below zero for weight
     if (_maxY == _minY) _maxY += _yInterval; // Ensure max > min

      // Ensure the Y-axis labels match the screenshot if using placeholder data
      if (_selectedTimeFrame == TimeFrame.annually && currentData.length == 6) {
           _minY = 40;
           _maxY = 80;
           _yInterval = 10;
       }

     setState(() {}); // Trigger rebuild with new bounds
  }


  // --- Event Handlers ---
  void _onTimeFrameSelected(TimeFrame selection) {
    if (_selectedTimeFrame != selection) {
      setState(() => _selectedTimeFrame = selection);
      _loadChartData(selection); // Load data for the new time frame
    }
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation
    print("Bottom Nav Tapped: $index");
  }

  void _addHarvestEntry() {
     print("FAB tapped - Navigate to Add Harvest");
     // Navigator.push(context, MaterialPageRoute(builder: (context) => const GrowerOrderPage()));
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
        backgroundColor: appBarColor, elevation: 0, centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text('Harvest', style: TextStyle(color: titleColor, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: _openSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 10.0, bottom: 80), // Padding includes bottom space for FAB
        child: Column(
          children: [
             _buildTimeFrameToggle(),
             const SizedBox(height: 20),
             _buildChartCard(),
             const SizedBox(height: 20),
             _buildMotivationalCard(),
              const SizedBox(height: 20),
              Text(
                 "...", // Placeholder text from screenshot
                 style: TextStyle(color: Colors.grey.shade600, fontSize: 20, fontWeight: FontWeight.bold),
              )
          ],
        ),
      ),
       floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
       floatingActionButton: FloatingActionButton(
         onPressed: _addHarvestEntry,
         backgroundColor: fabColor, foregroundColor: fabIconColor,
         shape: const CircleBorder(),
         child: const Icon(Icons.add),
       ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed, backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor, unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex, onTap: _onBottomNavTapped,
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

  // --- Widget Builder Methods ---

  Widget _buildTimeFrameToggle() {
    // Use a Stack for slight overlap effect if needed, or simpler Row
    return Container(
       // Optional background container if needed for complex overlap
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildToggleButton('Monthly', TimeFrame.monthly),
          _buildToggleButton('Annually', TimeFrame.annually),
        ],
      ),
    );
  }

  Widget _buildToggleButton(String text, TimeFrame frame) {
    final bool isSelected = _selectedTimeFrame == frame;
    return GestureDetector(
      onTap: () => _onTimeFrameSelected(frame),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
         margin: const EdgeInsets.symmetric(horizontal: 2), // Minimal margin between buttons
        decoration: BoxDecoration(
          color: isSelected ? toggleSelectedBgColor : toggleUnselectedBgColor,
          borderRadius: BorderRadius.circular(20), // Rounded corners for tabs
           border: isSelected ? null : Border.all(color: Colors.grey.shade300), // Border for unselected
          boxShadow: isSelected ? [ // Shadow for selected tab to make it pop
            BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 5, offset: const Offset(0, 2))
          ] : null,
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isSelected ? toggleSelectedTextColor : toggleUnselectedTextColor,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            fontSize: 14,
          ),
        ),
      ),
    );
  }


  Widget _buildChartCard() {
     final List<FlSpot> currentSpots = _chartData[_selectedTimeFrame] ?? [];

    return Card(
      color: cardBackgroundColor,
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
             Text(
              '${_selectedTimeFrame == TimeFrame.annually ? "Annually" : "Monthly"} Overview',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: titleColor),
            ),
             const SizedBox(height: 20),
             _buildChartLegend(), // Legend item
             const SizedBox(height: 10),
            AspectRatio( // Use AspectRatio to control chart dimensions
              aspectRatio: 1.5, // Adjust aspect ratio as needed (width/height)
              child: currentSpots.isEmpty
                  ? const Center(child: Text("No data available")) // Show message if no data
                  : LineChart(
                      _buildLineChartData(currentSpots),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartLegend() {
     return Row(
       mainAxisSize: MainAxisSize.min,
       children: [
         Container(
           width: 8, height: 8,
           decoration: const BoxDecoration(color: Colors.black, shape: BoxShape.circle),
         ),
         const SizedBox(width: 6),
         // Text might be dynamic? "Your Weight"? Needs clarification.
         const Text('Your Weight', style: TextStyle(fontSize: 12, color: Colors.black54)),
       ],
     );
  }


  LineChartData _buildLineChartData(List<FlSpot> spots) {
    return LineChartData(
      minY: _minY,
      maxY: _maxY,
       // Determine min/max X based on spots or time frame logic
       // minX: 0, // Assuming starts from 0
       // maxX: spots.isNotEmpty ? spots.length.toDouble() -1 : 1, // Example X range
      gridData: FlGridData(show: false), // Hide grid lines
      borderData: FlBorderData(show: false), // Hide chart border
      titlesData: FlTitlesData(
         show: true,
         // Hide titles on other sides
         topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
         rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
         bottomTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)), // Hide X axis labels
         // Configure Y axis (Left)
         leftTitles: AxisTitles(
           sideTitles: SideTitles(
             showTitles: true,
             reservedSize: 40, // Space for labels
             interval: _yInterval, // Calculated interval
             getTitlesWidget: (value, meta) {
               // Only show labels at calculated intervals that are within the range
               if (value > meta.max || value < meta.min || value % _yInterval != 0) {
                  return Container(); // Don't show label
               }
               return Padding(
                 padding: const EdgeInsets.only(right: 6.0),
                 child: Text(
                   '${value.toInt()} kg', // Format label
                   style: const TextStyle(color: Colors.black54, fontSize: 10),
                   textAlign: TextAlign.right,
                 ),
               );
             },
           ),
         ),
      ),
      lineBarsData: [
        LineChartBarData(
          spots: spots,
          isCurved: false, // Straight lines as per screenshot
          color: chartLineColor, // Line color
          barWidth: 2.5,
          isStrokeCapRound: true,
          dotData: FlDotData( // Show data points
             show: true,
             getDotPainter: (spot, percent, barData, index) =>
                 FlDotCirclePainter(radius: 3.5, color: chartDotColor, strokeWidth: 0),
          ),
          belowBarData: BarAreaData( // Gradient fill below line
            show: true,
            gradient: LinearGradient(
              colors: chartGradientColors.map((color) => color).toList(),
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
      ],
      // Optional: Configure tooltips on touch
      // lineTouchData: LineTouchData(
      //   touchTooltipData: LineTouchTooltipData(
      //     tooltipBgColor: Colors.blueGrey.withOpacity(0.8),
      //   )
      // ),
    );
  }

   Widget _buildMotivationalCard() {
    return Container(
      width: double.infinity, // Take full width
      padding: const EdgeInsets.symmetric(vertical: 15),
      decoration: BoxDecoration(
         color: motivationCardColor,
         borderRadius: BorderRadius.circular(30),
         boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 5)]
      ),
      child: const Center(
        child: Text(
          'You are doing great!',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: motivationTextColor),
        ),
      ),
    );
  }

}