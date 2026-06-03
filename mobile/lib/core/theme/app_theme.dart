import 'package:flutter/material.dart';

class AppColors {
  static const primary      = Color(0xFF1A7A3C);
  static const primaryLight = Color(0xFFD1FAE5);
  static const primaryDark  = Color(0xFF0F4522);
  static const lightGreen   = Color(0xFFD1FAE5);  // alias for primaryLight
  static const surface      = Color(0xFFF9FAFB);
  static const background   = Color(0xFFF9FAFB);  // alias for surface
  static const border       = Color(0xFFD1D5DB);
  static const dark         = Color(0xFF111827);
  static const gray         = Color(0xFF6B7280);
  static const warning      = Color(0xFFD97706);
  static const error        = Color(0xFFDC2626);
  static const white        = Colors.white;
}

class AppTheme {
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      primary: AppColors.primary,
      surface: AppColors.surface,
      error: AppColors.error,
    ),
    scaffoldBackgroundColor: AppColors.surface,
    fontFamily: 'Inter',
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: AppColors.dark,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        fontSize: 17,
        fontWeight: FontWeight.w600,
        color: AppColors.dark,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 52),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      labelStyle: const TextStyle(color: AppColors.gray, fontFamily: 'Inter'),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.border),
      ),
    ),
    dividerTheme: const DividerThemeData(color: AppColors.border, thickness: 1),
    textTheme: const TextTheme(
      displayLarge:  TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w700, color: AppColors.dark),
      headlineMedium:TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w700, fontSize: 24, color: AppColors.dark),
      titleLarge:    TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 18, color: AppColors.dark),
      titleMedium:   TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 16, color: AppColors.dark),
      bodyLarge:     TextStyle(fontFamily: 'Inter', fontSize: 16, color: AppColors.dark),
      bodyMedium:    TextStyle(fontFamily: 'Inter', fontSize: 14, color: AppColors.dark),
      bodySmall:     TextStyle(fontFamily: 'Inter', fontSize: 12, color: AppColors.gray),
      labelLarge:    TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 14),
    ),
  );
}
