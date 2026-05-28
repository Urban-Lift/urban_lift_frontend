import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

enum ULButtonVariant { primary, secondary, outline, ghost, danger }
enum ULButtonSize { sm, md, lg }

class ULButton extends StatelessWidget {
  const ULButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = ULButtonVariant.primary,
    this.size = ULButtonSize.lg,
    this.loading = false,
    this.fullWidth = true,
    this.icon,
    this.rightIcon,
  });

  final String label;
  final VoidCallback? onPressed;
  final ULButtonVariant variant;
  final ULButtonSize size;
  final bool loading;
  final bool fullWidth;
  final Widget? icon;
  final Widget? rightIcon;

  @override
  Widget build(BuildContext context) {
    final height = switch (size) {
      ULButtonSize.sm => 40.0,
      ULButtonSize.md => 48.0,
      ULButtonSize.lg => 54.0,
    };

    final fontSize = switch (size) {
      ULButtonSize.sm => 14.0,
      ULButtonSize.md => 15.0,
      ULButtonSize.lg => 16.0,
    };

    Widget child = loading
        ? const SizedBox(
            width: 20, height: 20,
            child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Text(label, style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600)),
              if (rightIcon != null) ...[const SizedBox(width: 8), rightIcon!],
            ],
          );

    final style = switch (variant) {
      ULButtonVariant.primary => ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.primary.withAlpha(120),
        ),
      ULButtonVariant.secondary => ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryLight,
          foregroundColor: AppColors.primary,
        ),
      ULButtonVariant.outline => ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
      ULButtonVariant.ghost => ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: AppColors.primary,
          elevation: 0,
          shadowColor: Colors.transparent,
        ),
      ULButtonVariant.danger => ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: Colors.white,
        ),
    }.copyWith(
      minimumSize: WidgetStateProperty.all(
        Size(fullWidth ? double.infinity : 0, height),
      ),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    );

    return ElevatedButton(
      onPressed: loading ? null : onPressed,
      style: style,
      child: child,
    );
  }
}
