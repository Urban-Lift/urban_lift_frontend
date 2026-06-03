import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';

class PhoneOTPScreen extends ConsumerStatefulWidget {
  const PhoneOTPScreen({super.key});

  @override
  ConsumerState<PhoneOTPScreen> createState() => _PhoneOTPScreenState();
}

class _PhoneOTPScreenState extends ConsumerState<PhoneOTPScreen> {
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
      await ref.read(authProvider.notifier).verifyPhoneOTP(code);
      if (!mounted) return;
      final role = ref.read(authProvider).pendingRole;
      if (role == 'driver') {
        context.push('/auth/setup-driver');
      } else {
        context.push('/auth/setup-passenger');
      }
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
        _verifying = false;
      });
    }
  }

  Future<void> _resend() async {
    try {
      final phone = ref.read(authProvider).pendingPhone;
      await ref.read(authProvider.notifier).sendOTP(phone);
      _startCountdown();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    }
  }

  String _maskPhone(String phone) {
    if (phone.length < 6) return phone;
    return '${phone.substring(0, 5)}****${phone.substring(phone.length - 2)}';
  }

  @override
  Widget build(BuildContext context) {
    final phone = ref.watch(authProvider).pendingPhone;

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
                    Icons.chat_bubble_outline_rounded,
                    size: 36,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Header
              Center(
                child: Column(
                  children: [
                    const Text(
                      'Verify your number',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppColors.dark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text.rich(
                      TextSpan(
                        text: 'Enter the 6-digit code sent to ',
                        style: const TextStyle(fontSize: 14, color: AppColors.gray),
                        children: [
                          TextSpan(
                            text: _maskPhone(phone),
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.dark,
                            ),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // OTP boxes
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

              // Resend
              Center(
                child: _countdown > 0
                    ? Text(
                        'Resend code in ${_countdown}s',
                        style: const TextStyle(fontSize: 14, color: AppColors.gray),
                      )
                    : TextButton(
                        onPressed: _resend,
                        child: const Text(
                          'Resend OTP',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
              ),

              const Spacer(),

              ULButton(
                label: 'Verify',
                loading: _verifying,
                onPressed: null, // auto-submits on 6 digits
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
