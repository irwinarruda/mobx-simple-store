export type HandleViews<M, V, Include> = Include extends true ? M & V : M;
