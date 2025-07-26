import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/conversation_model.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';
import 'package:growersignup/sreens/conversation_pages/chat_screen.dart';
import 'package:intl/intl.dart';
import 'package:signalr_core/signalr_core.dart' as signalr;

class ConversationListScreen extends StatefulWidget {
  final String email;
  final String userType; // "Grower" or "Collector"

  const ConversationListScreen({
    Key? key,
    required this.email,
    required this.userType,
  }) : super(key: key);

  @override
  _ConversationListScreenState createState() => _ConversationListScreenState();
}

class _ConversationListScreenState extends State<ConversationListScreen> with TickerProviderStateMixin {
  late Future<List<Conversation>> _conversationsFuture;
  List<Conversation> _conversations = [];
  int _bottomNavIndex = 3; // Messages tab
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  signalr.HubConnection? _signalR;

  // Enhanced Color Scheme (matching grower home page)
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
    _loadConversations();
    _initSignalR();
    
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _signalR?.stop();
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _initSignalR() async {
    try {
      const serverUrl = "http://localhost:7061";
      _signalR = signalr.HubConnectionBuilder()
          .withUrl('$serverUrl/chathub')
          .build();

      _signalR?.onclose((error) {
        print("SignalR Connection closed: $error");
      });

      // Listen for new conversations
      _signalR?.on('NewConversation', (List<Object?>? arguments) {
        if (arguments != null && arguments.isNotEmpty && arguments[0] != null) {
          try {
            final conversationData = arguments[0] as Map<String, dynamic>;
            final newConversation = Conversation.fromJson(conversationData);
            
            if (mounted) {
              setState(() {
                _conversations.insert(0, newConversation);
              });
            }
          } catch (e) {
            print('Error processing new conversation: $e');
          }
        }
      });

      // Listen for conversation updates (new messages)
      _signalR?.on('ConversationUpdated', (List<Object?>? arguments) {
        if (arguments != null && arguments.isNotEmpty && arguments[0] != null) {
          try {
            final conversationId = arguments[0] as int;
            _moveConversationToTop(conversationId);
          } catch (e) {
            print('Error processing conversation update: $e');
          }
        }
      });

      _signalR?.onreconnecting((error) {
        print("SignalR reconnecting: $error");
      });

      _signalR?.onreconnected((connectionId) {
        print("SignalR reconnected with ID: $connectionId");
        _joinUserGroup();
      });

      await _signalR?.start();
      print("SignalR connection started");
      
      // Join user-specific group for receiving notifications
      await _joinUserGroup();
      
    } catch (e) {
      print('SignalR initialization error: $e');
    }
  }

  Future<void> _joinUserGroup() async {
    try {
      await _signalR?.invoke("JoinUserGroup", args: [widget.email]);
      print("Joined user group: ${widget.email}");
    } catch (e) {
      print('Error joining user group: $e');
    }
  }

  void _moveConversationToTop(int conversationId) {
    if (mounted) {
      setState(() {
        final index = _conversations.indexWhere((c) => c.conversationId == conversationId);
        if (index > 0) {
          final conversation = _conversations.removeAt(index);
          _conversations.insert(0, conversation);
        }
      });
    }
  }

  void _loadConversations() {
    setState(() {
      _conversationsFuture = ChatApiService.getConversations(widget.email);
    });
    
    _conversationsFuture.then((conversations) {
      if (mounted) {
        setState(() {
          // Sort conversations by most recent activity (you can modify this based on your data)
          _conversations = conversations;
          _conversations.sort((a, b) => b.conversationId.compareTo(a.conversationId));
        });
      }
    });
  }

  // Navigation Methods
  void _navigateToHarvest() {
    if (widget.userType == "Grower") {
      Navigator.pushReplacementNamed(context, '/grower-harvest', arguments: widget.email);
    } else {
      Navigator.pushReplacementNamed(context, '/collector-orders', arguments: widget.email);
    }
  }

  void _navigateToPayments() {
    if (widget.userType == "Grower") {
      Navigator.pushReplacementNamed(context, '/grower-payments', arguments: widget.email);
    } else {
      Navigator.pushReplacementNamed(context, '/collector-payments', arguments: widget.email);
    }
  }

  void _navigateToHome() {
    if (widget.userType == "Grower") {
      Navigator.pushReplacementNamed(context, '/grower-home', arguments: widget.email);
    } else {
      Navigator.pushReplacementNamed(context, '/collector-home', arguments: widget.email);
    }
  }

