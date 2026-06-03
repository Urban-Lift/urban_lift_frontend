import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';

class EmailOTPScreen extends ConsumerStatefulWidget {
  const EmailOTPScreen({super.key});

  @override
  ConsumerState<EmailOTPScreen> createState() => _EmailOTPScreenState();
}

class _EmailOTPScreenState extends ConsumerState<EmailOTPScreen> {
  int _countdown = AppConstants.otpResendSecs;
  Timer? _timer;
  String _error = '';
  bool _verifying = false;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _countdown = AppConstants.otpResendSecs);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_countdown <= 1) {
        t.cancel();
        setState(() => _countdown = 0);
      } else {
        setState(() => _countdown--);
      }
    });
  }

  Future<void> _verify(String code) async {
    if (code.length != 6) return;
    setState(() { _error = ''; _verifying = true; });
    try {
      await ref.read(authProvider.notifier).verifyEmailCode(code);
      if (!mounted) return;
      final role = ref.read(authProvider).pendingRole;
      context.go(role == 'driver' ? '/driver/home' : '/home');
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
        _verifying = false;
      });
    }
  }

  Future<void> _resend() async {
    try {
      final email = ref.read(authProvider).pendingEmail;
      await ref.read(authProvider.notifier).sendEmailCode(email);
      _startCountdown();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    }
  }

  String _maskEmail(String email) {
    final parts = email.split('@');
    if (parts.length != 2 || parts[0].isEmpty) return email;
    final local = parts[0];
    final masked = local.length <= 2
        ? local
        : '${local[0]}${'*' * (local.length - 2)}${local[local.length - 1]}';
    return '$masked@${parts[1]}';
  }

  @override
  Widget build(BuildContext context) {
    final email = ref.watch(authProvider).pendingEmail;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
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
              const SizedBox(height: 32),

              // Icon
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.mail_outline_rounded,
                    size: 36,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Center(
                child: Column(
                  children: [
                    const Text(
                      'Check your email',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppColors.dark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text.rich(
                      TextSpan(
                        text: 'We sent a 6-digit code to ',
                        style: const TextStyle(fontSize: 14, color: AppColors.gray),
                        children: [
                          TextSpan(
                            text: _maskEmail(email),
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.dark,
                            ),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      "Check your spam folder if you don't see it",
                      style: TextStyle(fontSize: 12, color: AppColors.gray),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              OTPField(
                length: 6,
                onCompleted: _verify,
                onChanged: (_) => setState(() => _error = ''),
              ),

              if (_error.isNotEmpty) ...[
                const SizedBox(height: 12),
                Center(
                  child: Text(
                    _error,
                    style: const TextStyle(fontSize: 13, color: AppColors.error),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],

              const SizedBox(height: 24),

              Center(
                child: _countdown > 0
                    ? Text(
                        'Resend code in ${_countdown}s',
                        style: const TextStyle(fontSize: 14, color: AppColors.gray),
                      )
                    : TextButton(
                        onPressed: _resend,
                        child: const Text(
                          'Resend email',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
              ),

              const Spacer(),

              ULButton(label: 'Verify Email', loading: _verifying, onPressed: null),
              const SizedBox(height: 12),
              Center(
                child: TextButton(
                  onPressed: () {
                    final role = ref.read(authProvider).pendingRole;
                    context.go(role == 'driver' ? '/driver/home' : '/home');
                  },
                  child: const Text(
                    'Skip for now',
                    style: TextStyle(fontSize: 14, color: AppColors.gray),
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
