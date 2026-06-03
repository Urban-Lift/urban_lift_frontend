import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class StartupScreen extends StatelessWidget {
  const StartupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final h = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Map-like decorative background (top 45%)
          Positioned(
            top: 0, left: 0, right: 0,
            height: h * 0.44,
            child: const _MapBackground(),
          ),

          // Skip button
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            right: 20,
            child: GestureDetector(
              onTap: () => context.go('/auth/login'),
              child: const Text('Skip',
                  style: TextStyle(fontSize: 14, color: AppColors.gray, fontWeight: FontWeight.w500)),
            ),
          ),

          // Main content
          SafeArea(
            child: Column(
              children: [
                SizedBox(height: h * 0.07),

                // UL Logo
                _ULLogo(),

                SizedBox(height: h * 0.015),

                // UrbanLift wordmark
                RichText(
                  text: const TextSpan(
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                    ),
                    children: [
                      TextSpan(text: 'Urban', style: TextStyle(color: AppColors.dark)),
                      TextSpan(text: 'Lift', style: TextStyle(color: AppColors.primary)),
                    ],
                  ),
                ),

                const Spacer(),

                // Bottom content card
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      // Heading
                      RichText(
                        textAlign: TextAlign.center,
                        text: const TextSpan(
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 30,
                            fontWeight: FontWeight.w800,
                            height: 1.2,
                          ),
                          children: [
                            TextSpan(
                              text: 'Move Together,\n',
                              style: TextStyle(color: AppColors.dark),
                            ),
                            TextSpan(
                              text: 'Grow Together',
                              style: TextStyle(color: AppColors.primary),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'The community carpooling app\ndesigned for your city.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 14, color: AppColors.gray, height: 1.5),
                      ),
                      const SizedBox(height: 28),

                      // Feature cards
                      Row(
                        children: const [
                          _FeatureCard(
                            icon: Icons.eco_outlined,
                            iconColor: Color(0xFF16A34A),
                            bgColor: Color(0xFFDCFCE7),
                            label: 'Green',
                            sub: 'Reduce CO2',
                          ),
                          SizedBox(width: 10),
                          _FeatureCard(
                            icon: Icons.people_outline_rounded,
                            iconColor: Color(0xFFD97706),
                            bgColor: Color(0xFFFEF3C7),
                            label: 'Social',
                            sub: 'Meet people',
                          ),
                          SizedBox(width: 10),
                          _FeatureCard(
                            icon: Icons.savings_outlined,
                            iconColor: Color(0xFF2563EB),
                            bgColor: Color(0xFFEFF6FF),
                            label: 'Save',
                            sub: 'Cut costs',
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),

                      // Get Started button
                      SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: ElevatedButton(
                          onPressed: () => context.go('/auth/login'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF22C55E),
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shadowColor: Colors.transparent,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('Get Started',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward_rounded, size: 18),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Have an account
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Have an account? ',
                              style: TextStyle(fontSize: 14, color: AppColors.gray)),
                          GestureDetector(
                            onTap: () => context.go('/auth/login'),
                            child: const Text('Log in',
                                style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.primary)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 36),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ULLogo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: 84,
          height: 84,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withAlpha(80),
                blurRadius: 20,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              'UL',
              style: TextStyle(
                color: Colors.white,
                fontSize: 30,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
          ),
        ),
        Positioned(
          top: -4,
          right: -4,
          child: Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: const Color(0xFFFBBF24),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}

class _MapBackground extends StatelessWidget {
  const _MapBackground();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFEBF5EE), Color(0xFFF0F7F2)],
        ),
      ),
      child: CustomPaint(
        painter: _MapPainter(),
        child: const SizedBox.expand(),
      ),
    );
  }
}

class _MapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final roadPaint = Paint()
      ..color = const Color(0xFFD1D5DB).withAlpha(120)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final minorPaint = Paint()
      ..color = const Color(0xFFD1D5DB).withAlpha(70)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // Horizontal roads
    canvas.drawLine(Offset(0, size.height * 0.25), Offset(size.width, size.height * 0.3), roadPaint);
    canvas.drawLine(Offset(0, size.height * 0.55), Offset(size.width, size.height * 0.6), roadPaint);
    canvas.drawLine(Offset(0, size.height * 0.75), Offset(size.width, size.height * 0.72), minorPaint);

    // Vertical roads
    canvas.drawLine(Offset(size.width * 0.25, 0), Offset(size.width * 0.28, size.height), roadPaint);
    canvas.drawLine(Offset(size.width * 0.6, 0), Offset(size.width * 0.58, size.height), roadPaint);
    canvas.drawLine(Offset(size.width * 0.82, 0), Offset(size.width * 0.85, size.height), minorPaint);

    // Diagonal road
    canvas.drawLine(
      Offset(size.width * 0.05, size.height * 0.1),
      Offset(size.width * 0.5, size.height * 0.8),
      minorPaint,
    );

    // Location pin
    final pinPaint = Paint()..color = AppColors.primary.withAlpha(160);
    canvas.drawCircle(Offset(size.width * 0.6, size.height * 0.35), 8, pinPaint);
    canvas.drawCircle(Offset(size.width * 0.6, size.height * 0.35), 4,
        Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color bgColor;
  final String label;
  final String sub;

  const _FeatureCard({
    required this.icon,
    required this.iconColor,
    required this.bgColor,
    required this.label,
    required this.sub,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(10),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(color: bgColor, shape: BoxShape.circle),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(height: 8),
            Text(label,
                style: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.dark)),
            const SizedBox(height: 2),
            Text(sub,
                style: const TextStyle(fontSize: 11, color: AppColors.gray),
                textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
