import 'app_localizations.dart';

class AppLocalizationsTa extends AppLocalizations {
  // Common
  @override
  String get appName => 'தேயிலை தொழிற்சாலை SMS';
  @override
  String get ok => 'சரி';
  @override
  String get cancel => 'ரத்து';
  @override
  String get yes => 'ஆம்';
  @override
  String get no => 'இல்லை';
  @override
  String get save => 'சேமி';
  @override
  String get delete => 'நீக்கு';
  @override
  String get edit => 'திருத்து';
  @override
  String get loading => 'ஏற்றுகிறது...';
  @override
  String get error => 'பிழை';
  @override
  String get success => 'வெற்றி';
  @override
  String get warning => 'எச்சரிக்கை';
  @override
  String get retry => 'மீண்டும் முயற்சி';

  // Authentication
  @override
  String get login => 'உள்நுழைவு';
  @override
  String get logout => 'வெளியேறு';
  @override
  String get username => 'பயனர் பெயர்';
  @override
  String get password => 'கடவுச்சொல்';
  @override
  String get forgotPassword => 'கடவுச்சொல் மறந்தீர்களா?';
  @override
  String get register => 'பதிவு செய்க';
  @override
  String get welcome => 'வரவேற்கிறோம்';
  @override
  String get pleaseLogin => 'தொடர உள்நுழையவும்';

  // Navigation
  @override
  String get home => 'முகப்பு';
  @override
  String get dashboard => 'கட்டுப்பாட்டு பலகை';
  @override
  String get harvest => 'அறுவடை';
  @override
  String get feedback => 'கருத்து';
  @override
  String get messages => 'செய்திகள்';
  @override
  String get settings => 'அமைப்புகள்';
  @override
  String get profile => 'சுயவிவரம்';
  @override
  String get help => 'உதவி';

  // Collector Portal
  @override
  String get collectorPortal => 'சேகரிப்பாளர் போர்டல்';
  @override
  String get accessCollectorDashboard => 'சேகரிப்பாளர் பலகை அணுகல்';
  @override
  String get manageWeighing => 'தேயிலை எடை நிர்வாகம்';
  @override
  String get viewHarvestRequests => 'அறுவடை கோரிக்கைகள் பார்க்க';

  // Harvest
  @override
  String get harvestForm => 'அறுவடை படிவம்';
  @override
  String get harvestRequest => 'அறுவடை கோரிக்கை';
  @override
  String get harvestHistory => 'அறுவடை வரலாறு';
  @override
  String get submitHarvest => 'அறுவடை சமர்ப்பிக்க';
  @override
  String get location => 'இடம்';
  @override
  String get quantity => 'அளவு';
  @override
  String get quality => 'தரம்';
  @override
  String get date => 'தேதி';
  @override
  String get time => 'நேரம்';

  // Weighing
  @override
  String get weighing => 'எடை';
  @override
  String get newWeighing => 'புதிய எடை';
  @override
  String get weighingList => 'எடை பட்டியல்';
  @override
  String get weight => 'எடை';
  @override
  String get totalWeight => 'மொத்த எடை';
  @override
  String get grower => 'விவசாயி';
  @override
  String get collector => 'சேகரிப்பாளர்';

  // Chat/Messages
  @override
  String get chat => 'அரட்டை';
  @override
  String get newMessage => 'புதிய செய்தி';
  @override
  String get sendMessage => 'செய்தி அனுப்பு';
  @override
  String get online => 'ஆன்லைன்';
  @override
  String get offline => 'ஆஃப்லைன்';
  @override
  String get typing => 'தட்டச்சு செய்கிறது...';
  @override
  String get lastSeen => 'கடைசியாக பார்த்தது';
  @override
  String get searchUsers => 'பயனர்களை தேடு';

  // Orders
  @override
  String get orders => 'ஆர்டர்கள்';
  @override
  String get orderAccepted => 'ஆர்டர் ஏற்கப்பட்டது';
  @override
  String get orderRejected => 'ஆர்டர் நிராகரிக்கப்பட்டது';
  @override
  String get orderPending => 'ஆர்டர் நிலுவையில்';
  @override
  String get acceptOrder => 'ஆர்டர் ஏற்கவும்';
  @override
  String get rejectOrder => 'ஆர்டர் நிராகரிக்கவும்';

  // Feedback
  @override
  String get giveFeedback => 'கருத்து தெரிவிக்கவும்';
  @override
  String get feedbackSubmitted => 'கருத்து சமர்ப்பிக்கப்பட்டது';
  @override
  String get thankYou => 'நன்றி!';
  @override
  String get rating => 'மதிப்பீடு';
  @override
  String get comments => 'கருத்துகள்';

