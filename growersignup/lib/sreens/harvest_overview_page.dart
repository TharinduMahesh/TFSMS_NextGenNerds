import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

enum TimeFrame { monthly, annually }

class HarvestOverviewPage extends StatefulWidget {
  const HarvestOverviewPage({super.key});

  @override
  State<HarvestOverviewPage> createState() => _HarvestOverviewPageState();
}

class _HarvestOverviewPageState extends State<HarvestOverviewPage> {
  int _bottomNavIndex = 0;
  TimeFrame _selectedTimeFrame = TimeFrame.annually;

  Map<TimeFrame, List<FlSpot>> _chartData = {
    TimeFrame.monthly: [
      const FlSpot(0, 5.5),
      const FlSpot(1, 6.1),
      const FlSpot(2, 5.8),
      const FlSpot(3, 6.5),
      const FlSpot(4, 6.2),
      const FlSpot(5, 7.0),
    ],
    TimeFrame.annually: [
      const FlSpot(0, 50),
      const FlSpot(1, 58),
      const FlSpot(2, 62),
      const FlSpot(3, 70),
      const FlSpot(4, 71),
      const FlSpot(5, 75),
    ],
  };

  double _minY = 40;
  double _maxY = 80;
  double _yInterval = 10;

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color appBarColor = pageBackgroundColor;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = titleColor;
  static const Color cardBackgroundColor = Colors.white;
  static const Color toggleSelectedBgColor = Colors.white;
  static const Color toggleUnselectedBgColor = Colors.transparent;
  static const Color toggleSelectedTextColor = titleColor;
  static const Color toggleUnselectedTextColor = Colors.black54;
  static const Color motivationCardColor = Colors.white;
  static const Color motivationTextColor = Colors.black87;
  static const Color fabColor = Colors.black;
  static const Color fabIconColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;

  @override
  void initState() {
    super.initState();
    _updateChartBounds();
  }

  Future<void> _loadChartData(TimeFrame timeFrame) async {
    _updateChartBounds();
  }

  void _updateChartBounds() {
    final data = _chartData[_selectedTimeFrame] ?? [];
    if (data.isEmpty) {
      _minY = 0;
      _maxY = 10;
      _yInterval = 2;
    } else {
      double minY = data.first.y, maxY = data.first.y;
      for (var spot in data) {
        if (spot.y < minY) minY = spot.y;
        if (spot.y > maxY) maxY = spot.y;
      }
      double range = maxY - minY;
      if (range <= 0) range = 10;
      _yInterval = range <= 50 ? 10 : range <= 100 ? 20 : 50;
      _minY = ((minY - _yInterval) / _yInterval).floor() * _yInterval;
      _maxY = ((maxY + _yInterval) / _yInterval).ceil() * _yInterval;
      if (_minY < 0) _minY = 0;
      if (_maxY == _minY) _maxY += _yInterval;
      if (_selectedTimeFrame == TimeFrame.annually && data.length == 6) {
        _minY = 40;
        _maxY = 80;
        _yInterval = 10;
      }
    }
    setState(() {});
  }

