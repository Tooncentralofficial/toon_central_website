import { CommentType, PaginationInfo } from "@/helpers/types";

/**
 * Shared state helpers for the shorts comment lists. Both the carousel
 * (`shortsContent`) and the single short page (`ShortView`) keep the paginated
 * comments in local state, so the optimistic bookkeeping lives here instead of
 * being written twice.
 *
 * A comment that is on screen before the server has confirmed it carries a
 * temporary id plus these flags, so a refetch can tell it apart from real data.
 */
export type ShortComment = Omit<CommentType, "id"> & {
  id: number | string;
  __optimistic?: boolean;
  __pending?: boolean;
};

export interface ShortCommentsState {
  comments: ShortComment[];
  pagination: PaginationInfo;
}

export const EMPTY_COMMENT_PAGINATION: PaginationInfo = {
  total: 0,
  count: 0,
  perPage: 10,
  currentPage: 1,
  totalPages: 1,
};

export const EMPTY_COMMENT_STATE: ShortCommentsState = {
  comments: [],
  pagination: EMPTY_COMMENT_PAGINATION,
};

export const dedupeCommentsById = (comments: ShortComment[]) => {
  const seen = new Set<number | string>();
  return comments.filter((comment) => {
    if (comment?.id == null) return true;
    if (seen.has(comment.id)) return false;
    seen.add(comment.id);
    return true;
  });
};

const signatureOf = (comment: ShortComment) =>
  `${comment?.user_id ?? ""}|${(comment?.comment ?? "").trim()}`;

/**
 * Fold a page of server comments into the current list. Page 1 is authoritative
 * for the newest comments, so confirmed optimistic entries are dropped there in
 * favour of the real rows; later pages are appended and de-duped, which also
 * keeps a repeat fetch of the same page from doubling the list. Comments still
 * in flight are always kept so they never blink out mid-request.
 */
export const mergeServerComments = (
  prev: ShortCommentsState,
  serverComments: ShortComment[],
  pagination?: PaginationInfo | null
): ShortCommentsState => {
  const currentPage = pagination?.currentPage || 1;
  const inFlight = prev.comments.filter((comment) => comment.__pending);

  // A saved optimistic entry keeps its temporary id unless the API handed back
  // the real row, so match on author + text as well to avoid showing it twice
  // once the page holding the real comment loads.
  const serverSignatures = new Set(serverComments.map(signatureOf));
  const isSuperseded = (comment: ShortComment) =>
    !!comment.__optimistic &&
    !comment.__pending &&
    serverSignatures.has(signatureOf(comment));

  const merged =
    currentPage === 1
      ? serverComments
      : dedupeCommentsById([
          ...prev.comments.filter(
            (comment) => !comment.__pending && !isSuperseded(comment)
          ),
          ...serverComments,
        ]);

  return {
    comments: dedupeCommentsById([...inFlight, ...merged]),
    pagination: pagination || EMPTY_COMMENT_PAGINATION,
  };
};

/** Render a comment immediately, before the request that saves it resolves. */
export const withOptimisticComment = (
  prev: ShortCommentsState,
  comment: ShortComment
): ShortCommentsState => ({
  comments: [
    { ...comment, __optimistic: true, __pending: true },
    ...prev.comments,
  ],
  pagination: {
    ...prev.pagination,
    total: (prev.pagination?.total ?? 0) + 1,
    count: (prev.pagination?.count ?? 0) + 1,
  },
});

/**
 * Saved: swap in the server row when the API hands one back, otherwise just
 * clear the pending flag and let the refetch replace it.
 */
export const withConfirmedComment = (
  prev: ShortCommentsState,
  tempId: number | string,
  saved?: Partial<ShortComment> | null
): ShortCommentsState => ({
  ...prev,
  comments: prev.comments.map((comment) =>
    comment.id === tempId
      ? { ...comment, ...(saved || {}), __pending: false }
      : comment
  ),
});

/** Failed: pull the comment back off the list and undo the count bump. */
export const withoutOptimisticComment = (
  prev: ShortCommentsState,
  tempId: number | string
): ShortCommentsState => ({
  comments: prev.comments.filter((comment) => comment.id !== tempId),
  pagination: {
    ...prev.pagination,
    total: Math.max(0, (prev.pagination?.total ?? 1) - 1),
    count: Math.max(0, (prev.pagination?.count ?? 1) - 1),
  },
});
