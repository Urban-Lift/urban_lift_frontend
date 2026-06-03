import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

const _reviewTags = [
  {'id': 'safe_driver', 'label': 'Safe driver'},
  {'id': 'clean_car',   'label': 'Clean car'},
  {'id': 'friendly',    'label': 'Friendly'},
  {'id': 'on_time',     'label': 'On time'},
  {'id': 'great_music', 'label': 'Great music'},
];

const _ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

class RateTripScreen extends ConsumerStatefulWidget {
  const RateTripScreen({super.key, required this.tripId});
  final String tripId;

  @override
  ConsumerState<RateTripScreen> createState() => _RateTripScreenState();
}

class _RateTripScreenState extends ConsumerState<RateTripScreen> {
  int _rating          = 0;
  final List<String> _tags   = [];
  final _noteCtrl      = TextEditingController();
  bool _submitting     = false;

  @override
  void dispose() {
    _noteCtrl.dispose();
    super.dispose();
  }

  void _toggleTag(String id) {
    setState(() {
      if (_tags.contains(id)) {
        _tags.remove(id);
      } else {
        _tags.add(id);
      }
    });
  }

  Future<void> _submit() async {
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a rating'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _submitting = true);
    try {
      await ref.read(myRidesProvider.notifier).submitReview(
        tripId: widget.tripId,
        rating: _rating,
        tags: _tags,
        note: _noteCtrl.text.trim().isEmpty ? null : _noteCtrl.text.trim(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Thanks for your feedback!'), backgroundColor: AppColors.primary),
        );
        context.go('/my-rides');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  // Find the booking for this trip id
  String? get _driverName {
    final past = ref.read(myRidesProvider).past;
    try {
      return past.firstWhere((b) => b.id == widget.tripId).ride.driver.fullName;
    } catch (_) {
      return null;
    }
  }

  String? get _routeSummary {
    final past = ref.read(myRidesProvider).past;
    try {
      final booking = past.firstWhere((b) => b.id == widget.tripId);
      return '${booking.ride.pickupLocation} → ${booking.ride.dropoffLocation}';
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              IconButton(
                onPressed: () => context.pop(),
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                style: IconButton.styleFrom(backgroundColor: AppColors.surface, foregroundColor: AppColors.dark),
              ),
              const SizedBox(height: 24),

              const Text('How was your ride?', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              const Text('Your feedback helps drivers improve', style: TextStyle(fontSize: 14, color: AppColors.gray)),
              const SizedBox(height: 28),

              // Driver card
              if (_driverName != null) ...[
                Row(children: [
                  ULAvatar(name: _driverName!, size: AvatarSize.lg),
                  const SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(_driverName!, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                    if (_routeSummary != null) Text(_routeSummary!, style: const TextStyle(fontSize: 12, color: AppColors.gray)),
                  ]),
                ]),
                const SizedBox(height: 28),
              ],

              // Stars
              Center(
                child: Column(
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(5, (i) {
                        final star = i + 1;
                        return GestureDetector(
                          onTap: () => setState(() => _rating = star),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 6),
                            child: Icon(
                              Icons.star_rounded,
                              size: 44,
                              color: star <= _rating ? const Color(0xFFFFB300) : AppColors.border,
                            ),
                          ),
                        );
                      }),
                    ),
                    if (_rating > 0) ...[
                      const SizedBox(height: 8),
                      Text(_ratingLabels[_rating], style: const TextStyle(fontSize: 14, color: AppColors.gray, fontWeight: FontWeight.w500)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Tags
              if (_rating > 0) ...[
                const Text('What stood out?', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8, runSpacing: 8,
                  children: _reviewTags.map((tag) {
                    final id     = tag['id']!;
                    final label  = tag['label']!;
                    final active = _tags.contains(id);
                    return GestureDetector(
                      onTap: () => _toggleTag(id),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                        decoration: BoxDecoration(
                          color: active ? AppColors.primary : Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: active ? AppColors.primary : AppColors.border),
                        ),
                        child: Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: active ? Colors.white : AppColors.gray)),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
                const Text('Add a note (optional)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextField(
                  controller: _noteCtrl,
                  maxLines: 3,
                  maxLength: 200,
                  decoration: const InputDecoration(
                    hintText: 'Great ride, very punctual...',
                    counterStyle: TextStyle(fontSize: 11, color: AppColors.gray),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              ULButton(label: 'Submit Review', loading: _submitting, onPressed: _rating == 0 ? null : _submit),
              const SizedBox(height: 12),
              Center(
                child: TextButton(
                  onPressed: () => context.go('/my-rides'),
                  child: const Text('Skip', style: TextStyle(fontSize: 14, color: AppColors.gray)),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
