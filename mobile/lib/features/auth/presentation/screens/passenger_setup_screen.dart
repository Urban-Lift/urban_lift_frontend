import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

class PassengerSetupScreen extends ConsumerStatefulWidget {
  const PassengerSetupScreen({super.key});

  @override
  ConsumerState<PassengerSetupScreen> createState() => _PassengerSetupScreenState();
}

class _PassengerSetupScreenState extends ConsumerState<PassengerSetupScreen> {
  final _formKey     = GlobalKey<FormState>();
  final _nameCtrl    = TextEditingController();
  final _emailCtrl   = TextEditingController();
  final _emergCtrl   = TextEditingController();
  bool _loading      = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _emergCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      final email = _emailCtrl.text.trim();
      await ref.read(authProvider.notifier).createPassengerProfile(
        fullName: _nameCtrl.text.trim(),
        emergencyContact: _emergCtrl.text.trim(),
        email: email.isNotEmpty ? email : null,
      );
      if (!mounted) return;
      if (email.isNotEmpty) {
        await ref.read(authProvider.notifier).sendEmailCode(email);
        if (mounted) context.push('/auth/otp-email');
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Welcome to UrbanLift! 🎉'), backgroundColor: AppColors.primary),
          );
          context.go('/home');
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
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
                const Text(
                  'Set up your account',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Almost there — just a few more details',
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

                // Full Name
                TextFormField(
                  controller: _nameCtrl,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    hintText: 'Kwame Mensah',
                  ),
                  validator: (v) => (v == null || v.trim().length < 2)
                      ? 'Full name must be at least 2 characters'
                      : null,
                ),
                const SizedBox(height: 16),

                // Email
                TextFormField(
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email Address (optional)',
                    hintText: 'kwame@example.com',
                    helperText: 'Used for booking receipts and account recovery',
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return null;
                    final valid = RegExp(r'^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$').hasMatch(v);
                    return valid ? null : 'Enter a valid email address';
                  },
                ),
                const SizedBox(height: 16),

                // Emergency Contact
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

                ULButton(label: 'Create Account', loading: _loading, onPressed: _submit),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
