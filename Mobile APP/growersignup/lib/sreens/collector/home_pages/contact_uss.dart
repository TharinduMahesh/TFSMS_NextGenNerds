import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ContactUssPage extends StatefulWidget {
  final String email;
  const ContactUssPage({super.key, required this.email});

  @override
  State<ContactUssPage> createState() => _ContactUssPageState();
}

class _ContactUssPageState extends State<ContactUssPage> with TickerProviderStateMixin {
  int _bottomNavIndex = 3; // Messages tab will be selected for contact us
  
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  // Contact Data
  final String phoneNumber1 = '0778585465';
  final String phoneNumber2 = '0125454562';
  final String emailAddress = 'support@teagrower.com';
  final String whatsappNumber = '94778585465';

  // Enhanced Color Scheme
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color warningOrange = Color(0xFFFF9800);

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animationController, curve: Curves.easeOutBack));
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // URL Launcher Functions
  Future<void> _launchUrlHelper(Uri url) async {
    try {
      if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
        throw Exception('Could not launch $url');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.error, color: Colors.white),
                const SizedBox(width: 10),
                Text('Could not launch $url'),
              ],
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      }
    }
  }

  void _makePhoneCall(String number) {
    final Uri phoneUri = Uri(scheme: 'tel', path: number);
    _launchUrlHelper(phoneUri);
  }

  void _sendEmail(String email) {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: email,
      query: 'subject=Tea Grower Support&body=Hello, I need assistance with...',
    );
    _launchUrlHelper(emailUri);
  }

  void _openWhatsapp(String number) {
    final Uri whatsappUri = Uri.parse('https://wa.me/$number?text=Hello, I need support with my tea growing operations.');
    _launchUrlHelper(whatsappUri);
  }

  // Navigation Methods
  void _navigateToHarvest() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => GrowerHarvestPage(email: widget.email)),
    // );
  }

  void _navigateToPayments() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => PaymentsPage(email: widget.email)),
    // );
  }

  void _navigateToHome() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => GrowerHomePage(email: widget.email)),
    // );
  }

  void _navigateToMessages() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => ConversationListScreen(email: widget.email)),
    // );
  }

  void _navigateToProfile() {
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (context) => GrowerDetailsPage(email: widget.email)),
    // );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: // Harvest
        _navigateToHarvest();
        break;
      case 1: // Payments
        _navigateToPayments();
        break;
      case 2: // Home
        _navigateToHome();
        break;
      case 3: // Messages (current page - contact us)
        break;
      case 4: // Profile
        _navigateToProfile();
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      body: CustomScrollView(
        slivers: [
          // Custom App Bar
          SliverAppBar(
            expandedHeight: 140,
            floating: false,
            pinned: true,
            backgroundColor: primaryGreen,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [primaryGreen, primaryGreen.withOpacity(0.8)],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.support_agent, color: Colors.white, size: 20),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              'Contact Support',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 25),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 15),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: IconButton(
                  icon: const Icon(Icons.help_outline, color: Colors.white),
                  onPressed: () {
                    _showHelpDialog();
                  },
                ),
              ),
            ],
          ),

          // Main Content
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: _buildContactContent(),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
      
      // Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              blurRadius: 15,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
          child: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: _bottomNavIndex,
            selectedItemColor: primaryGreen,
            unselectedItemColor: textLight,
            backgroundColor: Colors.transparent,
            elevation: 0,
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
            unselectedLabelStyle: const TextStyle(fontSize: 11),
            onTap: _onBottomNavTapped,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.eco_outlined),
                activeIcon: Icon(Icons.eco),
                label: 'Harvest',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.payment_outlined),
                activeIcon: Icon(Icons.payment),
                label: 'Payments',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.message_outlined),
                activeIcon: Icon(Icons.message),
                label: 'Messages',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                activeIcon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContactContent() {
    return Column(
      children: [
        // Welcome Section
        Container(
          padding: const EdgeInsets.all(25),
          decoration: BoxDecoration(
            color: cardBackground,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Icon(
                  Icons.support_agent,
                  size: 40,
                  color: primaryGreen,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'We\'re Here to Help!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text(
                'Our support team is ready to assist you with any questions about tea growing, orders, payments, or technical issues.',
                style: TextStyle(
                  fontSize: 15,
                  color: textLight,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),

        const SizedBox(height: 25),
        const SizedBox(height: 25),

        // Contact Methods Section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: cardBackground,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.contact_support, color: primaryGreen, size: 24),
                  const SizedBox(width: 10),
                  Text(
                    'Contact Methods',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textDark,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              _buildContactRow(
                icon: Icons.call_outlined,
                title: 'Phone Support',
                detail: '$phoneNumber1 / $phoneNumber2',
                subtitle: 'Available 24/7 for urgent matters',
                onTap: () => _makePhoneCall(phoneNumber1),
                color: primaryGreen,
              ),
              
              const SizedBox(height: 15),
              
              _buildContactRow(
                icon: Icons.email_outlined,
                title: 'Email Support',
                detail: emailAddress,
                subtitle: 'Response within 24 hours',
                onTap: () => _sendEmail(emailAddress),
                color: Colors.blue,
              ),
              
              const SizedBox(height: 15),
              
              _buildContactRow(
                icon: FontAwesomeIcons.whatsapp,
                title: 'WhatsApp',
                detail: phoneNumber1,
                subtitle: 'Quick chat support',
                onTap: () => _openWhatsapp(whatsappNumber),
                color: Colors.green,
              ),
            ],
          ),
        ),

        const SizedBox(height: 100), // Space for bottom navigation
      ],
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required String action,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(15),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(15),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 12,
                          color: textLight,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    action,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContactRow({
    required IconData icon,
    required String title,
    required String detail,
    required String subtitle,
    required VoidCallback onTap,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(15),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(15),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        detail,
                        style: TextStyle(
                          fontSize: 13,
                          color: textDark,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 11,
                          color: textLight,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_ios, size: 16, color: textLight),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            question,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: textDark,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            answer,
            style: TextStyle(
              fontSize: 13,
              color: textLight,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          title: Row(
            children: [
              Icon(Icons.help_outline, color: primaryGreen),
              const SizedBox(width: 10),
              Text('Need Help?', style: TextStyle(color: primaryGreen)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Choose the best way to reach us:'),
              const SizedBox(height: 15),
              Text('• Phone: For urgent matters'),
              Text('• Email: For detailed inquiries'),
              Text('• WhatsApp: For quick questions'),
            ],
          ),
          actions: [
            TextButton(
              child: Text('Got it', style: TextStyle(color: primaryGreen)),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }
}