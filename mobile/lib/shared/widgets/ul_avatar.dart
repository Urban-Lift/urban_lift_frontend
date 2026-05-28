import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_theme.dart';

enum AvatarSize { xs, sm, md, lg, xl }

class ULAvatar extends StatelessWidget {
  const ULAvatar({
    super.key,
    this.imageUrl,
    this.name,
    this.size = AvatarSize.md,
    this.isOnline,
    this.isVerified = false,
  });

  final String? imageUrl;
  final String? name;
  final AvatarSize size;
  final bool? isOnline;
  final bool isVerified;

  double get _diameter => switch (size) {
    AvatarSize.xs => 28,
    AvatarSize.sm => 36,
    AvatarSize.md => 48,
    AvatarSize.lg => 64,
    AvatarSize.xl => 80,
  };

  double get _fontSize => switch (size) {
    AvatarSize.xs => 11,
    AvatarSize.sm => 13,
    AvatarSize.md => 16,
    AvatarSize.lg => 22,
    AvatarSize.xl => 28,
  };

  double get _indicatorSize => switch (size) {
    AvatarSize.xs || AvatarSize.sm => 10,
    AvatarSize.md => 12,
    AvatarSize.lg || AvatarSize.xl => 14,
  };

  String _initials() {
    if (name == null || name!.isEmpty) return '?';
    final parts = name!.trim().split(' ');
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: _diameter,
          height: _diameter,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.primaryLight,
            border: Border.all(color: Colors.white, width: 2),
          ),
          clipBehavior: Clip.antiAlias,
          child: imageUrl != null
              ? CachedNetworkImage(
                  imageUrl: imageUrl!,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => const Center(
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  errorWidget: (context, url, error) => _initialsWidget(),
                )
              : _initialsWidget(),
        ),
        if (isOnline != null)
          Positioned(
            bottom: 0, right: 0,
            child: Container(
              width: _indicatorSize, height: _indicatorSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isOnline! ? const Color(0xFF22C55E) : AppColors.gray,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
        if (isVerified)
          Positioned(
            bottom: -2, right: -2,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primary,
              ),
              child: const Icon(Icons.check, color: Colors.white, size: 10),
            ),
          ),
      ],
    );
  }

  Widget _initialsWidget() => Center(
    child: Text(
      _initials(),
      style: TextStyle(
        fontSize: _fontSize,
        fontWeight: FontWeight.w600,
        color: AppColors.primary,
      ),
    ),
  );
}
