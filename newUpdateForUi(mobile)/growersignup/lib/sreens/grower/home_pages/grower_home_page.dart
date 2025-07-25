import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_payment_page.dart';
import 'package:growersignup/sreens/grower/home_pages/help_center.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';
import 'package:growersignup/sreens/grower/orders/g_order_selecttion.dart';
import 'package:growersignup/sreens/grower/home_pages/fertilizer_page.dart';
import 'package:growersignup/sreens/grower/home_pages/contactus_page.dart';

class GrowerHomePage extends StatefulWidget {
  final String email;
  const GrowerHomePage({super.key, required this.email});

  @override
  State<GrowerHomePage> createState() => _GrowerHomePageState();
}

class _GrowerHomePageState extends State<GrowerHomePage> with TickerProviderStateMixin {
  int _bottomNavIndex = 2; // Set Home as default (index 2)
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  // Enhanced Color Palette
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color darkGreen = Color(0xFF064037);
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // Navigation Methods
  void _navigateToHarvest() {
    // Navigator.push(
    //   context,
    //   MaterialPageRoute(builder: (context) => GrowerHarvestPage(email: widget.email)),
    // );
  }

  void _navigateToPayments() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PaymentsPage(email: widget.email)),
    );
  }

  void _navigateToMessages() {
    // Navigator.push(
    //   context,
    //   MaterialPageRoute(builder: (context) => ConversationListScreen(email: widget.email)),
    // );
  }

  void _navigateToProfile() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => GrowerDetailsPage(email: widget.email)),
    );
  }

  void _navigateToAddOrder() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => GrowerOrderPage(email: widget.email)),
    );
  }

  void _navigateToSettings() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          title: Row(
            children: [
              Icon(Icons.settings, color: primaryGreen),
              SizedBox(width: 10),
              Text('Settings', style: TextStyle(color: primaryGreen)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Settings page will be implemented here.'),
              SizedBox(height: 10),
              Text('Current user: ${widget.email}', style: TextStyle(color: textLight, fontSize: 12)),
            ],
          ),
          actions: [
            TextButton(
              child: Text('OK', style: TextStyle(color: primaryGreen)),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
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
      case 2: // Home (current page)
        break;
      case 3: // Messages
        _navigateToMessages();
        break;
      case 4: // Profile
        _navigateToProfile();
        break;
    }
  }

 Widget build(BuildContext context) {
  return Scaffold(
    backgroundColor: lightGreen,
    body: CustomScrollView(
      slivers: [
        // Custom App Bar with Tea Background Image
        SliverAppBar(
          expandedHeight: 200, // Increased height to better show the image
          floating: false,
          pinned: true,
          backgroundColor: primaryGreen,
          automaticallyImplyLeading: false,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [primaryGreen.withOpacity(0.8), darkGreen],
                ),
              ),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Tea Background Image
                  Image.asset(
                    'lib/assets/images/tea.png',
                    fit: BoxFit.cover,
                    color: Colors.black.withOpacity(0.3), // Add overlay for better text visibility
                    colorBlendMode: BlendMode.darken,
                  ),
                  
                  // Gradient Overlay
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          primaryGreen.withOpacity(0.3),
                          darkGreen.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                  
                  // Content
                  SafeArea(
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
                                child: const Icon(Icons.eco, color: Colors.white, size: 20),
                              ),
                              const SizedBox(width: 10),
                              const Text(
                                'Tea Grower',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  shadows: [
                                    Shadow(
                                      blurRadius: 4.0,
                                      color: Colors.black54,
                                      offset: Offset(1.0, 1.0),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          // Welcome text overlay on the image
                          Text(
                            'Welcome to Tea Cultivation',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              shadows: [
                                Shadow(
                                  blurRadius: 4.0,
                                  color: Colors.black54,
                                  offset: Offset(1.0, 1.0),
                                ),
                              ],
                            ),
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
          actions: [
            Container(
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                borderRadius: BorderRadius.circular(10),
              ),
              child: IconButton(
                icon: const Icon(Icons.notifications_outlined, color: Colors.white, size: 22),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text('No new notifications'),
                      backgroundColor: primaryGreen,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  );
                },
              ),
            ),
            Container(
              margin: const EdgeInsets.only(right: 15),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                borderRadius: BorderRadius.circular(10),
              ),
              child: IconButton(
                icon: const Icon(Icons.settings_outlined, color: Colors.white, size: 22),
                onPressed: _navigateToSettings,
              ),
            ),
          ],
        ),

        // Main Content
        SliverPadding(
          padding: const EdgeInsets.all(20),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              // Welcome Card with Animation
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildWelcomeCard(),
              ),
              
              const SizedBox(height: 25),
              
              // Quick Stats Row
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildQuickStats(),
              ),
              
              const SizedBox(height: 25),
              
              // Quick Actions Section
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildQuickActionsSection(),
              ),
              
              const SizedBox(height: 25),
              
              // Services Grid
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildServicesSection(),
              ),
              
              const SizedBox(height: 25),
              

              const SizedBox(height: 100), // Space for FAB and bottom nav
            ]),
          ),
        ),
      ],
    ),
      
      // Floating Action Button
      floatingActionButton: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: primaryGreen.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: FloatingActionButton.extended(
          onPressed: _navigateToAddOrder,
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          elevation: 0,
          icon: const Icon(Icons.add, size: 24),
          label: const Text(
            'New Order',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      
      // Bottom Navigation
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  Widget _buildWelcomeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [primaryGreen, darkGreen],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: primaryGreen.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white.withOpacity(0.2),
            child: Text(
              widget.email.substring(0, 1).toUpperCase(),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Welcome Back!',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  widget.email,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Ready to manage your harvest?',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStats() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            icon: Icons.eco,
            title: 'Today\'s Harvest',
            value: '24.5 kg',
            color: Colors.green,
            change: '+12%',
          ),
        ),
        const SizedBox(width: 15),
        Expanded(
          child: _buildStatCard(
            icon: Icons.account_balance_wallet,
            title: 'This Month',
            value: 'Rs 45,000',
            color: Colors.blue,
            change: '+8%',
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required String change,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(16),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  change,
                  style: const TextStyle(
                    color: Colors.green,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textDark,
            ),
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: textLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsSection() {
    return Container(
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
              Icon(Icons.flash_on, color: primaryGreen, size: 24),
              const SizedBox(width: 10),
              const Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: _buildQuickActionCard(
                  icon: Icons.eco,
                  title: 'Harvest',
                  subtitle: 'Manage harvests',
                  onTap: _navigateToHarvest,
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 15),
              Expanded(
                child: _buildQuickActionCard(
                  icon: Icons.payment,
                  title: 'Payments',
                  subtitle: 'View payments',
                  onTap: _navigateToPayments,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
        ],
      ),
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withOpacity(0.1),
            color.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(15),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 20),
                ),
                const SizedBox(height: 10),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 10,
                    color: color.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildServicesSection() {
    final services = [
      {'icon': Icons.agriculture, 'title': 'Fertilizer\nGuide', 'page': FertilizerPage(email: widget.email)},
      {'icon': Icons.help_center, 'title': 'Help\nCenter', 'page': HelpCenterPage(email: widget.email)},
      {'icon': Icons.contact_phone, 'title': 'Contact\nUs', 'page': ContactUsPage(email: widget.email)},
      // {'icon': Icons.list_alt, 'title': 'My\nOrders', 'page': GrowerOrderDetailsSelectPage(email: widget.email)},
    ];

    return Container(
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
              Icon(Icons.apps, color: primaryGreen, size: 24),
              const SizedBox(width: 10),
              const Text(
                'More Services',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 15,
              mainAxisSpacing: 15,
              childAspectRatio: 1.2,
            ),
            itemCount: services.length,
            itemBuilder: (context, index) {
              final service = services[index];
              return _buildServiceCard(
                icon: service['icon'] as IconData,
                title: service['title'] as String,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => service['page'] as Widget),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: accentGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: accentGreen.withOpacity(0.3)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(15),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: primaryGreen, size: 28),
                const SizedBox(height: 10),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: textDark,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.history, color: primaryGreen, size: 24),
                  const SizedBox(width: 10),
                  const Text(
                    'Recent Activity',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textDark,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {},
                child: Text('View All', style: TextStyle(color: primaryGreen)),
              ),
            ],
          ),
          const SizedBox(height: 15),
          _buildActivityItem(
            icon: Icons.check_circle,
            title: 'Order #1234 Completed',
            subtitle: '25 kg green tea delivered',
            time: '2 hours ago',
            iconColor: Colors.green,
          ),
          _buildActivityItem(
            icon: Icons.schedule,
            title: 'Harvest Scheduled',
            subtitle: 'Tomorrow at 6:00 AM',
            time: '1 day ago',
            iconColor: Colors.orange,
          ),
          _buildActivityItem(
            icon: Icons.payment,
            title: 'Payment Received',
            subtitle: 'Rs 12,500 for Order #1233',
            time: '3 days ago',
            iconColor: Colors.blue,
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required String time,
    required Color iconColor,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: textLight,
                  ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: const TextStyle(
              fontSize: 10,
              color: textLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
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
    );
  }
}