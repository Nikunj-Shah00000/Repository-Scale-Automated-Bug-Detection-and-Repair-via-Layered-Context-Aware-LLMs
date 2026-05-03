import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActivityItem, AgentSession, Bug, CreateAgentSessionBody, CreateBugBody, CreatePatchBody, CreateRepositoryBody, CreateTranslationBody, DashboardStats, GetRecentActivityParams, HealthStatus, LanguageStat, ListBugsParams, ListPatchesParams, ListVulnerabilitiesParams, Patch, Repository, SeverityBreakdown, TranslationJob, UpdateBugBody, UpdatePatchBody, UpdateVulnerabilityBody, Vulnerability } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all repositories
 */
export declare const getListRepositoriesUrl: () => string;
export declare const listRepositories: (options?: RequestInit) => Promise<Repository[]>;
export declare const getListRepositoriesQueryKey: () => readonly ["/api/repositories"];
export declare const getListRepositoriesQueryOptions: <TData = Awaited<ReturnType<typeof listRepositories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRepositories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listRepositories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListRepositoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listRepositories>>>;
export type ListRepositoriesQueryError = ErrorType<unknown>;
/**
 * @summary List all repositories
 */
export declare function useListRepositories<TData = Awaited<ReturnType<typeof listRepositories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRepositories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a repository for analysis
 */
