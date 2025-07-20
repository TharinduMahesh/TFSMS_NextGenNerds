import 'package:flutter/material.dart';
import '../../l10n/app_localizations.dart';

class UserRoleSelectionPage extends StatefulWidget {
  const UserRoleSelectionPage({super.key});

  @override
  State<UserRoleSelectionPage> createState() => _UserRoleSelectionPageState();
}

class _UserRoleSelectionPageState extends State<UserRoleSelectionPage> {
  String? selectedRole;

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    
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
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back),
                    ),
                    Text(
                      localizations.step3Of4,
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
                      
                      // Tea Plantation Image Background
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
                                // Background gradient
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
                                
                                // Tea workers silhouettes
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
                                
                                // Main content overlay
                                Container(
                                  width: double.infinity,
                                  height: double.infinity,
                                  padding: const EdgeInsets.all(30),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        localizations.youAreA,
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
                                      
                                      // Role Selection Buttons
                                      Column(
                                        children: [
                                          _buildRoleButton(
                                            localizations.supplier,
                                            'supplier',
                                            Icons.local_shipping,
                                          ),
                                          const SizedBox(height: 20),
                                          _buildRoleButton(
                                            localizations.collector,
                                            'collector',
                                            Icons.inventory,
                                          ),
                                        ],
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
                          onPressed: selectedRole != null ? _handleNext : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: selectedRole != null 
                                ? Colors.green.shade600 
                                : Colors.grey.shade300,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25),
                            ),
                            elevation: 3,
                          ),
                          child: Text(
                            localizations.next,
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
                              color: Colors.green.shade600,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
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

  Widget _buildRoleButton(String title, String role, IconData icon) {
    final isSelected = selectedRole == role;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedRole = role;
        });
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
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
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.green.shade700,
              size: 24,
            ),
            const SizedBox(width: 16),
            Text(
              title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : Colors.green.shade800,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleNext() {
    // Navigate to welcome page or main app
    Navigator.pushReplacementNamed(context, '/welcome');
  }
}
