import 'package:flutter/material.dart';

class StarRating extends StatefulWidget {
  const StarRating({
    super.key,
    this.value = 0,
    this.max = 5,
    this.size = 32,
    this.readOnly = false,
    this.onChanged,
    this.showLabel = false,
  });

  final int value;
  final int max;
  final double size;
  final bool readOnly;
  final ValueChanged<int>? onChanged;
  final bool showLabel;

  @override
  State<StarRating> createState() => _StarRatingState();
}

class _StarRatingState extends State<StarRating> {
  int _hover = 0;

  static const _labels = {1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent'};

  @override
  Widget build(BuildContext context) {
    final active = _hover > 0 ? _hover : widget.value;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(widget.max, (i) {
            final star = i + 1;
            return GestureDetector(
              onTap: widget.readOnly ? null : () {
                widget.onChanged?.call(star);
              },
              onPanUpdate: widget.readOnly ? null : (d) {
                setState(() => _hover = star);
              },
              onPanEnd: widget.readOnly ? null : (_) {
                widget.onChanged?.call(_hover);
                setState(() => _hover = 0);
              },
              child: MouseRegion(
                onEnter: widget.readOnly ? null : (_) => setState(() => _hover = star),
                onExit:  widget.readOnly ? null : (_) => setState(() => _hover = 0),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Icon(
                    star <= active ? Icons.star_rounded : Icons.star_outline_rounded,
                    size: widget.size,
                    color: star <= active ? const Color(0xFFFBBF24) : const Color(0xFFD1D5DB),
                  ),
                ),
              ),
            );
          }),
        ),
        if (widget.showLabel && active > 0) ...[
          const SizedBox(height: 4),
          Text(
            _labels[active] ?? '',
            style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
          ),
        ],
      ],
    );
  }
}