export declare const getCreateRepositoryUrl: () => string;
export declare const createRepository: (createRepositoryBody: CreateRepositoryBody, options?: RequestInit) => Promise<Repository>;
export declare const getCreateRepositoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRepository>>, TError, {
        data: BodyType<CreateRepositoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRepository>>, TError, {
    data: BodyType<CreateRepositoryBody>;
}, TContext>;
export type CreateRepositoryMutationResult = NonNullable<Awaited<ReturnType<typeof createRepository>>>;
export type CreateRepositoryMutationBody = BodyType<CreateRepositoryBody>;
export type CreateRepositoryMutationError = ErrorType<unknown>;
/**
 * @summary Add a repository for analysis
 */
export declare const useCreateRepository: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRepository>>, TError, {
        data: BodyType<CreateRepositoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createRepository>>, TError, {
    data: BodyType<CreateRepositoryBody>;
}, TContext>;
/**
 * @summary Get a repository by ID
 */
export declare const getGetRepositoryUrl: (id: number) => string;
export declare const getRepository: (id: number, options?: RequestInit) => Promise<Repository>;
export declare const getGetRepositoryQueryKey: (id: number) => readonly [`/api/repositories/${number}`];
export declare const getGetRepositoryQueryOptions: <TData = Awaited<ReturnType<typeof getRepository>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRepository>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRepository>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRepositoryQueryResult = NonNullable<Awaited<ReturnType<typeof getRepository>>>;
export type GetRepositoryQueryError = ErrorType<unknown>;
/**
 * @summary Get a repository by ID
 */
export declare function useGetRepository<TData = Awaited<ReturnType<typeof getRepository>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRepository>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Remove a repository
 */
export declare const getDeleteRepositoryUrl: (id: number) => string;
export declare const deleteRepository: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteRepositoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRepository>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRepository>>, TError, {
    id: number;
}, TContext>;
export type DeleteRepositoryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRepository>>>;
export type DeleteRepositoryMutationError = ErrorType<unknown>;
/**
 * @summary Remove a repository
 */
export declare const useDeleteRepository: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRepository>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteRepository>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List bugs with optional filtering
 */
export declare const getListBugsUrl: (params?: ListBugsParams) => string;
export declare const listBugs: (params?: ListBugsParams, options?: RequestInit) => Promise<Bug[]>;
export declare const getListBugsQueryKey: (params?: ListBugsParams) => readonly ["/api/bugs", ...ListBugsParams[]];
export declare const getListBugsQueryOptions: <TData = Awaited<ReturnType<typeof listBugs>>, TError = ErrorType<unknown>>(params?: ListBugsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBugs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBugs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBugsQueryResult = NonNullable<Awaited<ReturnType<typeof listBugs>>>;
export type ListBugsQueryError = ErrorType<unknown>;
/**
 * @summary List bugs with optional filtering
 */
export declare function useListBugs<TData = Awaited<ReturnType<typeof listBugs>>, TError = ErrorType<unknown>>(params?: ListBugsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBugs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Report a bug
 */
export declare const getCreateBugUrl: () => string;
export declare const createBug: (createBugBody: CreateBugBody, options?: RequestInit) => Promise<Bug>;
export declare const getCreateBugMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBug>>, TError, {
        data: BodyType<CreateBugBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBug>>, TError, {
    data: BodyType<CreateBugBody>;
}, TContext>;
export type CreateBugMutationResult = NonNullable<Awaited<ReturnType<typeof createBug>>>;
export type CreateBugMutationBody = BodyType<CreateBugBody>;
export type CreateBugMutationError = ErrorType<unknown>;
/**
 * @summary Report a bug
 */
export declare const useCreateBug: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBug>>, TError, {
        data: BodyType<CreateBugBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBug>>, TError, {
    data: BodyType<CreateBugBody>;
}, TContext>;
/**
 * @summary Get bug details
 */
export declare const getGetBugUrl: (id: number) => string;
export declare const getBug: (id: number, options?: RequestInit) => Promise<Bug>;
export declare const getGetBugQueryKey: (id: number) => readonly [`/api/bugs/${number}`];
export declare const getGetBugQueryOptions: <TData = Awaited<ReturnType<typeof getBug>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBug>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBug>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBugQueryResult = NonNullable<Awaited<ReturnType<typeof getBug>>>;
export type GetBugQueryError = ErrorType<unknown>;
/**
 * @summary Get bug details
 */
export declare function useGetBug<TData = Awaited<ReturnType<typeof getBug>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBug>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update bug status or details
 */
export declare const getUpdateBugUrl: (id: number) => string;
export declare const updateBug: (id: number, updateBugBody: UpdateBugBody, options?: RequestInit) => Promise<Bug>;
export declare const getUpdateBugMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBug>>, TError, {
        id: number;
        data: BodyType<UpdateBugBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBug>>, TError, {
    id: number;
    data: BodyType<UpdateBugBody>;
}, TContext>;
export type UpdateBugMutationResult = NonNullable<Awaited<ReturnType<typeof updateBug>>>;
export type UpdateBugMutationBody = BodyType<UpdateBugBody>;
export type UpdateBugMutationError = ErrorType<unknown>;
/**
 * @summary Update bug status or details
 */
export declare const useUpdateBug: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBug>>, TError, {
        id: number;
        data: BodyType<UpdateBugBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBug>>, TError, {
    id: number;
    data: BodyType<UpdateBugBody>;
}, TContext>;
/**
 * @summary Delete a bug
 */
export declare const getDeleteBugUrl: (id: number) => string;
export declare const deleteBug: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteBugMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBug>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBug>>, TError, {
    id: number;
}, TContext>;
export type DeleteBugMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBug>>>;
export type DeleteBugMutationError = ErrorType<unknown>;
/**
 * @summary Delete a bug
 */
export declare const useDeleteBug: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBug>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBug>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all patches
 */
export declare const getListPatchesUrl: (params?: ListPatchesParams) => string;
export declare const listPatches: (params?: ListPatchesParams, options?: RequestInit) => Promise<Patch[]>;
export declare const getListPatchesQueryKey: (params?: ListPatchesParams) => readonly ["/api/patches", ...ListPatchesParams[]];
export declare const getListPatchesQueryOptions: <TData = Awaited<ReturnType<typeof listPatches>>, TError = ErrorType<unknown>>(params?: ListPatchesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPatches>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPatchesQueryResult = NonNullable<Awaited<ReturnType<typeof listPatches>>>;
export type ListPatchesQueryError = ErrorType<unknown>;
/**
 * @summary List all patches
 */
export declare function useListPatches<TData = Awaited<ReturnType<typeof listPatches>>, TError = ErrorType<unknown>>(params?: ListPatchesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a patch for a bug
 */
export declare const getCreatePatchUrl: () => string;
export declare const createPatch: (createPatchBody: CreatePatchBody, options?: RequestInit) => Promise<Patch>;
export declare const getCreatePatchMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatch>>, TError, {
        data: BodyType<CreatePatchBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPatch>>, TError, {
    data: BodyType<CreatePatchBody>;
}, TContext>;
export type CreatePatchMutationResult = NonNullable<Awaited<ReturnType<typeof createPatch>>>;
export type CreatePatchMutationBody = BodyType<CreatePatchBody>;
export type CreatePatchMutationError = ErrorType<unknown>;
/**
 * @summary Create a patch for a bug
 */
export declare const useCreatePatch: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatch>>, TError, {
        data: BodyType<CreatePatchBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPatch>>, TError, {
    data: BodyType<CreatePatchBody>;
}, TContext>;
/**
 * @summary Get patch details
 */
export declare const getGetPatchUrl: (id: number) => string;
export declare const getPatch: (id: number, options?: RequestInit) => Promise<Patch>;
export declare const getGetPatchQueryKey: (id: number) => readonly [`/api/patches/${number}`];
export declare const getGetPatchQueryOptions: <TData = Awaited<ReturnType<typeof getPatch>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPatch>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPatchQueryResult = NonNullable<Awaited<ReturnType<typeof getPatch>>>;
export type GetPatchQueryError = ErrorType<unknown>;
/**
 * @summary Get patch details
 */
export declare function useGetPatch<TData = Awaited<ReturnType<typeof getPatch>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Apply or reject a patch
 */
export declare const getUpdatePatchUrl: (id: number) => string;
export declare const updatePatch: (id: number, updatePatchBody: UpdatePatchBody, options?: RequestInit) => Promise<Patch>;
export declare const getUpdatePatchMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatch>>, TError, {
        id: number;
        data: BodyType<UpdatePatchBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePatch>>, TError, {
    id: number;
    data: BodyType<UpdatePatchBody>;
}, TContext>;
export type UpdatePatchMutationResult = NonNullable<Awaited<ReturnType<typeof updatePatch>>>;
export type UpdatePatchMutationBody = BodyType<UpdatePatchBody>;
export type UpdatePatchMutationError = ErrorType<unknown>;
/**
 * @summary Apply or reject a patch
 */
export declare const useUpdatePatch: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatch>>, TError, {
        id: number;
        data: BodyType<UpdatePatchBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePatch>>, TError, {
    id: number;
    data: BodyType<UpdatePatchBody>;
}, TContext>;
/**
 * @summary List translation jobs
 */
export declare const getListTranslationsUrl: () => string;
export declare const listTranslations: (options?: RequestInit) => Promise<TranslationJob[]>;
export declare const getListTranslationsQueryKey: () => readonly ["/api/translations"];
export declare const getListTranslationsQueryOptions: <TData = Awaited<ReturnType<typeof listTranslations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTranslations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTranslations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTranslationsQueryResult = NonNullable<Awaited<ReturnType<typeof listTranslations>>>;
export type ListTranslationsQueryError = ErrorType<unknown>;
/**
 * @summary List translation jobs
 */
export declare function useListTranslations<TData = Awaited<ReturnType<typeof listTranslations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTranslations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a code translation job
 */
export declare const getCreateTranslationUrl: () => string;
export declare const createTranslation: (createTranslationBody: CreateTranslationBody, options?: RequestInit) => Promise<TranslationJob>;
export declare const getCreateTranslationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError, {
        data: BodyType<CreateTranslationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError, {
    data: BodyType<CreateTranslationBody>;
}, TContext>;
export type CreateTranslationMutationResult = NonNullable<Awaited<ReturnType<typeof createTranslation>>>;
export type CreateTranslationMutationBody = BodyType<CreateTranslationBody>;
export type CreateTranslationMutationError = ErrorType<unknown>;
/**
 * @summary Submit a code translation job
 */
export declare const useCreateTranslation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError, {
        data: BodyType<CreateTranslationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTranslation>>, TError, {
    data: BodyType<CreateTranslationBody>;
}, TContext>;
/**
 * @summary Get a translation job
 */
export declare const getGetTranslationUrl: (id: number) => string;
export declare const getTranslation: (id: number, options?: RequestInit) => Promise<TranslationJob>;
export declare const getGetTranslationQueryKey: (id: number) => readonly [`/api/translations/${number}`];
export declare const getGetTranslationQueryOptions: <TData = Awaited<ReturnType<typeof getTranslation>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTranslation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTranslation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTranslationQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslation>>>;
export type GetTranslationQueryError = ErrorType<unknown>;
/**
 * @summary Get a translation job
 */
export declare function useGetTranslation<TData = Awaited<ReturnType<typeof getTranslation>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTranslation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List security vulnerabilities
 */
export declare const getListVulnerabilitiesUrl: (params?: ListVulnerabilitiesParams) => string;
export declare const listVulnerabilities: (params?: ListVulnerabilitiesParams, options?: RequestInit) => Promise<Vulnerability[]>;
export declare const getListVulnerabilitiesQueryKey: (params?: ListVulnerabilitiesParams) => readonly ["/api/vulnerabilities", ...ListVulnerabilitiesParams[]];
export declare const getListVulnerabilitiesQueryOptions: <TData = Awaited<ReturnType<typeof listVulnerabilities>>, TError = ErrorType<unknown>>(params?: ListVulnerabilitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVulnerabilities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listVulnerabilities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListVulnerabilitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listVulnerabilities>>>;
export type ListVulnerabilitiesQueryError = ErrorType<unknown>;
/**
 * @summary List security vulnerabilities
 */
export declare function useListVulnerabilities<TData = Awaited<ReturnType<typeof listVulnerabilities>>, TError = ErrorType<unknown>>(params?: ListVulnerabilitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVulnerabilities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get vulnerability details
 */
export declare const getGetVulnerabilityUrl: (id: number) => string;
export declare const getVulnerability: (id: number, options?: RequestInit) => Promise<Vulnerability>;
export declare const getGetVulnerabilityQueryKey: (id: number) => readonly [`/api/vulnerabilities/${number}`];
export declare const getGetVulnerabilityQueryOptions: <TData = Awaited<ReturnType<typeof getVulnerability>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVulnerability>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVulnerability>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVulnerabilityQueryResult = NonNullable<Awaited<ReturnType<typeof getVulnerability>>>;
export type GetVulnerabilityQueryError = ErrorType<unknown>;
/**
 * @summary Get vulnerability details
 */
export declare function useGetVulnerability<TData = Awaited<ReturnType<typeof getVulnerability>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVulnerability>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update vulnerability status
 */
export declare const getUpdateVulnerabilityUrl: (id: number) => string;
export declare const updateVulnerability: (id: number, updateVulnerabilityBody: UpdateVulnerabilityBody, options?: RequestInit) => Promise<Vulnerability>;
export declare const getUpdateVulnerabilityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateVulnerability>>, TError, {
        id: number;
        data: BodyType<UpdateVulnerabilityBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateVulnerability>>, TError, {
    id: number;
    data: BodyType<UpdateVulnerabilityBody>;
}, TContext>;
export type UpdateVulnerabilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateVulnerability>>>;
export type UpdateVulnerabilityMutationBody = BodyType<UpdateVulnerabilityBody>;
export type UpdateVulnerabilityMutationError = ErrorType<unknown>;
/**
 * @summary Update vulnerability status
 */
export declare const useUpdateVulnerability: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateVulnerability>>, TError, {
        id: number;
        data: BodyType<UpdateVulnerabilityBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateVulnerability>>, TError, {
    id: number;
    data: BodyType<UpdateVulnerabilityBody>;
}, TContext>;
/**
 * @summary List agent debugging sessions
 */
export declare const getListAgentSessionsUrl: () => string;
export declare const listAgentSessions: (options?: RequestInit) => Promise<AgentSession[]>;
export declare const getListAgentSessionsQueryKey: () => readonly ["/api/agents"];
export declare const getListAgentSessionsQueryOptions: <TData = Awaited<ReturnType<typeof listAgentSessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgentSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAgentSessions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAgentSessionsQueryResult = NonNullable<Awaited<ReturnType<typeof listAgentSessions>>>;
export type ListAgentSessionsQueryError = ErrorType<unknown>;
/**
 * @summary List agent debugging sessions
 */
export declare function useListAgentSessions<TData = Awaited<ReturnType<typeof listAgentSessions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAgentSessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start a multi-agent debugging session
 */
export declare const getCreateAgentSessionUrl: () => string;
export declare const createAgentSession: (createAgentSessionBody: CreateAgentSessionBody, options?: RequestInit) => Promise<AgentSession>;
export declare const getCreateAgentSessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAgentSession>>, TError, {
        data: BodyType<CreateAgentSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAgentSession>>, TError, {
    data: BodyType<CreateAgentSessionBody>;
}, TContext>;
export type CreateAgentSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createAgentSession>>>;
export type CreateAgentSessionMutationBody = BodyType<CreateAgentSessionBody>;
export type CreateAgentSessionMutationError = ErrorType<unknown>;
/**
 * @summary Start a multi-agent debugging session
 */
export declare const useCreateAgentSession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAgentSession>>, TError, {
        data: BodyType<CreateAgentSessionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAgentSession>>, TError, {
    data: BodyType<CreateAgentSessionBody>;
}, TContext>;
/**
 * @summary Get agent session details with reasoning steps
 */
export declare const getGetAgentSessionUrl: (id: number) => string;
export declare const getAgentSession: (id: number, options?: RequestInit) => Promise<AgentSession>;
export declare const getGetAgentSessionQueryKey: (id: number) => readonly [`/api/agents/${number}`];
export declare const getGetAgentSessionQueryOptions: <TData = Awaited<ReturnType<typeof getAgentSession>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgentSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAgentSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAgentSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getAgentSession>>>;
export type GetAgentSessionQueryError = ErrorType<unknown>;
/**
 * @summary Get agent session details with reasoning steps
 */
export declare function useGetAgentSession<TData = Awaited<ReturnType<typeof getAgentSession>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAgentSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get high-level platform statistics
 */
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get high-level platform statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent activity timeline
 */
export declare const getGetRecentActivityUrl: (params?: GetRecentActivityParams) => string;
export declare const getRecentActivity: (params?: GetRecentActivityParams, options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetRecentActivityQueryKey: (params?: GetRecentActivityParams) => readonly ["/api/dashboard/activity", ...GetRecentActivityParams[]];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(params?: GetRecentActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent activity timeline
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(params?: GetRecentActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get bug count by severity
 */
export declare const getGetSeverityBreakdownUrl: () => string;
export declare const getSeverityBreakdown: (options?: RequestInit) => Promise<SeverityBreakdown>;
export declare const getGetSeverityBreakdownQueryKey: () => readonly ["/api/dashboard/severity-breakdown"];
export declare const getGetSeverityBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getSeverityBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSeverityBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSeverityBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSeverityBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getSeverityBreakdown>>>;
export type GetSeverityBreakdownQueryError = ErrorType<unknown>;
/**
 * @summary Get bug count by severity
 */
export declare function useGetSeverityBreakdown<TData = Awaited<ReturnType<typeof getSeverityBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSeverityBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get bug/patch counts by language
 */
export declare const getGetLanguageBreakdownUrl: () => string;
export declare const getLanguageBreakdown: (options?: RequestInit) => Promise<LanguageStat[]>;
export declare const getGetLanguageBreakdownQueryKey: () => readonly ["/api/dashboard/language-breakdown"];
export declare const getGetLanguageBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getLanguageBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLanguageBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLanguageBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLanguageBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getLanguageBreakdown>>>;
export type GetLanguageBreakdownQueryError = ErrorType<unknown>;
/**
 * @summary Get bug/patch counts by language
 */
export declare function useGetLanguageBreakdown<TData = Awaited<ReturnType<typeof getLanguageBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLanguageBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map