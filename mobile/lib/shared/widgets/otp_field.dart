import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';

class OTPField extends StatefulWidget {
  const OTPField({
    super.key,
    required this.length,
    required this.onCompleted,
    this.onChanged,
  });

  final int length;
  final ValueChanged<String> onCompleted;
  final ValueChanged<String>? onChanged;

  @override
  State<OTPField> createState() => _OTPFieldState();
}

class _OTPFieldState extends State<OTPField> with SingleTickerProviderStateMixin {
  final _controller = TextEditingController();
  final _focusNode  = FocusNode();
  late final AnimationController _cursorAnim;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() => setState(() {}));
    _cursorAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _cursorAnim.dispose();
    super.dispose();
  }

  void _handleChange(String value) {
    final digits = value.replaceAll(RegExp(r'\D'), '');
    final capped  = digits.substring(0, min(digits.length, widget.length));

    if (_controller.text != capped) {
      _controller.value = TextEditingValue(
        text: capped,
        selection: TextSelection.collapsed(offset: capped.length),
      );
    }

    setState(() {});
    widget.onChanged?.call(capped);

    if (capped.length == widget.length) {
      _focusNode.unfocus();
      widget.onCompleted(capped);
    }
  }

  @override
  Widget build(BuildContext context) {
    final code     = _controller.text;
    final hasFocus = _focusNode.hasFocus;

    return GestureDetector(
      onTap: () => _focusNode.requestFocus(),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // ── Invisible real TextField (captures input) ──────────
          Opacity(
            opacity: 0,
            child: SizedBox(
              width: double.infinity,
              height: 56,
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                keyboardType: TextInputType.number,
                maxLength: widget.length,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                onChanged: _handleChange,
                showCursor: false,
                decoration: const InputDecoration(
                  counterText: '',
                  border: InputBorder.none,
                ),
              ),
            ),
          ),

          // ── Visual digit boxes ─────────────────────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(widget.length, (i) {
              final filled   = i < code.length;
              final isCursor = i == code.length && hasFocus;

              return AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: 48,
                height: 56,
                margin: const EdgeInsets.symmetric(horizontal: 5),
                decoration: BoxDecoration(
                  color: filled
                      ? AppColors.primaryLight
                      : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isCursor
                        ? AppColors.primary
                        : filled
                            ? AppColors.primary.withAlpha(100)
                            : AppColors.border,
                    width: isCursor || filled ? 2 : 1.5,
                  ),
                  boxShadow: isCursor
                      ? [BoxShadow(
                          color: AppColors.primary.withAlpha(40),
                          blurRadius: 8,
                          spreadRadius: 1,
                        )]
                      : null,
                ),
                child: Center(
                  child: filled
                      ? Text(
                          code[i],
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: AppColors.dark,
                          ),
                        )
                      : isCursor
                          ? AnimatedBuilder(
                              animation: _cursorAnim,
                              builder: (ctx, child) => Opacity(
                                opacity: _cursorAnim.value,
                                child: Container(
                                  width: 2,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    borderRadius: BorderRadius.circular(1),
                                  ),
                                ),
                              ),
                            )
                          : null,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
