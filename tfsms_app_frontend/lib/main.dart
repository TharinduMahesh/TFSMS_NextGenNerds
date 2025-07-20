import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:tfsms_app_frontend/pages/feedback/feedback_page.dart';
import 'package:tfsms_app_frontend/pages/harvest/harvest_screen.dart';
import 'package:tfsms_app_frontend/pages/weighing/home_page_weighing.dart';
import 'package:tfsms_app_frontend/pages/order/order_accepted_page.dart';
import 'package:tfsms_app_frontend/pages/order/order_rejected_page.dart';
import 'package:tfsms_app_frontend/pages/collector/collector_dashboard_page.dart';
import 'package:tfsms_app_frontend/pages/collector/weighing_pages.dart';
import 'package:tfsms_app_frontend/pages/chat/chat_main_page.dart';
import 'package:tfsms_app_frontend/pages/auth/login_page.dart';
import 'package:tfsms_app_frontend/pages/settings_page.dart';
import 'package:tfsms_app_frontend/pages/onboarding/language_selection_page.dart';
import 'package:tfsms_app_frontend/pages/onboarding/terms_of_service_page.dart';
import 'package:tfsms_app_frontend/pages/onboarding/user_role_selection_page.dart';
import 'package:tfsms_app_frontend/pages/onboarding/welcome_page.dart';
import 'package:tfsms_app_frontend/themes/theme_provider.dart';
import 'package:tfsms_app_frontend/providers/language_provider.dart';
import 'package:tfsms_app_frontend/l10n/app_localizations.dart';
import 'pages/main_page.dart';
import 'pages/feedback/thank_you_page.dart';
import 'pages/harvest/harvest_form_page.dart';
import 'pages/weighing/new_weighing_page.dart';


void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => ThemeProvider()),
        ChangeNotifierProvider(create: (context) => LanguageProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<ThemeProvider, LanguageProvider>(
      builder: (context, themeProvider, languageProvider, child) {
        return MaterialApp(
          title: 'TFSMS App',
          debugShowCheckedModeBanner: false,
          theme: themeProvider.themeData,
          darkTheme: themeProvider.themeData,
          locale: languageProvider.currentLocale,
          localizationsDelegates: const [
            AppLocalizationsDelegate(),
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('en', ''), // English
            Locale('si', ''), // Sinhala
            Locale('ta', ''), // Tamil
          ],
          initialRoute: '/language-selection',
          routes: {
            '/language-selection': (context) => const LanguageSelectionPage(isOnboarding: true),
            '/terms': (context) => const TermsOfServicePage(),
            '/role-selection': (context) => const UserRoleSelectionPage(),
            '/welcome': (context) => const WelcomePage(),
            '/login': (context) => const LoginPage(),
            '/': (context) => const MainPage(),             // Main Dashboard
            '/form': (context) => const HarvestFormPage(),   // Harvest Form
            
            '/thank-you': (context) => const ThankYouPage(), // Thank You Page After Feedback
            '/new-weighing': (context) => const NewWeighingPage(),   // New Weighing Entry
            '/home-weighing': (context) => const WeighingListView(), // Weighing Home Page
            '/harvest': (context) => const HarvestScreen(), // Harvest Screen
            '/accept': (context) => const OrderAcceptedPage(),// Order Accepted Page
            '/reject': (context) => const OrderRejectedPage(),// Order Rejected Page
            '/feedback': (context) => const FeedbackPage(), // Feedback Page
            '/collector-dashboard': (context) => const CollectorDashboardPage(), // Collector Dashboard
            '/weighing-list': (context) => const WeighingListPage(), // Weighing List for Collector
            '/chat': (context) => const ChatMainPage(), // Chat System
            '/settings': (context) => const SettingsPage(), // Settings Page
            '/language-settings': (context) => const LanguageSelectionPage(isOnboarding: false), // Language Settings
          },
        );
      },
    );
  }
}