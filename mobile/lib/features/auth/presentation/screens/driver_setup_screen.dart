import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class DriverSetupScreen extends ConsumerStatefulWidget {
  const DriverSetupScreen({super.key});

  @override
  ConsumerState<DriverSetupScreen> createState() => _DriverSetupScreenState();
}

class _DriverSetupScreenState extends ConsumerState<DriverSetupScreen> {
  final _formKey   = GlobalKey<FormState>();
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _emergCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _emergCtrl.dispose();
    super.dispose();
  }

  void _next() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final email = _emailCtrl.text.trim();
    if (email.isNotEmpty) {
      ref.read(authProvider.notifier).setPendingEmail(email);
    }
    context.push('/auth/setup-driver/vehicle', extra: {
      'fullName': _nameCtrl.text.trim(),
      'email': email.isNotEmpty ? email : null,
      'emergencyContact': _emergCtrl.text.trim(),
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.surface,
                    foregroundColor: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 24),

                // Progress dots
                Row(
                  children: [
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    _ProgressDot(active: false),
                    const SizedBox(width: 10),
                    const Text(
                      'Step 1 of 2',
                      style: TextStyle(fontSize: 12, color: AppColors.gray),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                const Text(
                  'Your details',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Personal info for your driver account',
                  style: TextStyle(fontSize: 14, color: AppColors.gray),
                ),
                const SizedBox(height: 32),

                // Avatar placeholder
                Center(
                  child: Stack(
                    children: [
                      Container(
                        width: 84,
                        height: 84,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.border, width: 2),
                        ),
                        child: const Icon(
                          Icons.person_outline_rounded,
                          size: 40,
                          color: AppColors.gray,
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 28,
                          height: 28,
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.camera_alt, size: 15, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 6),
                const Center(
                  child: Text(
                    'Add profile photo (optional)',
                    style: TextStyle(fontSize: 12, color: AppColors.gray),
                  ),
                ),
                const SizedBox(height: 28),

                TextFormField(
                  controller: _nameCtrl,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    hintText: 'Kofi Osei',
                  ),
                  validator: (v) => (v == null || v.trim().length < 2)
                      ? 'Full name must be at least 2 characters'
                      : null,
                ),
                const SizedBox(height: 16),

                TextFormField(
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email Address (optional)',
                    hintText: 'kofi@example.com',
                    helperText: 'For trip receipts and account recovery',
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return null;
                    final valid = RegExp(r'^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$').hasMatch(v);
                    return valid ? null : 'Enter a valid email address';
                  },
                ),
                const SizedBox(height: 16),

                TextFormField(
                  controller: _emergCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Emergency Contact',
                    hintText: '+233 20 123 4567',
                    helperText: 'A trusted person we can contact in an emergency',
                  ),
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Emergency contact is required';
                    final digits = v.replaceAll(RegExp(r'\D'), '');
                    return digits.length < 9 ? 'Enter a valid phone number' : null;
                  },
                ),
                const SizedBox(height: 40),

                ULButton(
                  label: 'Next: Vehicle Details',
                  onPressed: _next,
                  rightIcon: const Icon(Icons.arrow_forward_rounded, size: 18),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ProgressDot extends StatelessWidget {
  const _ProgressDot({required this.active});
  final bool active;

  @override
  Widget build(BuildContext context) => AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: active ? 28 : 10,
        height: 6,
        decoration: BoxDecoration(
          color: active ? AppColors.primary : AppColors.border,
          borderRadius: BorderRadius.circular(3),
        ),
      );
}
