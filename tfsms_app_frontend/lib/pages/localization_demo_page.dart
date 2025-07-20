import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/app_localizations.dart';
import '../providers/language_provider.dart';
import '../widgets/language_switcher.dart';

class LocalizationDemoPage extends StatelessWidget {
  const LocalizationDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.appName),
        backgroundColor: Colors.green[700],
        foregroundColor: Colors.white,
        actions: const [
          LanguageSwitcher(isAppBarAction: true),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.language, color: Colors.green),
                        const SizedBox(width: 8),
                        Text(
                          localizations.language,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text('${localizations.language}: ${languageProvider.currentLanguageName}'),
                    const SizedBox(height: 8),
                    const LanguageSwitcher(showFullNames: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${localizations.teaFactory} ${localizations.appName}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildDemoRow(localizations.welcome, Icons.waving_hand),
                    _buildDemoRow(localizations.dashboard, Icons.dashboard),
                    _buildDemoRow(localizations.harvest, Icons.grass),
                    _buildDemoRow(localizations.weighing, Icons.scale),
                    _buildDemoRow(localizations.feedback, Icons.feedback),
                    _buildDemoRow(localizations.messages, Icons.chat),
                    _buildDemoRow(localizations.settings, Icons.settings),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      localizations.teaFactory,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildDemoRow(localizations.teaLeaves, Icons.eco),
                    _buildDemoRow(localizations.teaGrading, Icons.grade),
                    _buildDemoRow(localizations.grower, Icons.person),
                    _buildDemoRow(localizations.collector, Icons.local_shipping),
                    _buildDemoRow(localizations.quality, Icons.star),
                    _buildDemoRow(localizations.quantity, Icons.scale),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${localizations.orders} & ${localizations.feedback}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildDemoRow(localizations.orderAccepted, Icons.check_circle, Colors.green),
                    _buildDemoRow(localizations.orderRejected, Icons.cancel, Colors.red),
                    _buildDemoRow(localizations.orderPending, Icons.hourglass_empty, Colors.orange),
                    _buildDemoRow(localizations.thankYou, Icons.thumb_up, Colors.blue),
                    _buildDemoRow(localizations.success, Icons.check, Colors.green),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          LanguageSelectionDialog.show(context);
        },
        backgroundColor: Colors.green[700],
        child: const Icon(Icons.language, color: Colors.white),
      ),
    );
  }

  Widget _buildDemoRow(String text, IconData icon, [Color? iconColor]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, color: iconColor ?? Colors.green[700], size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }
}
