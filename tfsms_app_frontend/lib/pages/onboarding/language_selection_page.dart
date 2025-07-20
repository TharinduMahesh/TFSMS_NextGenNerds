import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tfsms_app_frontend/providers/language_provider.dart';
import 'package:tfsms_app_frontend/l10n/app_localizations.dart';


class LanguageSelectionPage extends StatefulWidget {
  final bool isOnboarding;
  
  const LanguageSelectionPage({
    super.key,
    this.isOnboarding = false,
  });

  @override
  State<LanguageSelectionPage> createState() => _LanguageSelectionPageState();
}

class _LanguageSelectionPageState extends State<LanguageSelectionPage> {
  String? selectedLanguage;

  @override
  void initState() {
    super.initState();
    final languageProvider = Provider.of<LanguageProvider>(context, listen: false);
    selectedLanguage = languageProvider.currentLocale.languageCode;
  }

  @override
  Widget build(BuildContext context) {
    // Get current localization, fallback to English if not available
    AppLocalizations? localizations;
    try {
      localizations = AppLocalizations.of(context);
    } catch (e) {
      // During initial load, localizations might not be available
      localizations = null;
    }
    
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFE8F5E8),
              Color(0xFFF0F8F0),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (!widget.isOnboarding)
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.arrow_back),
                      )
                    else
                      const SizedBox(width: 48),
                    Text(
                      localizations?.step1Of4 ?? 'Step 1 of 4',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),
              
              // Main Content
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    children: [
                      const SizedBox(height: 40),
                      
                      // Tea Plantation Image
                      Expanded(
                        flex: 3,
                        child: Container(
                          width: double.infinity,
                          margin: const EdgeInsets.symmetric(horizontal: 20),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 15,
                                offset: const Offset(0, 5),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Stack(
                              children: [
                                // Background image placeholder
                                Container(
                                  width: double.infinity,
                                  height: double.infinity,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        Colors.green.shade300.withOpacity(0.8),
                                        Colors.green.shade600.withOpacity(0.9),
                                      ],
                                    ),
                                  ),
                                ),
                                
                                // Tea workers silhouettes (using icons as placeholder)
                                Positioned(
                                  bottom: 60,
                                  left: 40,
                                  child: Icon(
                                    Icons.person,
                                    size: 40,
                                    color: Colors.white.withOpacity(0.6),
                                  ),
                                ),
                                Positioned(
                                  bottom: 80,
                                  left: 100,
                                  child: Icon(
                                    Icons.person,
                                    size: 35,
                                    color: Colors.white.withOpacity(0.5),
                                  ),
                                ),
                                Positioned(
                                  bottom: 70,
                                  right: 60,
                                  child: Icon(
                                    Icons.person,
                                    size: 38,
                                    color: Colors.white.withOpacity(0.4),
                                  ),
                                ),
                                
                                // Overlay content
                                Container(
                                  width: double.infinity,
                                  height: double.infinity,
                                  padding: const EdgeInsets.all(30),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        localizations?.selectLanguage ?? 'Select Language',
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                          shadows: [
                                            Shadow(
                                              offset: Offset(0, 2),
                                              blurRadius: 4,
                                              color: Colors.black26,
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 40),
                                      
                                      // Language Selection Buttons
                                      Consumer<LanguageProvider>(
                                        builder: (context, languageProvider, child) {
                                          return Column(
                                            children: [
                                              _buildLanguageButton(
                                                'සිංහල',
                                                'si',
                                                languageProvider,
                                              ),
                                              const SizedBox(height: 15),
                                              _buildLanguageButton(
                                                'English',
                                                'en',
                                                languageProvider,
                                              ),
                                              const SizedBox(height: 15),
                                              _buildLanguageButton(
                                                'தமிழ்',
                                                'ta',
                                                languageProvider,
                                              ),
                                            ],
                                          );
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 40),
                      
                      // Next Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: selectedLanguage != null ? _handleNext : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25),
                            ),
                            elevation: 3,
                          ),
                          child: Text(
                            localizations?.next ?? 'Next',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Progress indicator
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.green.shade600,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLanguageButton(
    String text,
    String languageCode,
    LanguageProvider languageProvider,
  ) {
    final isSelected = selectedLanguage == languageCode;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedLanguage = languageCode;
        });
        languageProvider.setLanguage(Locale(languageCode));
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        decoration: BoxDecoration(
          color: isSelected 
              ? Colors.green.shade700 
              : Colors.white.withOpacity(0.9),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: isSelected 
                ? Colors.green.shade800 
                : Colors.white.withOpacity(0.5),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : Colors.green.shade800,
          ),
        ),
      ),
    );
  }

  void _handleNext() {
    if (widget.isOnboarding) {
      // Navigate to next onboarding screen
      Navigator.pushReplacementNamed(context, '/terms');
    } else {
      Navigator.pop(context);
    }
  }
}
