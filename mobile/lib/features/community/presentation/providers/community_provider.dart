import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/community_models.dart';
import '../../data/community_repository.dart';

class CommunityState {
  final List<CommunityGroup> groups;
  final Map<String, List<ChatMessage>> messages;
  final bool isLoading;
  final bool isSending;
  final String? error;

  const CommunityState({
    this.groups = const [],
    this.messages = const {},
    this.isLoading = false,
    this.isSending = false,
    this.error,
  });

  CommunityState copyWith({
    List<CommunityGroup>? groups,
    Map<String, List<ChatMessage>>? messages,
    bool? isLoading,
    bool? isSending,
    String? error,
  }) => CommunityState(
    groups:    groups    ?? this.groups,
    messages:  messages  ?? this.messages,
    isLoading: isLoading ?? this.isLoading,
    isSending: isSending ?? this.isSending,
    error:     error     ?? this.error,
  );
}

class CommunityNotifier extends StateNotifier<CommunityState> {
  final CommunityRepository _repo;
  CommunityNotifier(this._repo) : super(const CommunityState());

  Future<void> loadGroups() async {
    state = state.copyWith(isLoading: true);
    try {
      final groups = await _repo.getGroups();
      state = state.copyWith(groups: groups, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadMessages(String groupId) async {
    state = state.copyWith(isLoading: true);
    try {
      final msgs = await _repo.getMessages(groupId);
      final updated = Map<String, List<ChatMessage>>.from(state.messages)
        ..[groupId] = msgs;
      state = state.copyWith(messages: updated, isLoading: false);
    } catch (_) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> joinGroup(String groupId) async {
    await _repo.joinGroup(groupId);
    final updated = state.groups.map((g) => g.id == groupId
        ? g.copyWith(isJoined: true, memberCount: g.memberCount + 1)
        : g).toList();
    state = state.copyWith(groups: updated);
  }

  Future<bool> createGroup({required String name, String? primaryRoute, String? description, required GroupPrivacy privacy}) async {
    try {
      final group = await _repo.createGroup(name: name, primaryRoute: primaryRoute, description: description, privacy: privacy);
      state = state.copyWith(groups: [group, ...state.groups]);
      return true;
    } catch (_) { return false; }
  }

  Future<void> sendMessage(String groupId, String content) async {
    state = state.copyWith(isSending: true);
    try {
      final msg = await _repo.sendMessage(groupId, content);
      final current = List<ChatMessage>.from(state.messages[groupId] ?? [])..add(msg);
      final updated = Map<String, List<ChatMessage>>.from(state.messages)..[groupId] = current;
      state = state.copyWith(messages: updated, isSending: false);
    } catch (_) {
      state = state.copyWith(isSending: false);
    }
  }
}

final communityRepositoryProvider = Provider<CommunityRepository>((_) => MockCommunityRepository());

final communityProvider = StateNotifierProvider<CommunityNotifier, CommunityState>(
  (ref) => CommunityNotifier(ref.read(communityRepositoryProvider)),
);