  void _navigateToProfile() {
    if (widget.userType == "Grower") {
      Navigator.pushReplacementNamed(context, '/grower-profile', arguments: widget.email);
    } else {
      Navigator.pushReplacementNamed(context, '/collector-profile', arguments: widget.email);
    }
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: _navigateToHarvest(); break;
      case 1: _navigateToPayments(); break;
      case 2: _navigateToHome(); break;
      case 3: break; // Current page (Messages)
      case 4: _navigateToProfile(); break;
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
            expandedHeight: 160,
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
                    // Background pattern
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
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
                                  child: const Icon(Icons.chat, color: Colors.white, size: 20),
                                ),
                                const SizedBox(width: 10),
                                const Text(
                                  'Messages',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
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
                            Text(
                              'Stay connected with your ${widget.userType == "Grower" ? "collectors" : "growers"}',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 14,
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
                margin: const EdgeInsets.only(right: 15),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: IconButton(
                  icon: const Icon(Icons.refresh, color: Colors.white, size: 22),
                  onPressed: () {
                    _loadConversations();
                    _animationController.forward(from: 0);
                  },
                ),
              ),
            ],
          ),

          // Conversations List
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: _buildConversationsList(),
                ),
                const SizedBox(height: 100), // Space for navigation
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
            items: [
              BottomNavigationBarItem(
                icon: Icon(widget.userType == "Grower" ? Icons.eco_outlined : Icons.assignment_outlined),
                activeIcon: Icon(widget.userType == "Grower" ? Icons.eco : Icons.assignment),
                label: widget.userType == "Grower" ? 'Harvest' : 'Orders',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.payment_outlined),
                activeIcon: Icon(Icons.payment),
                label: 'Payments',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: 'Home',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.message_outlined),
                activeIcon: Icon(Icons.message),
                label: 'Messages',
              ),
              const BottomNavigationBarItem(
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

  Widget _buildConversationsList() {
    if (_conversations.isNotEmpty) {
      return _buildConversationsGrid(_conversations);
    }

    return FutureBuilder<List<Conversation>>(
      future: _conversationsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return _buildLoadingState();
        }
        
        if (snapshot.hasError) {
          return _buildErrorState(snapshot.error.toString());
        }
        
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return _buildEmptyState();
        }

        final conversations = snapshot.data!;
        return _buildConversationsGrid(conversations);
      },
    );
  }

  Widget _buildLoadingState() {
    return Container(
      padding: const EdgeInsets.all(40),
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
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
            strokeWidth: 3,
          ),
          const SizedBox(height: 20),
          Text(
            'Loading conversations...',
            style: TextStyle(
              color: textLight,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Container(
      padding: const EdgeInsets.all(30),
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
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.1),
              borderRadius: BorderRadius.circular(50),
            ),
            child: Icon(Icons.error_outline, color: Colors.red, size: 40),
          ),
          const SizedBox(height: 20),
          Text(
            'Unable to Load Chats',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textDark,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Please check your connection and try again',
            textAlign: TextAlign.center,
            style: TextStyle(color: textLight, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              _loadConversations();
              _animationController.forward(from: 0);
            },
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryGreen,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
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
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: accentGreen.withOpacity(0.2),
              borderRadius: BorderRadius.circular(50),
            ),
            child: Icon(Icons.chat_bubble_outline, color: primaryGreen, size: 60),
          ),
          const SizedBox(height: 30),
          Text(
            'No Conversations Yet',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: textDark,
            ),
          ),
          const SizedBox(height: 15),
          Text(
            'Conversations will appear here when you place or receive orders with ${widget.userType == "Grower" ? "collectors" : "growers"}',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: textLight,
              fontSize: 14,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConversationsGrid(List<Conversation> conversations) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Recent chats header
        if (conversations.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 15),
            child: Row(
              children: [
                Icon(Icons.schedule, color: primaryGreen, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Recent Chats',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
                const Spacer(),
                Text(
                  '${conversations.length} chat${conversations.length == 1 ? '' : 's'}',
                  style: TextStyle(
                    fontSize: 12,
                    color: textLight,
                  ),
                ),
              ],
            ),
          ),
        
        // Conversations list
        ...conversations.map((conversation) => 
          _buildConversationCard(conversation)
        ).toList(),
      ],
    );
  }

  Widget _buildConversationCard(Conversation conversation) {
    final otherUserEmail = conversation.growerEmail == widget.email
        ? conversation.collectorEmail
        : conversation.growerEmail;
    
    final otherUserType = conversation.growerEmail == widget.email ? "Collector" : "Grower";
    final userName = otherUserEmail.split('@')[0];

    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChatScreen(
                  conversation: conversation,
                  currentUserEmail: widget.email,
                  currentUserType: widget.userType,
                ),
              ),
            ).then((_) {
              // Move this conversation to top when returning from chat
              _moveConversationToTop(conversation.conversationId);
            });
          },
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Avatar with online indicator
                Stack(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [primaryGreen, darkGreen],
                        ),
                        borderRadius: BorderRadius.circular(25),
                        boxShadow: [
                          BoxShadow(
                            color: primaryGreen.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          userName.substring(0, 1).toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    // Online indicator
                    Positioned(
                      bottom: 2,
                      right: 2,
                      child: Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.green,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(width: 15),
                
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              userName,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textDark,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: otherUserType == "Grower" 
                                  ? Colors.green.withOpacity(0.1)
                                  : Colors.blue.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              otherUserType,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: otherUserType == "Grower" ? Colors.green : Colors.blue,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        otherUserEmail,
                        style: const TextStyle(
                          fontSize: 12,
                          color: textLight,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(Icons.chat_bubble, color: primaryGreen, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            'Active conversation',
                            style: TextStyle(
                              fontSize: 12,
                              color: primaryGreen,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                // Arrow
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: accentGreen.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.arrow_forward_ios, color: primaryGreen, size: 16),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}