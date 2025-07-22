import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/feedback.dart';
import '../../services/feedback_service.dart';
import '../../providers/language_provider.dart';
import '../../providers/theme_provider.dart';
import '../../widgets/settings_button.dart';
import 'thank_you_page.dart';

class FeedbackPage extends StatefulWidget {
  const FeedbackPage({super.key});

  @override
  State<FeedbackPage> createState() => _FeedbackPageState();
}

class _FeedbackPageState extends State<FeedbackPage> {
  double _rating = 0;
  final List<String> _selectedTags = [];
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _commentController.addListener(_updateSubmitButtonState);
  }

  @override
  void dispose() {
    _commentController.removeListener(_updateSubmitButtonState);
    _commentController.dispose();
    super.dispose();
  }

  void _updateSubmitButtonState() {
    setState(() {
      // This will trigger rebuild to update submit button state
    });
  }

  bool get _canSubmit {
    return _rating > 0 || 
           _selectedTags.isNotEmpty || 
           _commentController.text.trim().isNotEmpty;
  }

  void _toggleTag(String tag) {
    setState(() {
      _selectedTags.contains(tag)
          ? _selectedTags.remove(tag)
          : _selectedTags.add(tag);
    });
  }

  void _submitFeedback() async {
    // Validate at least one field is filled
    if (!_canSubmit) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(context.read<LanguageProvider>().getText('pleaseFillAtLeastOneField')),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      // Create feedback model that matches C# backend structure
      final feedbackModel = FeedbackModel(
        rating: _rating,
        tags: _selectedTags,
        comment: _commentController.text.trim().isEmpty ? '' : _commentController.text.trim(),
      );

      print('Submitting Feedback: ${feedbackModel.toString()}');

      // Show loading
      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const Center(
            child: CircularProgressIndicator(),
          ),
        );
      }

      // Submit feedback to database
      final success = await FeedbackService.submit(feedbackModel);
      
      // Close loading dialog
      if (mounted) {
        Navigator.of(context).pop();
      }

      if (success) {
        // Only show thank you page if database save was successful
        if (mounted) {
          // Navigate to thank you page immediately (no snackbar)
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const ThankYouPage(),
            ),
          );
        }
      } else {
        // Show error message if database save failed
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(context.read<LanguageProvider>().getText('failedToSaveFeedback')),
              backgroundColor: Colors.red,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      // Close loading dialog if open
      if (mounted && Navigator.canPop(context)) {
        Navigator.of(context).pop();
      }
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${context.read<LanguageProvider>().getText('databaseError')}: ${e.toString()}'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          appBar: AppBar(
            title: Text(
              languageProvider.getText('feedback'),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            backgroundColor: Colors.green.shade700,
            elevation: 0,
            iconTheme: const IconThemeData(color: Colors.white),
            actions: const [
              SettingsButton(),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    spreadRadius: 2,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Rating Section
                  _buildRatingSection(languageProvider),
                  const SizedBox(height: 32),
                  
                  // Tags Section
                  _buildTagSection(languageProvider),
                  const SizedBox(height: 32),
                  
                  // Comments Section
                  _buildCommentSection(languageProvider),
                  const SizedBox(height: 32),
                  
                  // Submit Button
                  SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      onPressed: _canSubmit ? _submitFeedback : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _canSubmit ? Colors.green.shade700 : Colors.grey.shade400,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: _canSubmit ? 3 : 0,
                      ),
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 200),
                        child: Text(
                          _canSubmit ? languageProvider.getText('submitFeedback') : languageProvider.getText('pleaseFillAtLeastOneField'),
                          key: ValueKey(_canSubmit),
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: _canSubmit ? Colors.white : Colors.grey.shade600,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildRatingSection(LanguageProvider languageProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          languageProvider.getText('rateYourExperience'),
          style: const TextStyle(
            fontSize: 22, 
            fontWeight: FontWeight.bold,
            color: Color(0xFF0B3C16),
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (i) {
              return IconButton(
                icon: Icon(
                  i < _rating ? Icons.star : Icons.star_border,
                  color: Colors.amber,
                  size: 36,
                ),
                onPressed: () => setState(() => _rating = i + 1),
              );
            }),
          ),
        ),
        if (_rating > 0)
          Center(
            child: Text(
              '${_rating.toInt()}/5 ${languageProvider.getText('stars')}',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildTagSection(LanguageProvider languageProvider) {
    final List<_Tag> localizedTags = [
      _Tag(icon: Icons.emoji_events, label: languageProvider.getText('goodQuality')),
      _Tag(icon: Icons.local_shipping, label: languageProvider.getText('onTime')),
      _Tag(icon: Icons.chat_bubble_outline, label: languageProvider.getText('greatCommunication')),
      _Tag(icon: Icons.clear, label: languageProvider.getText('delay')),
      _Tag(icon: Icons.inventory_2_outlined, label: languageProvider.getText('poorPackaging')),
      _Tag(icon: Icons.phone_disabled, label: languageProvider.getText('unresponsive')),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          languageProvider.getText('whatDescribesYourExperience'),
          style: const TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold,
            color: Color(0xFF0B3C16),
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: localizedTags.map((tag) {
            final selected = _selectedTags.contains(tag.label);
            return ChoiceChip(
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(tag.icon, size: 18),
                  const SizedBox(width: 6),
                  Text(tag.label),
                ],
              ),
              selected: selected,
              onSelected: (_) => _toggleTag(tag.label),
              selectedColor: Colors.green.shade100,
              backgroundColor: Colors.grey.shade100,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: selected ? Colors.green.shade700 : Colors.grey.shade300,
                  width: selected ? 2 : 1,
                ),
              ),
            );
          }).toList(),
        ),
        if (_selectedTags.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Text(
              '${languageProvider.getText('selected')}: ${_selectedTags.join(", ")}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.green.shade700,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildCommentSection(LanguageProvider languageProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          languageProvider.getText('additionalComments'),
          style: const TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold,
            color: Color(0xFF0B3C16),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _commentController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText: languageProvider.getText('tellUsMoreAboutYourExperience'),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.green.shade700, width: 2),
            ),
            filled: true,
            fillColor: const Color(0xFFFAFAFA),
            contentPadding: const EdgeInsets.all(16),
          ),
        ),
      ],
    );
  }
}

class _Tag {
  final IconData icon;
  final String label;

  const _Tag({required this.icon, required this.label});
}
