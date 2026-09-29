import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { buildApiUrl } from "@/lib/helper";

export interface PosterImage {
  _id: string;
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export interface Poster {
  _id: string;
  title: string;
  description: string;
  category: string;
  dimensions: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  tags: string[];
  images: PosterImage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetAllInventoryResponse {
  data: {
    posters: Poster[];
    pagination: PaginationInfo;
    filters: PosterFilter;
  };
}

export interface GetFeaturedPostersResponse {
  data: Array<Poster[]>;
}

export interface GetInventoryItemResponse {
  data: Poster;
}

export interface SearchInventoryResponse {
  data: {
    posters: Poster[];
    total: number;
  };
}

export interface CreateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    poster: Poster;
  };
}

export interface UpdateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    poster: Poster;
  };
}

export interface DeleteInventoryResponse {
  success: boolean;
  message: string;
}

export interface CategoryWithCount {
  category: string;
  count: number;
}

export interface FiltersResponse {
  data: {
    categories: CategoryWithCount[];
    materials: string[];
    dimensions: string[];
    tags: string[];
  };
}

export interface PosterFilter {
  isAvailable?: boolean;
  category?: string;
  tags?: string | string[];
  title?: string;
  dimensions?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  search?: string;
  sortBy?: "price" | "stock" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface GetAllInventoryParams {
  page?: number;
  limit?: number;
  filters?: PosterFilter;
}

export interface CreateInventoryItemParams {
  images: File[];
  itemDetails: {
    title: string;
    description: string;
    category: string;
    dimensions: string;
    price: number;
    stock: number;
    isAvailable?: boolean;
    tags?: string[];
    material?: string;
  };
}

export interface UpdateInventoryItemParams {
  id: string;
  images?: File[];
  updateDetails: Partial<{
    title: string;
    description: string;
    category: string;
    dimensions: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    tags: string[];
    material: string;
    imagesToDelete: string[];
  }>;
}

export interface SearchInventoryParams {
  query: string;
  limit?: number;
}

// ============================================================================
// API Definition
// ============================================================================

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Inventory", "Filters"],
  endpoints: (builder) => ({

    // -------------------------------------------------------------
    // 🔗 Backend: POST /api/inventory (InventoryController -> create)
    // Yeni poster məhsulunu şəkli ilə birlikdə (FormData) yaradır
    // -------------------------------------------------------------
    createInventoryItem: builder.mutation<CreateInventoryResponse, CreateInventoryItemParams>({
      query: ({ images, itemDetails }) => {
        const formData = new FormData();

        images.forEach((image) => { formData.append("images", image); });

        Object.entries(itemDetails).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return { url: "/inventory", method: "POST", body: formData };
      },
      transformResponse: (response: CreateInventoryResponse) => response,
      transformErrorResponse: (error) => error,
      invalidatesTags: ["Inventory"],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/inventory (InventoryController -> findAll)
    // Filter, axtarış və səhifələmə (pagination) ilə bütün posterləri gətirir
    // -------------------------------------------------------------
    getAllInventory: builder.query<GetAllInventoryResponse, GetAllInventoryParams>({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const tagsValue = filters.tags
          ? Array.isArray(filters.tags)
            ? filters.tags.join(",")
            : filters.tags
          : undefined;

        return buildApiUrl("/inventory", {
          page,
          limit,
          isAvailable: filters.isAvailable,
          category: filters.category,
          title: filters.title,
          dimensions: filters.dimensions,
          material: filters.material,
          search: filters.search,
          tags: tagsValue,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minStock: filters.minStock,
          maxStock: filters.maxStock,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });
      },
      transformResponse: (response: GetAllInventoryResponse) => response,
      transformErrorResponse: (error) => error,
      providesTags: (result) =>
        result
          ? [
            ...result.data.posters.map(({ _id }) => ({
              type: "Inventory" as const,
              id: _id,
            })),
            { type: "Inventory" as const, id: "LIST" },
          ]
          : [{ type: "Inventory" as const, id: "LIST" }],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/inventory/:id (InventoryController -> findOne)
    // Məhsulun ID-sinə görə posterin tam təfərrüatlarını gətirir
    // -------------------------------------------------------------
    getInventoryItemById: builder.query<GetInventoryItemResponse, string>({
      query: (id) => `/inventory/${id}`,
      transformResponse: (response: GetInventoryItemResponse) => response,
      transformErrorResponse: (error) => error,
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/search (SearchController -> search)
    // Axtarış sözünə görə məhsul soraqlayır
    // -------------------------------------------------------------
    searchInventoryItems: builder.query<SearchInventoryResponse, SearchInventoryParams>({
      query: ({ query, limit = 20 }) => `/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      transformResponse: (response: SearchInventoryResponse) => response,
      transformErrorResponse: (error) => error,
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: PUT /api/inventory/:id (InventoryController -> update)
    // Məhsul məlumatlarını və şəkillərini yeniləyir
    // -------------------------------------------------------------
    updateInventoryItem: builder.mutation<UpdateInventoryResponse, UpdateInventoryItemParams>({
      query: ({ id, images = [], updateDetails }) => {
        const formData = new FormData();

        images.forEach((image) => { formData.append("images", image); });

        Object.entries(updateDetails).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return { url: `/inventory/${id}`, method: "PUT", body: formData };
      },
      transformResponse: (response: UpdateInventoryResponse) => response,
      transformErrorResponse: (error) => error,
      invalidatesTags: (result, error, { id }) => [
        { type: "Inventory", id },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/inventory/featured (InventoryController -> getFeatured)
    // Əsas səhifədə nümayiş etdirilən xüsusi (featured) posterləri gətirir
    // -------------------------------------------------------------
    getFeaturedPosters: builder.query({
      query: () => `inventory/featured`,
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/inventory/categories/list (InventoryController -> getCategories)
    // Bütün kateqoriyaları və filter seçimlərini gətirir
    // -------------------------------------------------------------
    getAllFilters: builder.query<FiltersResponse, void>({
      query: () => "inventory/categories/list",
      transformResponse: (response: FiltersResponse) => response,
      transformErrorResponse: (error) => error,
      providesTags: ["Filters"],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: DELETE /api/inventory/:id (InventoryController -> softDelete)
    // Məhsulu deaktiv edir (Soft Delete)
    // -------------------------------------------------------------
    softDeleteInventoryItem: builder.mutation<DeleteInventoryResponse, string>({
      query: (id) => ({ url: `/inventory/${id}`, method: "DELETE", }),
      transformResponse: (response: DeleteInventoryResponse) => response,
      transformErrorResponse: (error) => error,
      invalidatesTags: (result, error, id) => [
        { type: "Inventory", id },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: DELETE /api/inventory/:id/hard (InventoryController -> hardDelete)
    // Məhsulu bazadan tamamilə silir (Hard Delete)
    // -------------------------------------------------------------
    deleteInventoryItem: builder.mutation<DeleteInventoryResponse, string>({
      query: (id) => ({
        url: `/inventory/${id}/hard`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteInventoryResponse) => response,
      transformErrorResponse: (error) => error,
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useCreateInventoryItemMutation,
  useGetAllInventoryQuery,
  useGetInventoryItemByIdQuery,
  useGetFeaturedPostersQuery,
  useSearchInventoryItemsQuery,
  useLazySearchInventoryItemsQuery,
  useUpdateInventoryItemMutation,
  useGetAllFiltersQuery,
  useSoftDeleteInventoryItemMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;
