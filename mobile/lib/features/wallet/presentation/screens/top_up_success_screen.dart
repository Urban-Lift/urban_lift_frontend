import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../providers/wallet_provider.dart';
import '../../../../core/theme/app_theme.dart';

class TopUpSuccessScreen extends ConsumerWidget {
  const TopUpSuccessScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state  = ref.watch(walletProvider);
    final result = state.topUpResult;
    final amount = state.topUpAmount;

    if (result == null || amount == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => context.go('/wallet'));
      return const Scaffold(body: SizedBox.shrink());
    }

    final dtFmt = DateFormat('d MMM, yyyy · h:mm a');

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const Spacer(),

              // Glow check icon
              Stack(
                alignment: Alignment.center,
                children: [
                  // Outer glow ring
                  Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFFDCFCE7).withAlpha(180),
                    ),
                  ),
                  // Inner circle
                  Container(
                    width: 80,
                    height: 80,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF22C55E),
                    ),
                    child: const Icon(Icons.check_rounded,
                        size: 40, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 22),

              const Text('Top-up Successful!',
                  style: TextStyle(
                      fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.dark)),
              const SizedBox(height: 6),
              const Text('Your wallet has been funded.',
                  style: TextStyle(fontSize: 14, color: AppColors.gray)),
              const SizedBox(height: 32),

              // Details card
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    // Amount header
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(19),
                          topRight: Radius.circular(19),
                        ),
                      ),
                      child: Column(
                        children: [
                          const Text('AMOUNT ADDED',
                              style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.gray,
                                  letterSpacing: 0.8)),
                          const SizedBox(height: 6),
                          Text(
                            'GHS ${amount.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF16A34A),
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Divider(height: 1),

                    // Detail rows
                    Padding(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        children: [
                          _DetailRow(
                            label: 'New Balance',
                            value: 'GHS ${result.newBalance.toStringAsFixed(2)}',
                            valueBold: true,
                          ),
                          const SizedBox(height: 12),
                          _DetailRow(
                            label: 'Payment Method',
                            value: '● MTN Mobile Money',
                          ),
                          const SizedBox(height: 12),
                          _DetailRow(
                            label: 'Reference ID',
                            value: result.referenceId,
                            mono: true,
                          ),
                          const SizedBox(height: 12),
                          _DetailRow(
                            label: 'Date',
                            value: dtFmt.format(result.completedAt),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Done button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: () => context.go('/wallet'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF22C55E),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Done',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
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

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool valueBold;
  final bool mono;

  const _DetailRow({
    required this.label,
    required this.value,
    this.valueBold = false,
    this.mono = false,
  });

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Text(label,
          style: const TextStyle(fontSize: 13, color: AppColors.gray)),
      Text(value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: valueBold ? FontWeight.w700 : FontWeight.w500,
            color: AppColors.dark,
            fontFamily: mono ? 'monospace' : null,
          )),
    ],
  );
}