  void _onTimeFrameSelected(TimeFrame frame) {
    if (_selectedTimeFrame == frame) return;
    setState(() => _selectedTimeFrame = frame);
    _loadChartData(frame);
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex != index) setState(() => _bottomNavIndex = index);
  }

  void _addHarvestEntry(LanguageProvider language) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(language.getText('navigateAddHarvest')), backgroundColor: Colors.blueAccent),
    );
  }

  void _openSettings(LanguageProvider language) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(language.getText('settingsNotImplemented')), backgroundColor: Colors.grey),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: pageBackgroundColor,
          appBar: AppBar(
            backgroundColor: appBarColor,
            elevation: 0,
            centerTitle: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text(
              languageProvider.getText('harvestTitle'),
              style: const TextStyle(color: titleColor, fontWeight: FontWeight.bold),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
                onPressed: () => _openSettings(languageProvider),
              ),
              const SizedBox(width: 10),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.only(left: 16, right: 16, top: 10, bottom: 80),
            child: Column(
              children: [
                _buildTimeFrameToggle(languageProvider),
                const SizedBox(height: 20),
                _buildChartCard(languageProvider),
                const SizedBox(height: 20),
                _buildMotivationalCard(languageProvider),
                const SizedBox(height: 20),
                Text(
                  languageProvider.getText('placeholderDots'),
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
          floatingActionButton: FloatingActionButton(
            onPressed: () => _addHarvestEntry(languageProvider),
            backgroundColor: fabColor,
            foregroundColor: fabIconColor,
            shape: const CircleBorder(),
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
            items: [
              BottomNavigationBarItem(
                icon: const Icon(Icons.home_outlined),
                activeIcon: const Icon(Icons.home),
                label: languageProvider.getText('navHome'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.notifications_outlined),
                activeIcon: const Icon(Icons.notifications),
                label: languageProvider.getText('navNotifications'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.person_outline),
                activeIcon: const Icon(Icons.person),
                label: languageProvider.getText('navProfile'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.star_outline),
                activeIcon: const Icon(Icons.star),
                label: languageProvider.getText('navContactUs'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTimeFrameToggle(LanguageProvider language) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildToggleButton(language.getText('monthly'), TimeFrame.monthly),
        _buildToggleButton(language.getText('annually'), TimeFrame.annually),
      ],
    );
  }

  Widget _buildToggleButton(String text, TimeFrame frame) {
    final bool isSelected = _selectedTimeFrame == frame;
    return GestureDetector(
      onTap: () => _onTimeFrameSelected(frame),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
        margin: const EdgeInsets.symmetric(horizontal: 2),
        decoration: BoxDecoration(
          color: isSelected ? toggleSelectedBgColor : toggleUnselectedBgColor,
          borderRadius: BorderRadius.circular(20),
          border: isSelected ? null : Border.all(color: Colors.grey.shade300),
          boxShadow: isSelected
              ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 5, offset: const Offset(0, 2))]
              : null,
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

  Widget _buildChartCard(LanguageProvider language) {
    final spots = _chartData[_selectedTimeFrame] ?? [];

    return Card(
      color: cardBackgroundColor,
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${_selectedTimeFrame == TimeFrame.annually ? language.getText('annuallyOverview') : language.getText('monthlyOverview')}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: titleColor),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.black, shape: BoxShape.circle)),
                const SizedBox(width: 6),
                Text(language.getText('yourWeight'), style: const TextStyle(fontSize: 12, color: Colors.black54)),
              ],
            ),
            const SizedBox(height: 10),
            AspectRatio(
              aspectRatio: 1.5,
              child: spots.isEmpty
                  ? Center(child: Text(language.getText('noDataAvailable')))
                  : LineChart(_buildLineChartData(spots)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMotivationalCard(LanguageProvider language) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 15),
      decoration: BoxDecoration(color: motivationCardColor, borderRadius: BorderRadius.circular(30), boxShadow: [
        BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 5)
      ]),
      child: Center(
        child: Text(
          language.getText('motivationalMessage'),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: motivationTextColor),
        ),
      ),
    );
  }

  LineChartData _buildLineChartData(List<FlSpot> spots) {
    return LineChartData(
      minY: _minY,
      maxY: _maxY,
      gridData: FlGridData(show: false),
      borderData: FlBorderData(show: false),
      titlesData: FlTitlesData(
        show: true,
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 40,
            interval: _yInterval,
            getTitlesWidget: (value, meta) {
              if (value > meta.max || value < meta.min || value % _yInterval != 0) {
                return Container();
              }
              return Padding(
                padding: const EdgeInsets.only(right: 6.0),
                child: Text('${value.toInt()} kg', style: const TextStyle(color: Colors.black54, fontSize: 10)),
              );
            },
          ),
        ),
        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        bottomTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      ),
      lineBarsData: [
        LineChartBarData(
          spots: spots,
          isCurved: false,
          color: Colors.black,
          barWidth: 2.5,
          dotData: FlDotData(
            show: true,
            getDotPainter: (spot, percent, barData, idx) => FlDotCirclePainter(radius: 3.5, color: Colors.black, strokeWidth: 0),
          ),
          belowBarData: BarAreaData(
            show: true,
            gradient: LinearGradient(colors: [titleColor.withOpacity(0.8), motivationCardColor.withOpacity(0.6), motivationCardColor.withOpacity(0.1)], begin: Alignment.topCenter, end: Alignment.bottomCenter),
          ),
        ),
      ],
    );
  }
}
