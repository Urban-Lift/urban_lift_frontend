import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../providers/community_provider.dart';
import '../../data/community_models.dart';
import '../../../../core/theme/app_theme.dart';

class GroupChatScreen extends ConsumerStatefulWidget {
  final String groupId;
  const GroupChatScreen({super.key, required this.groupId});

  @override
  ConsumerState<GroupChatScreen> createState() => _GroupChatScreenState();
}

class _GroupChatScreenState extends ConsumerState<GroupChatScreen> {
  final _ctrl       = TextEditingController();
  final _scrollCtrl = ScrollController();
  static const _myId = 'usr-001';

  @override
  void initState() {
    super.initState();
    Future.microtask(
        () => ref.read(communityProvider.notifier).loadMessages(widget.groupId));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _send() async {
    final text = _ctrl.text.trim();
    if (text.isEmpty) return;
    _ctrl.clear();
    await ref.read(communityProvider.notifier).sendMessage(widget.groupId, text);
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(communityProvider);
    final group = state.groups.firstWhere(
      (g) => g.id == widget.groupId,
      orElse: () => CommunityGroup(
        id: widget.groupId,
        name: 'Group Chat',
        privacy: GroupPrivacy.public,
        memberCount: 0,
        isJoined: true,
        coverColor: 'green',
        createdAt: '',
      ),
    );
    final msgs = state.messages[widget.groupId] ?? [];

    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(group.name,
                style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 15,
                    color: AppColors.dark),
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
            Text(
              '${group.memberCount} Members • 3 Online',
              style: const TextStyle(fontSize: 11, color: AppColors.gray),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded,
                size: 22, color: AppColors.gray),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: state.isLoading
                ? const Center(child: CircularProgressIndicator())
                : msgs.isEmpty
                    ? const Center(
                        child: Text(
                          'No messages yet.\nBe the first to say something!',
                          style: TextStyle(color: AppColors.gray, fontSize: 13),
                          textAlign: TextAlign.center,
                        ),
                      )
                    : ListView.builder(
                        controller: _scrollCtrl,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 16),
                        itemCount: _buildItems(msgs).length,
                        itemBuilder: (_, i) {
                          final item = _buildItems(msgs)[i];
                          if (item is String) {
                            return _DateSeparator(label: item);
                          }
                          final msg     = item as ChatMessage;
                          final isMine  = msg.sender.id == _myId;
                          final idx     = msgs.indexOf(msg);
                          final showAvatar =
                              idx == 0 || msgs[idx - 1].sender.id != msg.sender.id;
                          return _Bubble(
                              msg: msg, isMine: isMine, showName: showAvatar && !isMine);
                        },
                      ),
          ),

          // Input bar
          Container(
            color: Colors.white,
            padding: EdgeInsets.only(
              left: 8,
              right: 8,
              top: 8,
              bottom: MediaQuery.of(context).padding.bottom + 8,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // Attachment button
                Container(
                  width: 38,
                  height: 38,
                  margin: const EdgeInsets.only(bottom: 1),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.border),
                  ),
                  child: const Icon(Icons.add_rounded,
                      size: 20, color: AppColors.gray),
                ),
                const SizedBox(width: 6),

                // Text input
                Expanded(
                  child: Container(
                    constraints: const BoxConstraints(maxHeight: 120),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F2F5),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _ctrl,
                            maxLines: null,
                            keyboardType: TextInputType.multiline,
                            textInputAction: TextInputAction.newline,
                            style: const TextStyle(fontSize: 14),
                            decoration: const InputDecoration(
                              hintText: 'Type a message…',
                              hintStyle: TextStyle(color: AppColors.gray, fontSize: 14),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 10),
                            ),
                          ),
                        ),
                        // Emoji button
                        Padding(
                          padding: const EdgeInsets.only(right: 6, bottom: 8),
                          child: GestureDetector(
                            onTap: () {},
                            child: const Icon(Icons.sentiment_satisfied_alt_outlined,
                                size: 20, color: AppColors.gray),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 6),

                // Send button
                GestureDetector(
                  onTap: state.isSending ? null : _send,
                  child: Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: state.isSending ? AppColors.border : AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.send_rounded,
                        size: 18, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<dynamic> _buildItems(List<ChatMessage> msgs) {
    final items = <dynamic>[];
    String? lastDate;
    for (final msg in msgs) {
      final dateLabel = _dateLabel(msg.createdAt);
      if (dateLabel != lastDate) {
        items.add(dateLabel);
        lastDate = dateLabel;
      }
      items.add(msg);
    }
    return items;
  }

  String _dateLabel(DateTime dt) {
    final now   = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final d     = DateTime(dt.year, dt.month, dt.day);
    if (d == today) return 'Today';
    if (d == today.subtract(const Duration(days: 1))) return 'Yesterday';
    return DateFormat('MMMM d, yyyy').format(dt);
  }
}

class _DateSeparator extends StatelessWidget {
  final String label;
  const _DateSeparator({required this.label});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 10),
    child: Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.black.withAlpha(18),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(label,
            style: const TextStyle(
                fontSize: 12, color: AppColors.gray, fontWeight: FontWeight.w500)),
      ),
    ),
  );
}

class _Bubble extends StatelessWidget {
  final ChatMessage msg;
  final bool isMine;
  final bool showName;
  const _Bubble({required this.msg, required this.isMine, required this.showName});

  @override
  Widget build(BuildContext context) {
    final time     = DateFormat('h:mm a').format(msg.createdAt);
    final initials = msg.sender.fullName
        .split(' ')
        .map((n) => n.isNotEmpty ? n[0] : '')
        .take(2)
        .join()
        .toUpperCase();

    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment:
            isMine ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isMine)
            Opacity(
              opacity: showName ? 1.0 : 0.0,
              child: Container(
                width: 30,
                height: 30,
                margin: const EdgeInsets.only(right: 6, bottom: 2),
                decoration: const BoxDecoration(
                    color: AppColors.primary, shape: BoxShape.circle),
                child: Center(
                  child: Text(initials,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700)),
                ),
              ),
            ),

          Flexible(
            child: Column(
              crossAxisAlignment:
                  isMine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                if (showName && !isMine)
                  Padding(
                    padding: const EdgeInsets.only(left: 4, bottom: 3),
                    child: Text(
                      '${msg.sender.fullName} • $time',
                      style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.gray,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                Container(
                  constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.70),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 13, vertical: 9),
                  decoration: BoxDecoration(
                    color: isMine ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(18),
                      topRight: const Radius.circular(18),
                      bottomLeft: Radius.circular(isMine ? 18 : 4),
                      bottomRight: Radius.circular(isMine ? 4 : 18),
                    ),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black.withAlpha(10), blurRadius: 4)
                    ],
                  ),
                  child: Text(msg.content,
                      style: TextStyle(
                          fontSize: 14,
                          color: isMine ? Colors.white : AppColors.dark,
                          height: 1.4)),
                ),
                if (isMine)
                  Padding(
                    padding: const EdgeInsets.only(top: 3, right: 2),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(time,
                            style: const TextStyle(
                                fontSize: 10, color: AppColors.gray)),
                        const SizedBox(width: 3),
                        const Icon(Icons.done_all_rounded,
                            size: 12, color: AppColors.primary),
                      ],
                    ),
                  )
                else if (!showName)
                  Padding(
                    padding: const EdgeInsets.only(top: 1, left: 4),
                    child: Text(time,
                        style: const TextStyle(
                            fontSize: 10, color: AppColors.gray)),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
