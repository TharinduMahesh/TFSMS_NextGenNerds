import 'package:flutter/material.dart';
import 'app_localizations_en.dart';
import 'app_localizations_si.dart';
import 'app_localizations_ta.dart';

abstract class AppLocalizations {
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  // Common
  String get appName;
  String get ok;
  String get cancel;
  String get yes;
  String get no;
  String get save;
  String get delete;
  String get edit;
  String get loading;
  String get error;
  String get success;
  String get warning;
  String get retry;

  // Authentication
  String get login;
  String get logout;
  String get username;
  String get password;
  String get forgotPassword;
  String get register;
  String get welcome;
  String get pleaseLogin;

  // Navigation
  String get home;
  String get dashboard;
  String get harvest;
  String get feedback;
  String get messages;
  String get settings;
  String get profile;
  String get help;

  // Collector Portal
  String get collectorPortal;
  String get accessCollectorDashboard;
  String get manageWeighing;
  String get viewHarvestRequests;

  // Harvest
  String get harvestForm;
  String get harvestRequest;
  String get harvestHistory;
  String get submitHarvest;
  String get location;
  String get quantity;
  String get quality;
  String get date;
  String get time;

  // Weighing
  String get weighing;
  String get newWeighing;
  String get weighingList;
  String get weight;
  String get totalWeight;
  String get grower;
  String get collector;

  // Chat/Messages
  String get chat;
  String get newMessage;
  String get sendMessage;
  String get online;
  String get offline;
  String get typing;
  String get lastSeen;
  String get searchUsers;

  // Orders
  String get orders;
  String get orderAccepted;
  String get orderRejected;
  String get orderPending;
  String get acceptOrder;
  String get rejectOrder;

  // Feedback
  String get giveFeedback;
  String get feedbackSubmitted;
  String get thankYou;
  String get rating;
  String get comments;

  // Settings
  String get language;
  String get theme;
  String get lightMode;
  String get darkMode;
  String get notifications;
  String get about;
  String get version;
  String get appearance;

  // Languages
  String get english;
  String get sinhala;
  String get tamil;

  // Tea Factory specific
  String get teaFactory;
  String get teaLeaves;
  String get teaGrading;
  String get moistureContent;
  String get leafCondition;
  String get fresh;
  String get withered;
  String get damaged;

  // Status messages
  String get pleaseWait;
  String get processingRequest;
  String get requestSubmitted;
  String get requestFailed;
  String get connectionError;
  String get noDataAvailable;
  String get dataLoadedSuccessfully;

  // Onboarding
  String get selectLanguage;
  String get next;
  String get getReadyFor;
  String get newJourney;
  String get welcomeToTfsms;
  String get termsOfService;
  String get acceptAndContinue;
  String get iAgreeToTerms;
  String get youAreA;
  String get supplier;
  String get registeredCollectors;
  String get termsContent;
  
  // Step indicators
  String get step1Of4;
  String get step2Of4;
  String get step3Of4;
  String get step4Of4;
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'si', 'ta'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    switch (locale.languageCode) {
      case 'si':
        return AppLocalizationsSi();
      case 'ta':
        return AppLocalizationsTa();
      default:
        return AppLocalizationsEn();
    }
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
