import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';

class ReferScreen extends ConsumerStatefulWidget {
  const ReferScreen({super.key});

  @override
  ConsumerState<ReferScreen> createState() => _ReferScreenState();
}

class _ReferScreenState extends ConsumerState<ReferScreen> {
  bool _codeCopied = false;
  bool _linkCopied = false;

  void _copy(String text, bool isCode) {
    Clipboard.setData(ClipboardData(text: text));
    setState(() {
      if (isCode) { _codeCopied = true; } else { _linkCopied = true; }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Copied to clipboard!'), backgroundColor: AppColors.primary),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() { _codeCopied = false; _linkCopied = false; });
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final code = user?.referralCode ?? 'URBANLIFT';
    final link = 'https://urbanlift.app/join?ref=$code';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => context.pop(),
        ),
        title: const Text('Refer a Friend',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
        children: [
          // Hero
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(40),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.card_giftcard_rounded, size: 28, color: Colors.white),
                ),
                const SizedBox(height: 14),
                const Text('Give GHS 10, Get GHS 10',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                    textAlign: TextAlign.center),
                const SizedBox(height: 6),
                const Text(
                  'Invite a friend to UrbanLift — you both earn when they complete their first ride.',
                  style: TextStyle(fontSize: 13, color: AppColors.lightGreen),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Referral code
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Your Referral Code',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(code,
                            style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 4,
                                color: AppColors.dark)),
                      ),
                      GestureDetector(
                        onTap: () => _copy(code, true),
                        child: Row(
                          children: [
                            Icon(_codeCopied ? Icons.check : Icons.copy_outlined,
                                size: 16, color: AppColors.primary),
                            const SizedBox(width: 4),
                            Text(_codeCopied ? 'Copied!' : 'Copy',
                                style: const TextStyle(
                                    fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                const Text('Or share your link',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(link,
                            style: const TextStyle(fontSize: 11, color: AppColors.gray),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                      ),
                      GestureDetector(
                        onTap: () => _copy(link, false),
                        child: Icon(
                          _linkCopied ? Icons.check : Icons.copy_outlined,
                          size: 16, color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // How it works
          const Text('How it works',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
          const SizedBox(height: 10),
          ...[
            (Icons.copy_outlined,       'Share your code',  'Send your unique referral code to friends'),
            (Icons.people_outline,      'They sign up',     'Your friend creates an UrbanLift account'),
            (Icons.account_balance_wallet_outlined, 'You both earn', 'Get GHS 10 added to your wallet instantly'),
          ].asMap().entries.map((e) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(color: AppColors.lightGreen, borderRadius: BorderRadius.circular(10)),
                  child: Icon(e.value.$1, size: 17, color: AppColors.primary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${e.key + 1}. ${e.value.$2}',
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.dark)),
                      Text(e.value.$3,
                          style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                    ],
                  ),
                ),
              ],
            ),
          )),
          const SizedBox(height: 12),

          // Earnings summary
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFFDE68A)),
            ),
            child: Row(
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.account_balance_wallet_outlined, size: 18, color: Color(0xFFD97706)),
                ),
                const SizedBox(width: 12),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("You've earned GHS 10.00",
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF78350F))),
                    Text('From 1 successful referral',
                        style: TextStyle(fontSize: 12, color: Color(0xFFD97706))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