  // Settings
  @override
  String get language => 'மொழி';
  @override
  String get theme => 'தீம்';
  @override
  String get lightMode => 'ஒளி முறை';
  @override
  String get darkMode => 'இருள் முறை';
  @override
  String get notifications => 'அறிவிப்புகள்';
  @override
  String get about => 'பற்றி';
  @override
  String get version => 'பதிப்பு';
  @override
  String get appearance => 'தோற்றம்';

  // Languages
  @override
  String get english => 'English';
  @override
  String get sinhala => 'සිංහල';
  @override
  String get tamil => 'தமிழ்';

  // Tea Factory specific
  @override
  String get teaFactory => 'தேயிலை தொழிற்சாலை';
  @override
  String get teaLeaves => 'தேயிலை இலைகள்';
  @override
  String get teaGrading => 'தேயிலை தரப்படுத்தல்';
  @override
  String get moistureContent => 'ஈரப்பத அளவு';
  @override
  String get leafCondition => 'இலை நிலை';
  @override
  String get fresh => 'புதிய';
  @override
  String get withered => 'வாடிய';
  @override
  String get damaged => 'சேதமான';

  // Status messages
  @override
  String get pleaseWait => 'தயவுசெய்து காத்திருக்கவும்...';
  @override
  String get processingRequest => 'கோரிக்கை செயலாக்கப்படுகிறது...';
  @override
  String get requestSubmitted => 'கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது';
  @override
  String get requestFailed => 'கோரிக்கை தோல்வியடைந்தது';
  @override
  String get connectionError => 'இணைப்பு பிழை';
  @override
  String get noDataAvailable => 'தரவு இல்லை';
  @override
  String get dataLoadedSuccessfully => 'தரவு வெற்றிகரமாக ஏற்றப்பட்டது';

  // Onboarding
  @override
  String get selectLanguage => 'மொழியைத் தேர்ந்தெடுக்கவும்';
  @override
  String get next => 'அடுத்து';
  @override
  String get getReadyFor => 'தயாராகுங்கள்';
  @override
  String get newJourney => 'புதிய பயணம்';
  @override
  String get welcomeToTfsms => 'இலங்கை தேயிலை தொழிற்சாலை\nவழங்கல் மேலாண்மை அமைப்பிற்கு வரவேற்கிறோம்';
  @override
  String get termsOfService => 'சேவை விதிமுறைகள்';
  @override
  String get acceptAndContinue => 'ஏற்று தொடரவும்';
  @override
  String get iAgreeToTerms => 'நான் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஒப்புக்கொள்கிறேன்';
  @override
  String get youAreA => 'நீங்கள் ஒரு';
  @override
  String get supplier => 'விநியோகஸ்தர்';
  @override
  String get registeredCollectors => 'தொழிற்சாலையுடன் இணைந்த பதிவு செய்யப்பட்ட சேகரிப்பாளர்கள்';
  @override
  String get termsContent => '''தொழிற்சாலையுடன் இணைந்த பதிவு செய்யப்பட்ட சேகரிப்பாளர்கள், இலங்கை தேயிலை வாரியத்தால் அங்கீகரிக்கப்பட்ட வியாபாரிகள் மற்றும் அங்கீகரிக்கப்பட்ட தேயிலை விவசாயிகள் விநியோகஸ்தர்களாக பதிவு செய்ய தகுதியானவர்கள்.

தகுதி பெறுவதற்கு, அந்த தொழிற்சாலை மற்றும் இலங்கை தேயிலை வாரியத்தால் நிர்ணயிக்கப்பட்ட முன்னர் வரையறுக்கப்பட்ட விவரக்குறிப்புகள் மற்றும் தர தரநிலைகளை பூர்த்தி செய்யும் திறனை அவர்கள் நிரூபிக்க வேண்டும்.

• தர உறுதிப்பாடு: அனைத்து தேயிலை இலைகளும் தொழிற்சாலை தரங்களை பூர்த்தி செய்ய வேண்டும்
• நிலையான நடைமுறைகள்: சுற்றுச்சூழல் நட்பு விவசாயத்திற்கான அர்ப்பணிப்பு
• நியாயமான வர்த்தகம்: நெறிமுறை வர்த்தக நடைமுறைகளை கடைபிடித்தல்
• ஆவணங்கள்: சரியான சான்றிதழ் மற்றும் பதிவு தேவை
• வழக்கமான ஆய்வு: வாரிய விதிமுறைகளுக்கு இணக்கம்

தொடர்வதன் மூலம், நீங்கள் இந்த நிபந்தனைகளுக்கு ஒப்புக்கொள்கிறீர்கள்.''';

  // Step indicators
  @override
  String get step1Of4 => 'படி 1/4';
  @override
  String get step2Of4 => 'படி 2/4';
  @override
  String get step3Of4 => 'படி 3/4';
  @override
  String get step4Of4 => 'படி 4/4';
}
