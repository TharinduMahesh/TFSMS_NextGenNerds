import 'package:flutter/material.dart';
import '../../models/feeedback.dart';
import '../../services/feedback_service.dart';

class FeedbackPage extends StatefulWidget {
  const FeedbackPage({super.key});

  @override
  State<FeedbackPage> createState() => _FeedbackPageState();
}

class _FeedbackPageState extends State<FeedbackPage> {
  int _currentStep = 0;
  double _rating = 0;
  final List<String> _selectedTags = [];
  final TextEditingController _commentController = TextEditingController();

  final List<_Tag> _tags = const [
    _Tag(icon: Icons.emoji_events, label: 'Good Quality'),
    _Tag(icon: Icons.local_shipping, label: 'On-Time'),
    _Tag(icon: Icons.chat_bubble_outline, label: 'Great Communication'),
    _Tag(icon: Icons.clear, label: 'Delay'),
    _Tag(icon: Icons.inventory_2_outlined, label: 'Poor Packaging'),
    _Tag(icon: Icons.phone_disabled, label: 'Unresponsive'),
  ];

  void _toggleTag(String tag) {
    setState(() {
      _selectedTags.contains(tag) ? _selectedTags.remove(tag) : _selectedTags.add(tag);
    });
  }

  void _nextStep() {
    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
    } else {
      _submitFeedback();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  void _submitFeedback() async {
    final feedback = FeedbackModel(
      rating: _rating,
      tags: _selectedTags,
      comment: _commentController.text,
    );

    final success = await FeedbackService.submit(feedback);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Feedback submitted')),
      );
      Navigator.popUntil(context, (route) => route.isFirst);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Submission failed')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FFF0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.black),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Icon(Icons.settings, color: Colors.black),
          ),
        ],
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Column(
            children: [
              _buildStepperHeader(),
              const SizedBox(height: 20),
              if (_currentStep == 0) _buildRatingStep(),
              if (_currentStep == 1) _buildTagStep(),
              if (_currentStep == 2) _buildCommentStep(),
              const SizedBox(height: 20),
              Row(
                children: [
                  if (_currentStep > 0)
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _prevStep,
                        child: const Text('Back'),
                      ),
                    ),
                  if (_currentStep > 0) const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _nextStep,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0B3C16),
                      ),
                      child: Text(_currentStep < 2 ? 'Next' : 'Submit'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRatingStep() => Column(
    children: [
      const Text('Rate Your Experience', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(5, (i) {
          return IconButton(
            icon: Icon(
              i < _rating ? Icons.star : Icons.star_border,
              color: Colors.amber,
              size: 32,
            ),
            onPressed: () => setState(() => _rating = i + 1),
          );
        }),
      ),
    ],
  );

  Widget _buildTagStep() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text('Why this rating?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        children: _tags.map((tag) {
          final selected = _selectedTags.contains(tag.label);
          return ChoiceChip(
            label: Row(
              mainAxisSize: MainAxisSize.min,
              children: [Icon(tag.icon, size: 16), const SizedBox(width: 4), Text(tag.label)],
            ),
            selected: selected,
            onSelected: (_) => _toggleTag(tag.label),
            selectedColor: Colors.green.shade100,
            backgroundColor: Colors.grey.shade100,
          );
        }).toList(),
      ),
    ],
  );

  Widget _buildCommentStep() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text('Add comments (optional)...'),
      const SizedBox(height: 8),
      TextField(
        controller: _commentController,
        maxLines: 4,
        decoration: InputDecoration(
          hintText: '...',
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: const Color(0xFFF8F8F8),
        ),
      ),
    ],
  );

  Widget _buildStepperHeader() => Row(
    children: List.generate(3, (index) {
      return Expanded(
        child: Container(
          height: 4,
          margin: EdgeInsets.only(right: index < 2 ? 4 : 0),
          decoration: BoxDecoration(
            color: index <= _currentStep ? const Color(0xFF0B3C16) : const Color(0xFFEDEDED),
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    }),
  );
}


class _Tag {
  final IconData icon;
  final String label;

  const _Tag({required this.icon, required this.label});
}
