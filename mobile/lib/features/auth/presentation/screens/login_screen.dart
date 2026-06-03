import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  String _role = 'passenger';
  final _phoneCtrl = TextEditingController();
  String _error = '';

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  String get _rawPhone => _phoneCtrl.text.replaceAll(RegExp(r'\D'), '');

  String get _fullPhone {
    final raw = _rawPhone;
    if (raw.startsWith('0')) return '+233${raw.substring(1)}';
    if (raw.startsWith('233')) return '+$raw';
    return '+233$raw';
  }

  bool get _isValid => _rawPhone.length >= 9 && _rawPhone.length <= 10;

  Future<void> _sendOTP() async {
    if (!_isValid) {
      setState(() => _error = 'Enter a valid Ghana phone number (e.g. 054 123 4567)');
      return;
    }
    setState(() => _error = '');
    ref.read(authProvider.notifier).setPendingPhone(_fullPhone);
    ref.read(authProvider.notifier).setPendingRole(_role);
    try {
      await ref.read(authProvider.notifier).sendOTP(_fullPhone);
      if (mounted) context.push('/auth/otp-phone');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(authProvider).isLoading;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 48),

              // Header
              const Text(
                'Welcome to\nUrbanLift',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.dark,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Enter your Ghana phone number to get started',
                style: TextStyle(fontSize: 14, color: AppColors.gray),
              ),
              const SizedBox(height: 32),

              // Role toggle
              const Text(
                'I want to',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.dark,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    _RoleTab(
                      label: 'Passenger',
                      subtitle: 'Book rides in Accra',
                      selected: _role == 'passenger',
                      onTap: () => setState(() => _role = 'passenger'),
                    ),
                    _RoleTab(
                      label: 'Driver',
                      subtitle: 'Earn by sharing rides',
                      selected: _role == 'driver',
                      onTap: () => setState(() => _role = 'driver'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Phone input
              const Text(
                'Phone Number',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.dark,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: _error.isNotEmpty ? AppColors.error : AppColors.border,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.white,
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Country code prefix box
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                      decoration: const BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(11),
                          bottomLeft: Radius.circular(11),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.phone_outlined, size: 16, color: AppColors.gray),
                          const SizedBox(width: 6),
                          Text(
                            AppConstants.phonePrefix,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              color: AppColors.dark,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Divider
                    Container(width: 1, height: 24, color: AppColors.border),
                    // Number input
                    Expanded(
                      child: TextField(
                        controller: _phoneCtrl,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        onChanged: (_) => setState(() => _error = ''),
                        onSubmitted: (_) => _sendOTP(),
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.dark,
                        ),
                        decoration: const InputDecoration(
                          hintText: '054 123 4567',
                          hintStyle: TextStyle(color: AppColors.gray, fontSize: 14),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                          isDense: true,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (_error.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  _error,
                  style: const TextStyle(fontSize: 12, color: AppColors.error),
                ),
              ] else ...[
                const SizedBox(height: 6),
                const Text(
                  "You'll receive a 6-digit OTP",
                  style: TextStyle(fontSize: 12, color: AppColors.gray),
                ),
              ],
              const SizedBox(height: 40),

              ULButton(
                label: 'Send OTP',
                loading: isLoading,
                onPressed: _isValid ? _sendOTP : null,
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  'Standard SMS rates may apply',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.gray.withAlpha(180),
                  ),
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

class _RoleTab extends StatelessWidget {
  const _RoleTab({
    required this.label,
    required this.subtitle,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          decoration: BoxDecoration(
            color: selected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: selected
                ? [BoxShadow(color: Colors.black.withAlpha(20), blurRadius: 8, offset: const Offset(0, 2))]
                : null,
          ),
          child: Column(
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: selected ? AppColors.primary : AppColors.gray,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 11,
                  color: selected ? AppColors.primary.withAlpha(180) : AppColors.gray.withAlpha(150),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
