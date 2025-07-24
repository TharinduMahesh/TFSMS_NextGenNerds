import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/grower/grower_harvest_model.dart';
import 'package:growersignup/services/grower/grower_harwest_api.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class HarvestPage extends StatefulWidget {
  final String email;
  const HarvestPage({super.key, required this.email});

  @override
  State<HarvestPage> createState() => _HarvestPageState();
}

class _HarvestPageState extends State<HarvestPage> {
  GrowerHarvestSummary? _harvestSummary;
  bool _isLoading = true;
  String _errorMessage = '';

  static const Color summaryCardColor = Color(0xFFDDF4DD);
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color gaugeNormalColor = Color(0xFFB2E7AE);
  static const Color gaugeSuperColor = Color(0xFF0a4e41);
  static const Color gaugeBackgroundColor = Color(0xFFE0E0E0);

  @override
  void initState() {
    super.initState();
    _fetchHarvestSummary();
  }

  Future<void> _fetchHarvestSummary() async {
    try {
      final apiService = ApiService();
      final summary = await apiService.fetchHarvestSummary(widget.email);
      setState(() {
        _harvestSummary = summary;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load data';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final gaugeSize = MediaQuery.of(context).size.width * 0.65;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, _) {
        return Scaffold(
          appBar: AppBar(
            title: Text(
              languageProvider.getText('harvestSummaryTitle'),
              style: const TextStyle(color: titleColor),
            ),
            backgroundColor: Colors.white,
            centerTitle: true,
            iconTheme: const IconThemeData(color: titleColor),
          ),
          body: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _harvestSummary == null
                  ? Center(child: Text(_errorMessage))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              _buildSummaryCard(
                                languageProvider.getText('totalHarvest'),
                                '${_harvestSummary!.totalHarvest.toStringAsFixed(2)} Kg',
                              ),
                              _buildSummaryCard(
                                languageProvider.getText('superTea'),
                                '${_harvestSummary!.totalSuperTeaQuantity.toStringAsFixed(2)} Kg',
                              ),
                              _buildSummaryCard(
                                languageProvider.getText('normalTea'),
                                '${_harvestSummary!.totalGreenTeaQuantity.toStringAsFixed(2)} Kg',
                              ),
                            ],
                          ),
                          const SizedBox(height: 30),
                          Text(
                            languageProvider.getText('teaQualityDistribution'),
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: gaugeSize,
                            height: gaugeSize * 0.6,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                CustomPaint(
                                  size: Size(gaugeSize, gaugeSize * 0.55),
                                  painter: TeaQualityPainter(
                                    normalPercentage: _harvestSummary!.totalGreenTeaQuantity / _harvestSummary!.totalHarvest,
                                    superPercentage: _harvestSummary!.totalSuperTeaQuantity / _harvestSummary!.totalHarvest,
                                    normalColor: gaugeNormalColor,
                                    superColor: gaugeSuperColor,
                                    backgroundColor: gaugeBackgroundColor,
                                    strokeWidth: 18.0,
                                  ),
                                ),
                                Positioned(
                                  bottom: gaugeSize * 0.15,
                                  child: const Icon(Icons.eco_outlined, size: 28, color: titleColor),
                                ),
                                Positioned(
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                    children: [
                                      Text(
                                        '${(_harvestSummary!.totalGreenTeaQuantity / _harvestSummary!.totalHarvest * 100).toStringAsFixed(0)}%',
                                        style: const TextStyle(fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        '${(_harvestSummary!.totalSuperTeaQuantity / _harvestSummary!.totalHarvest * 100).toStringAsFixed(0)}%',
                                        style: const TextStyle(fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
          floatingActionButton: FloatingActionButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => GrowerOrderPage(email: widget.email)),
              );
            },
            child: const Icon(Icons.add),
            backgroundColor: Colors.black,
          ),
        );
      },
    );
  }

  Widget _buildSummaryCard(String title, String value) {
    return Expanded(
      child: Card(
        color: summaryCardColor,
        margin: const EdgeInsets.symmetric(horizontal: 4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 18.0),
          child: Column(
            children: [
              Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
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
    final radius = size.width / 2;
    const startAngle = -math.pi;
    const sweepAngle = math.pi;

    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final normalPaint = Paint()
      ..color = normalColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final superPaint = Paint()
      ..color = superColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), startAngle, sweepAngle, false, backgroundPaint);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), startAngle, sweepAngle * normalPercentage, false, normalPaint);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), startAngle + (sweepAngle * normalPercentage), sweepAngle * superPercentage, false, superPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
