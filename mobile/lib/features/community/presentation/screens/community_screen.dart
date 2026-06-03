import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/community_provider.dart';
import '../../data/community_models.dart';
import '../../../../core/theme/app_theme.dart';

const _coverColors = {
  'green':  Color(0xFF22C55E),
  'blue':   Color(0xFF3B82F6),
  'purple': Color(0xFFA855F7),
  'amber':  Color(0xFFF59E0B),
  'red':    Color(0xFFEF4444),
  'teal':   Color(0xFF14B8A6),
};

class CommunityScreen extends ConsumerStatefulWidget {
  const CommunityScreen({super.key});

  @override
  ConsumerState<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends ConsumerState<CommunityScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tab;
  final _searchCtrl = TextEditingController();
  String _query = '';

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
    Future.microtask(() => ref.read(communityProvider.notifier).loadGroups());
  }

  @override
  void dispose() {
    _tab.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(communityProvider);
    final mine     = state.groups.where((g) => g.isJoined).toList();
    final discover = state.groups.where((g) => !g.isJoined).toList();

    List<CommunityGroup> filtered(List<CommunityGroup> list) => _query.isEmpty
        ? list
        : list.where((g) =>
            g.name.toLowerCase().contains(_query.toLowerCase()) ||
            (g.primaryRoute?.toLowerCase().contains(_query.toLowerCase()) ?? false)).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/community/create'),
        backgroundColor: AppColors.primary,
        shape: const CircleBorder(),
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
      ),
      body: NestedScrollView(
        headerSliverBuilder: (ctx, isScrolled) => [
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              child: SafeArea(
                bottom: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
                      child: Row(
                        children: [
                          const Text('Community',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: AppColors.dark)),
                          const Spacer(),
                          TextButton.icon(
                            onPressed: () => context.push('/community/create'),
                            icon: const Icon(Icons.add, size: 15, color: AppColors.primary),
                            label: const Text('New Group',
                                style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 13)),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            const Padding(
                              padding: EdgeInsets.only(left: 12),
                              child: Icon(Icons.search, size: 18, color: AppColors.gray),
                            ),
                            Expanded(
                              child: TextField(
                                controller: _searchCtrl,
                                onChanged: (v) => setState(() => _query = v),
                                style: const TextStyle(fontSize: 14),
                                decoration: const InputDecoration(
                                  hintText: 'Search groups or routes…',
                                  hintStyle: TextStyle(color: AppColors.gray, fontSize: 14),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    TabBar(
                      controller: _tab,
                      labelColor: AppColors.primary,
                      unselectedLabelColor: AppColors.gray,
                      indicatorColor: AppColors.primary,
                      labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      tabs: [
                        Tab(text: mine.isEmpty ? 'My Groups' : 'My Groups (${mine.length})'),
                        const Tab(text: 'Discover'),
                      ],
                    ),
                    const Divider(height: 1),
                  ],
                ),
              ),
            ),
          ),
        ],
        body: TabBarView(
          controller: _tab,
          children: [
            _GroupList(groups: filtered(mine), isLoading: state.isLoading, isMine: true),
            _GroupList(groups: filtered(discover), isLoading: state.isLoading, isMine: false),
          ],
        ),
      ),
    );
  }
}

class _GroupList extends ConsumerWidget {
  final List<CommunityGroup> groups;
  final bool isLoading;
  final bool isMine;
  const _GroupList({required this.groups, required this.isLoading, required this.isMine});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (isLoading) {
      return ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: 3,
        separatorBuilder: (ctx, i) => const SizedBox(height: 10),
        itemBuilder: (ctx, i) => Container(
          height: 88,
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border)),
        ),
      );
    }

    if (groups.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.people_outline_rounded, size: 40, color: AppColors.border),
              const SizedBox(height: 12),
              Text(isMine ? "You haven't joined any groups yet" : 'No groups found',
                  style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.gray),
                  textAlign: TextAlign.center),
              if (isMine) ...[
                const SizedBox(height: 4),
                const Text('Switch to Discover to find groups on your route',
                    style: TextStyle(fontSize: 12, color: AppColors.gray), textAlign: TextAlign.center),
              ],
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: groups.length,
      separatorBuilder: (ctx, i) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) => _GroupCard(group: groups[i]),
    );
  }
}

class _GroupCard extends ConsumerWidget {
  final CommunityGroup group;
  const _GroupCard({required this.group});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color    = _coverColors[group.coverColor] ?? AppColors.primary;
    final initials = group.name.split(' ').map((w) => w.isNotEmpty ? w[0] : '').take(2).join().toUpperCase();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
              child: Center(
                child: Text(initials,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(group.name,
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.dark),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                      ),
                      if (group.privacy == GroupPrivacy.private)
                        const Icon(Icons.lock_outline, size: 13, color: AppColors.gray),
                    ],
                  ),
                  if (group.primaryRoute != null)
                    Text(group.primaryRoute!,
                        style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w500),
                        maxLines: 1, overflow: TextOverflow.ellipsis),
                  if (group.description != null)
                    Text(group.description!,
                        style: const TextStyle(fontSize: 12, color: AppColors.gray),
                        maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.people_outline, size: 13, color: AppColors.gray),
                      const SizedBox(width: 4),
                      Text('${group.memberCount} members',
                          style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                      const Spacer(),
                      group.isJoined
                          ? GestureDetector(
                              onTap: () => context.push('/community/${group.id}/chat'),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text('Open Chat',
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                              ),
                            )
                          : GestureDetector(
                              onTap: () => ref.read(communityProvider.notifier).joinGroup(group.id),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.primary),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text('+ Join',
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary)),
                              ),
                            ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
