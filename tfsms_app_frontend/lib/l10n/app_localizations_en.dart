import 'app_localizations.dart';

class AppLocalizationsEn extends AppLocalizations {
  // Common
  @override
  String get appName => 'Tea Factory SMS';
  @override
  String get ok => 'OK';
  @override
  String get cancel => 'Cancel';
  @override
  String get yes => 'Yes';
  @override
  String get no => 'No';
  @override
  String get save => 'Save';
  @override
  String get delete => 'Delete';
  @override
  String get edit => 'Edit';
  @override
  String get loading => 'Loading...';
  @override
  String get error => 'Error';
  @override
  String get success => 'Success';
  @override
  String get warning => 'Warning';
  @override
  String get retry => 'Retry';

  // Authentication
  @override
  String get login => 'Login';
  @override
  String get logout => 'Logout';
  @override
  String get username => 'Username';
  @override
  String get password => 'Password';
  @override
  String get forgotPassword => 'Forgot Password?';
  @override
  String get register => 'Register';
  @override
  String get welcome => 'Welcome';
  @override
  String get pleaseLogin => 'Please login to continue';

  // Navigation
  @override
  String get home => 'Home';
  @override
  String get dashboard => 'Dashboard';
  @override
  String get harvest => 'Harvest';
  @override
  String get feedback => 'Feedback';
  @override
  String get messages => 'Messages';
  @override
  String get settings => 'Settings';
  @override
  String get profile => 'Profile';
  @override
  String get help => 'Help';

  // Collector Portal
  @override
  String get collectorPortal => 'Collector Portal';
  @override
  String get accessCollectorDashboard => 'Access Collector Dashboard';
  @override
  String get manageWeighing => 'Manage Tea Weighing';
  @override
  String get viewHarvestRequests => 'View Harvest Requests';

  // Harvest
  @override
  String get harvestForm => 'Harvest Form';
  @override
  String get harvestRequest => 'Harvest Request';
  @override
  String get harvestHistory => 'Harvest History';
  @override
  String get submitHarvest => 'Submit Harvest';
  @override
  String get location => 'Location';
  @override
  String get quantity => 'Quantity';
  @override
  String get quality => 'Quality';
  @override
  String get date => 'Date';
  @override
  String get time => 'Time';

  // Weighing
  @override
  String get weighing => 'Weighing';
  @override
  String get newWeighing => 'New Weighing';
  @override
  String get weighingList => 'Weighing List';
  @override
  String get weight => 'Weight';
  @override
  String get totalWeight => 'Total Weight';
  @override
  String get grower => 'Grower';
  @override
  String get collector => 'Collector';

  // Chat/Messages
  @override
  String get chat => 'Chat';
  @override
  String get newMessage => 'New Message';
  @override
  String get sendMessage => 'Send Message';
  @override
  String get online => 'Online';
  @override
  String get offline => 'Offline';
  @override
  String get typing => 'Typing...';
  @override
  String get lastSeen => 'Last seen';
  @override
  String get searchUsers => 'Search users';

  // Orders
  @override
  String get orders => 'Orders';
  @override
  String get orderAccepted => 'Order Accepted';
  @override
  String get orderRejected => 'Order Rejected';
  @override
  String get orderPending => 'Order Pending';
  @override
  String get acceptOrder => 'Accept Order';
  @override
  String get rejectOrder => 'Reject Order';

  // Feedback
  @override
  String get giveFeedback => 'Give Feedback';
  @override
  String get feedbackSubmitted => 'Feedback Submitted';
  @override
  String get thankYou => 'Thank You!';
  @override
  String get rating => 'Rating';
  @override
  String get comments => 'Comments';

  // Settings
  @override
  String get language => 'Language';
  @override
  String get theme => 'Theme';
  @override
  String get lightMode => 'Light Mode';
  @override
  String get darkMode => 'Dark Mode';
  @override
  String get notifications => 'Notifications';
  @override
  String get about => 'About';
  @override
  String get version => 'Version';
  @override
  String get appearance => 'Appearance';

  // Languages
  @override
  String get english => 'English';
  @override
  String get sinhala => 'සිංහල';
  @override
  String get tamil => 'தமிழ்';

  // Tea Factory specific
  @override
  String get teaFactory => 'Tea Factory';
  @override
  String get teaLeaves => 'Tea Leaves';
  @override
  String get teaGrading => 'Tea Grading';
  @override
  String get moistureContent => 'Moisture Content';
  @override
  String get leafCondition => 'Leaf Condition';
  @override
  String get fresh => 'Fresh';
  @override
  String get withered => 'Withered';
  @override
  String get damaged => 'Damaged';

  // Status messages
  @override
  String get pleaseWait => 'Please wait...';
  @override
  String get processingRequest => 'Processing request...';
  @override
  String get requestSubmitted => 'Request submitted successfully';
  @override
  String get requestFailed => 'Request failed';
  @override
  String get connectionError => 'Connection error';
  @override
  String get noDataAvailable => 'No data available';
  @override
  String get dataLoadedSuccessfully => 'Data loaded successfully';

  // Onboarding
  @override
  String get selectLanguage => 'Select Language';
  @override
  String get next => 'Next';
  @override
  String get getReadyFor => 'Get ready for';
  @override
  String get newJourney => 'New Journey';
  @override
  String get welcomeToTfsms => 'Welcome to Sri Lanka Tea Factory\nSupply Management System';
  @override
  String get termsOfService => 'Terms of Service';
  @override
  String get acceptAndContinue => 'Accept & Continue';
  @override
  String get iAgreeToTerms => 'I agree to the Terms of Service and Privacy Policy';
  @override
  String get youAreA => 'You are a';
  @override
  String get supplier => 'Supplier';
  @override
  String get registeredCollectors => 'Registered collectors affiliated with the factory';
  @override
  String get termsContent => '''Registered collectors affiliated with the factory, dealers accredited by the Sri Lanka Tea Board, and recognized tea growers are eligible to register as suppliers.

To qualify, they must demonstrate the capacity to meet the predefined specifications and quality standards set forth by the respective factory and the Sri Lanka Tea Board.

• Quality Assurance: All tea leaves must meet factory standards
• Sustainable Practices: Commitment to eco-friendly cultivation
• Fair Trade: Adherence to ethical trading practices
• Documentation: Proper certification and registration required
• Regular Inspection: Compliance with board regulations

By continuing, you agree to these terms and conditions.''';

  // Step indicators
  @override
  String get step1Of4 => 'Step 1 of 4';
  @override
  String get step2Of4 => 'Step 2 of 4';
  @override
  String get step3Of4 => 'Step 3 of 4';
  @override
  String get step4Of4 => 'Step 4 of 4';
}
